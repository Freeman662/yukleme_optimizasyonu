Sub OptimizasyonuCalistir()
    ' 3D Yükleme Optimizasyonu Ana Fonksiyonu
    ' Ağır paletler alta yerleştirilir
    
    Dim wsAraclar As Worksheet, wsPaketler As Worksheet, wsHesaplar As Worksheet
    Dim aracSecimi As String, aracUzunluk As Double, aracGenislik As Double
    Dim aracYukseklik As Double, aracMaxAgirlik As Double
    Dim lastRow As Long, i As Long, j As Long, k As Long
    Dim paketDizi() As Variant, yerlesim() As Variant
    Dim toplamAgirlik As Double, kullanilanHacim As Double
    Dim tamamHacim As Double
    
    On Error GoTo ErrorHandler
    
    ' Sayfaları tanımla
    Set wsAraclar = ThisWorkbook.Sheets("Araçlar")
    Set wsPaketler = ThisWorkbook.Sheets("Paketler")
    Set wsHesaplar = ThisWorkbook.Sheets("Sonuçlar")
    
    ' Araç seçimini al
    aracSecimi = InputBox("Araç ID girin (1, 2 veya 3):", "Araç Seçimi")
    
    If aracSecimi = "" Then Exit Sub
    
    ' Araç bilgilerini getir
    Select Case aracSecimi
        Case "1"
            aracUzunluk = wsAraclar.Range("B2").Value
            aracGenislik = wsAraclar.Range("C2").Value
            aracYukseklik = wsAraclar.Range("D2").Value
            aracMaxAgirlik = wsAraclar.Range("E2").Value
        Case "2"
            aracUzunluk = wsAraclar.Range("B3").Value
            aracGenislik = wsAraclar.Range("C3").Value
            aracYukseklik = wsAraclar.Range("D3").Value
            aracMaxAgirlik = wsAraclar.Range("E3").Value
        Case "3"
            aracUzunluk = wsAraclar.Range("B4").Value
            aracGenislik = wsAraclar.Range("C4").Value
            aracYukseklik = wsAraclar.Range("D4").Value
            aracMaxAgirlik = wsAraclar.Range("E4").Value
        Case Else
            MsgBox "Geçersiz araç ID!", vbCritical
            Exit Sub
    End Select
    
    ' Paket verilerini oku
    lastRow = wsPaketler.Cells(wsPaketler.Rows.Count, "A").End(xlUp).Row
    ReDim paketDizi(1 To lastRow - 1, 1 To 5)
    
    For i = 2 To lastRow
        paketDizi(i - 1, 1) = wsPaketler.Cells(i, 1).Value ' ID
        paketDizi(i - 1, 2) = wsPaketler.Cells(i, 2).Value ' Uzunluk
        paketDizi(i - 1, 3) = wsPaketler.Cells(i, 3).Value ' Genişlik
        paketDizi(i - 1, 4) = wsPaketler.Cells(i, 4).Value ' Yükseklik
        paketDizi(i - 1, 5) = wsPaketler.Cells(i, 5).Value ' Ağırlık
    Next i
    
    ' Paketleri ağırlığa göre sırala (ağır olanlar önce - alta gelecek)
    Call SiralaPaketleri(paketDizi)
    
    ' Yerleşim algoritması çalıştır
    Call YerlesimHesapla(paketDizi, aracUzunluk, aracGenislik, aracYukseklik, _
                         aracMaxAgirlik, yerlesim, toplamAgirlik, kullanilanHacim)
    
    tamamHacim = aracUzunluk * aracGenislik * aracYukseklik
    
    ' Sonuçları yaz
    Call SonuclariYaz(wsHesaplar, paketDizi, yerlesim, toplamAgirlik, _
                      kullanilanHacim, tamamHacim, aracMaxAgirlik, aracSecimi)
    
    MsgBox "Optimizasyon tamamlandı!" & vbCrLf & _
           "Seçili Araç: " & aracSecimi & vbCrLf & _
           "Toplam Ağırlık: " & Format(toplamAgirlik, "0.00") & " kg" & vbCrLf & _
           "Kullanılan Hacim: " & Format(kullanilanHacim / tamamHacim * 100, "0.00") & "%", vbInformation
    
    Exit Sub
ErrorHandler:
    MsgBox "Hata: " & Err.Description, vbCritical
End Sub

Sub SiralaPaketleri(ByRef paketDizi() As Variant)
    ' Paketleri ağırlığa göre azalan sıraya göre sırala (ağır olanlar önce)
    Dim i As Long, j As Long, temp() As Variant
    Dim n As Long
    
    n = UBound(paketDizi, 1)
    ReDim temp(1 To 5)
    
    For i = 1 To n - 1
        For j = i + 1 To n
            If paketDizi(i, 5) < paketDizi(j, 5) Then
                ' Satırı değiştir
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
                    ByRef toplamAg As Double, ByRef kullanilanHacim As Double)
    ' 3D Bin Packing - Bottom-Left-Back Algoritması
    
    Dim n As Long, i As Long, j As Long
    Dim paketUz As Double, paketGen As Double, paketYuk As Double, paketAg As Double
    Dim x As Double, y As Double, z As Double
    Dim toplamPaket As Long
    
    n = UBound(paketDizi, 1)
    toplamAg = 0
    kullanilanHacim = 0
    toplamPaket = 0
    
    ReDim yerlesim(1 To n, 1 To 9)
    
    For i = 1 To n
        paketUz = paketDizi(i, 2)
        paketGen = paketDizi(i, 3)
        paketYuk = paketDizi(i, 4)
        paketAg = paketDizi(i, 5)
        
        ' Kapasite kontrolü
        If toplamAg + paketAg <= aracMaxAg Then
            ' En altta ve arkada yerleştir
            x = 0 ' Soldan başla
            y = toplamAg / (paketUz * paketGen + 0.001) * paketYuk ' Ağırlık dağılımı
            z = 0 ' En alta yerleştir
            
            ' Pozisyon hesapla (basit heuristic)
            Call FindBestPosition(x, y, z, paketUz, paketGen, paketYuk, _
                                 aracUz, aracGen, aracYuk, yerlesim, i)
            
            yerlesim(i, 1) = paketDizi(i, 1) ' ID
            yerlesim(i, 2) = x ' X pozisyonu
            yerlesim(i, 3) = y ' Y pozisyonu
            yerlesim(i, 4) = z ' Z pozisyonu
            yerlesim(i, 5) = paketUz ' Uzunluk
            yerlesim(i, 6) = paketGen ' Genişlik
            yerlesim(i, 7) = paketYuk ' Yükseklik
            yerlesim(i, 8) = paketAg ' Ağırlık
            yerlesim(i, 9) = "Yerleştirildi" ' Durum
            
            toplamAg = toplamAg + paketAg
            kullanilanHacim = kullanilanHacim + (paketUz * paketGen * paketYuk)
            toplamPaket = toplamPaket + 1
        Else
            yerlesim(i, 9) = "Kapasite Aşıldı"
        End If
    Next i
