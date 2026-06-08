' ============================================================
' 3D ARAÇ YÜKLEME OPTİMİZASYONU - VBA KOD
' Ağır paletler alta yerleştirilir
' ============================================================

Option Explicit

' Global değişkenler
Dim araclarWS As Worksheet
Dim paketlerWS As Worksheet
Dim sonuclarWS As Worksheet

Sub OptimizasyonuCalistir()
    '
    ' Ana Optimizasyon Fonksiyonu
    ' Araç seçimi yaparak paketleri optimal şekilde yerleştirir
    '
    
    On Error GoTo ErrorHandler
    
    Set araclarWS = ThisWorkbook.Sheets("Araçlar")
    Set paketlerWS = ThisWorkbook.Sheets("Paketler")
    Set sonuclarWS = ThisWorkbook.Sheets("Sonuçlar")
    
    ' Araç seçimini al
    Dim aracID As String
    aracID = InputBox("Araç ID girin (1, 2 veya 3):", "Araç Seçimi")
    
    If aracID = "" Then Exit Sub
    
    ' Araç bilgilerini getir
    Dim aracUz As Double, aracGen As Double, aracYuk As Double, aracMaxAg As Double
    Dim aracRow As Long
    
    Select Case aracID
        Case "1"
            aracRow = 2
        Case "2"
            aracRow = 3
        Case "3"
            aracRow = 4
        Case Else
            MsgBox "Geçersiz araç ID! Lütfen 1, 2 veya 3 girin.", vbCritical
            Exit Sub
    End Select
    
    aracUz = araclarWS.Cells(aracRow, 2).Value
    aracGen = araclarWS.Cells(aracRow, 3).Value
    aracYuk = araclarWS.Cells(aracRow, 4).Value
    aracMaxAg = araclarWS.Cells(aracRow, 5).Value
    
    ' Paket verilerini oku ve sırala
    Dim paketDizi() As Variant
    Dim paketSayisi As Long
    
    paketSayisi = paketlerWS.Cells(paketlerWS.Rows.Count, 1).End(xlUp).Row - 1
    ReDim paketDizi(1 To paketSayisi, 1 To 5)
    
    Dim i As Long
    For i = 1 To paketSayisi
        paketDizi(i, 1) = paketlerWS.Cells(i + 1, 1).Value ' ID
        paketDizi(i, 2) = paketlerWS.Cells(i + 1, 2).Value ' Uzunluk
        paketDizi(i, 3) = paketlerWS.Cells(i + 1, 3).Value ' Genişlik
        paketDizi(i, 4) = paketlerWS.Cells(i + 1, 4).Value ' Yükseklik
        paketDizi(i, 5) = paketlerWS.Cells(i + 1, 5).Value ' Ağırlık
    Next i
    
    ' Paketleri ağırlığa göre sırala (ağır olanlar önce - alta gelecek)
    SiralaPaketleri paketDizi
    
    ' Yerleşim hesaplaması
    Dim yerlesim() As Variant
    Dim toplamAg As Double
    Dim kullanilanHacim As Double
    
    ReDim yerlesim(1 To paketSayisi, 1 To 9)
    
    YerlesimHesapla paketDizi, aracUz, aracGen, aracYuk, aracMaxAg, _
                    yerlesim, toplamAg, kullanilanHacim, paketSayisi
    
    ' Sonuçları yaz
    SonuclariYaz yerlesim, aracID, aracUz, aracGen, aracYuk, _
                  aracMaxAg, toplamAg, kullanilanHacim, paketSayisi
    
    ' Başarı mesajı
    Dim yuzde As Double
    Dim tamamHacim As Double
    tamamHacim = aracUz * aracGen * aracYuk
    yuzde = (kullanilanHacim / tamamHacim) * 100
    
    MsgBox "✓ Optimizasyon tamamlandı!" & vbCrLf & vbCrLf & _
           "Araç: " & aracID & vbCrLf & _
           "Toplam Ağırlık: " & Format(toplamAg, "0.00") & " kg" & vbCrLf & _
           "Kapasite: " & Format(aracMaxAg, "0.00") & " kg" & vbCrLf & _
           "Kullanılan Hacim: " & Format(yuzde, "0.00") & "%", vbInformation
    
    sonuclarWS.Activate
    
    Exit Sub
ErrorHandler:
    MsgBox "Hata: " & Err.Description, vbCritical
End Sub

Sub SiralaPaketleri(ByRef paketDizi() As Variant)
    '
    ' Paketleri ağırlığa göre azalan sıraya sırala
    ' Ağır olanlar önce gelecek (alta yerleştirilecek)
    '
    
    Dim i As Long, j As Long, n As Long
    Dim temp As Variant
    
    n = UBound(paketDizi, 1)
    
    For i = 1 To n - 1
        For j = i + 1 To n
            If paketDizi(i, 5) < paketDizi(j, 5) Then
                ' Satırları değiştir (Bubble Sort)
                Dim k As Long
                ReDim temp(1 To 5)
                For k = 1 To 5
                    temp(k) = paketDizi(i, k)
                    paketDizi(i, k) = paketDizi(j, k)
                    paketDizi(j, k) = temp(k)
                Next k
            End If
        Next j
    Next i
End Sub

Sub YerlesimHesapla(paketDizi() As Variant, aracUz As Double, aracGen As Double, _
                    aracYuk As Double, aracMaxAg As Double, ByRef yerlesim() As Variant, _
                    ByRef toplamAg As Double, ByRef kullanilanHacim As Double, paketSayisi As Long)
    '
    ' 3D Bin Packing Algoritması - Bottom-Left-Back Heuristic
    '
    
    Dim i As Long, j As Long
    Dim x As Double, y As Double, z As Double
    Dim paketUz As Double, paketGen As Double, paketYuk As Double, paketAg As Double
    Dim yerlestirildi As Boolean
    
    toplamAg = 0
    kullanilanHacim = 0
    
    ' Her paket için yerleşim pozisyonunu bul
    For i = 1 To paketSayisi
        paketUz = paketDizi(i, 2)
        paketGen = paketDizi(i, 3)
        paketYuk = paketDizi(i, 4)
        paketAg = paketDizi(i, 5)
        
        ' Kapasite kontrolü
        If toplamAg + paketAg > aracMaxAg Then
            yerlesim(i, 9) = "Kapasite Aşıldı"
            GoTo NextPaket
        End If
        
        ' En iyi pozisyonu bul (soldan, arkadan, alttan)
        yerlestirildi = False
        
        ' Soldan başla
        x = 0
        z = 0 ' Alta yerleştir (ağır paketler)
        
        ' Y konumunu hesapla (daha önceki paketlerin üzerine)
        y = 0
        If i > 1 Then
            For j = 1 To i - 1
                If yerlesim(j, 9) = "Yerleştirildi" Then
                    ' Bir önceki paketin üstüne yerleştir
                    If yerlesim(j, 4) + yerlesim(j, 7) + paketYuk <= aracYuk Then
                        y = yerlesim(j, 4) + yerlesim(j, 7)
                        yerlestirildi = True
                        Exit For
                    End If
                End If
            Next j
        End If
        
        ' Kontrol: Paket araç içine sığıyor mu?
        If x + paketUz <= aracUz And y + paketGen <= aracGen And z + paketYuk <= aracYuk Then
            yerlesim(i, 1) = paketDizi(i, 1) ' ID
            yerlesim(i, 2) = x
            yerlesim(i, 3) = y
            yerlesim(i, 4) = z
            yerlesim(i, 5) = paketUz
            yerlesim(i, 6) = paketGen
            yerlesim(i, 7) = paketYuk
            yerlesim(i, 8) = paketAg
            yerlesim(i, 9) = "Yerleştirildi"
            
            toplamAg = toplamAg + paketAg
            kullanilanHacim = kullanilanHacim + (paketUz * paketGen * paketYuk)
        Else
            yerlesim(i, 9) = "Yer Yok"
        End If
        
NextPaket:
    Next i
End Sub