End Sub

Sub FindBestPosition(ByRef x As Double, ByRef y As Double, ByRef z As Double, _
                     paketUz As Double, paketGen As Double, paketYuk As Double, _
                     aracUz As Double, aracGen As Double, aracYuk As Double, _
                     yerlesim() As Variant, satir As Long)
    ' En iyi pozisyonu bul (soldan, alttan, arkadan)
    
    x = 0
    z = 0 ' Alta yerleştir (ağır paletler)
    
    ' Y konumunu calculate et
    If satir > 1 Then
        y = yerlesim(satir - 1, 4) + yerlesim(satir - 1, 7)
        If y + paketYuk > aracYuk Then
            y = 0
            x = yerlesim(satir - 1, 2) + yerlesim(satir - 1, 5)
        End If
    Else
        y = 0
    End If
End Sub

Sub SonuclariYaz(wsHesaplar As Worksheet, paketDizi() As Variant, _
                 yerlesim() As Variant, toplamAg As Double, kullanilanHacim As Double, _
                 tamamHacim As Double, aracMaxAg As Double, aracID As String)
    ' Sonuçları Excel sayfasına yaz
    
    Dim i As Long, n As Long
    Dim yuzde As Double
    
    ' Başlıkları temizle
    wsHesaplar.Cells.Clear
    
    ' Başlıklar
    wsHesaplar.Range("A1").Value = "YÜKLEME OPTİMİZASYONU SONUÇLARI"
    wsHesaplar.Range("A1").Font.Bold = True
    wsHesaplar.Range("A1").Font.Size = 14
    
    ' İstatistikler
    wsHesaplar.Range("A3").Value = "Seçili Araç ID:"
    wsHesaplar.Range("B3").Value = aracID
    wsHesaplar.Range("A4").Value = "Toplam Ağırlık (kg):"
    wsHesaplar.Range("B4").Value = Format(toplamAg, "0.00")
    wsHesaplar.Range("A5").Value = "Kapasite (kg):"
    wsHesaplar.Range("B5").Value = Format(aracMaxAg, "0.00")
    wsHesaplar.Range("A6").Value = "Kullanılan Hacim (%):"
    yuzde = (kullanilanHacim / tamamHacim) * 100
    wsHesaplar.Range("B6").Value = Format(yuzde, "0.00") & "%"
    
    ' Yerleşim detayları
    wsHesaplar.Range("A8").Value = "Paket ID"
    wsHesaplar.Range("B8").Value = "X (cm)"
    wsHesaplar.Range("C8").Value = "Y (cm)"
    wsHesaplar.Range("D8").Value = "Z (cm)"
    wsHesaplar.Range("E8").Value = "Uzunluk"
    wsHesaplar.Range("F8").Value = "Genişlik"
    wsHesaplar.Range("G8").Value = "Yükseklik"
    wsHesaplar.Range("H8").Value = "Ağırlık"
    wsHesaplar.Range("I8").Value = "Durum"
    
    ' Başlıkları biçimlendir
    With wsHesaplar.Range("A8:I8")
        .Font.Bold = True
        .Interior.Color = RGB(200, 200, 200)
    End With
    
    ' Verileri yaz
    n = UBound(yerlesim, 1)
    For i = 1 To n
        wsHesaplar.Cells(i + 8, 1).Value = yerlesim(i, 1)
        wsHesaplar.Cells(i + 8, 2).Value = Format(yerlesim(i, 2), "0.00")
        wsHesaplar.Cells(i + 8, 3).Value = Format(yerlesim(i, 3), "0.00")
        wsHesaplar.Cells(i + 8, 4).Value = Format(yerlesim(i, 4), "0.00")
        wsHesaplar.Cells(i + 8, 5).Value = Format(yerlesim(i, 5), "0.00")
        wsHesaplar.Cells(i + 8, 6).Value = Format(yerlesim(i, 6), "0.00")
        wsHesaplar.Cells(i + 8, 7).Value = Format(yerlesim(i, 7), "0.00")
        wsHesaplar.Cells(i + 8, 8).Value = Format(yerlesim(i, 8), "0.00")
        wsHesaplar.Cells(i + 8, 9).Value = yerlesim(i, 9)
    Next i
    
    ' Sütun genişliklerini ayarla
    wsHesaplar.Columns("A:I").AutoFit
    
    wsHesaplar.Activate
End Sub