Sub SonuclariYaz(yerlesim() As Variant, aracID As String, aracUz As Double, _
                 aracGen As Double, aracYuk As Double, aracMaxAg As Double, _
                 toplamAg As Double, kullanilanHacim As Double, paketSayisi As Long)
    '
    ' Sonuçları Excel sayfasına yaz
    '
    
    ' Sayfayı temizle
    sonuclarWS.Cells.Clear
    
    ' Başlık
    With sonuclarWS.Range("A1")
        .Value = "YÜKLEME OPTİMİZASYONU SONUÇLARI"
        .Font.Bold = True
        .Font.Size = 14
        .Font.Color = RGB(0, 51, 102)
    End With
    
    ' İstatistikler
    sonuclarWS.Range("A3").Value = "Seçili Araç:"
    sonuclarWS.Range("B3").Value = "Araç " & aracID
    
    sonuclarWS.Range("A4").Value = "Araç Kapasitesi:"
    sonuclarWS.Range("B4").Value = Format(aracUz, "0") & " x " & Format(aracGen, "0") & " x " & Format(aracYuk, "0") & " cm"
    
    sonuclarWS.Range("A5").Value = "Maksimum Ağırlık:"
    sonuclarWS.Range("B5").Value = Format(aracMaxAg, "0.00") & " kg"
    
    sonuclarWS.Range("A6").Value = "Toplam Yüklenen Ağırlık:"
    sonuclarWS.Range("B6").Value = Format(toplamAg, "0.00") & " kg"
    
    Dim tamamHacim As Double
    tamamHacim = aracUz * aracGen * aracYuk
    
    sonuclarWS.Range("A7").Value = "Kullanılan Hacim:"
    sonuclarWS.Range("B7").Value = Format((kullanilanHacim / tamamHacim) * 100, "0.00") & "%"
    
    ' Başlıklar
    With sonuclarWS.Range("A8:I8")
        .Value = Array("Paket ID", "X (cm)", "Y (cm)", "Z (cm)", "Uzunluk", "Genişlik", "Yükseklik", "Ağırlık", "Durum")
        .Font.Bold = True
        .Interior.Color = RGB(200, 200, 255)
        .HorizontalAlignment = xlCenter
    End With
    
    ' Paket verileri
    Dim i As Long
    For i = 1 To paketSayisi
        sonuclarWS.Cells(i + 8, 1).Value = yerlesim(i, 1)
        sonuclarWS.Cells(i + 8, 2).Value = Format(yerlesim(i, 2), "0.00")
        sonuclarWS.Cells(i + 8, 3).Value = Format(yerlesim(i, 3), "0.00")
        sonuclarWS.Cells(i + 8, 4).Value = Format(yerlesim(i, 4), "0.00")
        sonuclarWS.Cells(i + 8, 5).Value = Format(yerlesim(i, 5), "0.00")
        sonuclarWS.Cells(i + 8, 6).Value = Format(yerlesim(i, 6), "0.00")
        sonuclarWS.Cells(i + 8, 7).Value = Format(yerlesim(i, 7), "0.00")
        sonuclarWS.Cells(i + 8, 8).Value = Format(yerlesim(i, 8), "0.00")
        sonuclarWS.Cells(i + 8, 9).Value = yerlesim(i, 9)
        
        ' Renklendirme
        If yerlesim(i, 9) = "Yerleştirildi" Then
            With sonuclarWS.Range(sonuclarWS.Cells(i + 8, 1), sonuclarWS.Cells(i + 8, 9))
                .Interior.Color = RGB(200, 255, 200)
            End With
        Else
            With sonuclarWS.Range(sonuclarWS.Cells(i + 8, 1), sonuclarWS.Cells(i + 8, 9))
                .Interior.Color = RGB(255, 200, 200)
            End With
        End If
    Next i
    
    ' Sütun genişliklerini ayarla
    sonuclarWS.Columns("A").ColumnWidth = 12
    For i = 2 To 9
        sonuclarWS.Columns(i).ColumnWidth = 14
    Next i
End Sub
