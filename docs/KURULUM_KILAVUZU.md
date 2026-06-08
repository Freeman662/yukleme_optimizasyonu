# Yükleme Optimizasyonu - Kurulum ve Kullanım Kılavuzu

## 1. Temel Kurulum

Excel dosyasını açtıktan sonra:

1. **Araçlar Sayfası** - 3 araç tipini tanımla:
   - Araç 1: 600cm x 250cm x 250cm, Max 25,000kg
   - Araç 2: 800cm x 250cm x 280cm, Max 30,000kg
   - Araç 3: 1000cm x 300cm x 300cm, Max 40,000kg

2. **Paketler Sayfası** - Paket verilerini gir:
   - ID: Paket numarası
   - Uzunluk, Genişlik, Yükseklik (cm cinsinden)
   - Ağırlık (kg cinsinden)

3. **Sonuçlar Sayfası** - Optimizasyon sonuçları burada görünecek

## 2. Optimizasyonu Çalıştırma

1. Excel'de **Alt+F11** tuşlarına basarak VBA editörünü aç
2. Kodları kopyala ve VBA modulüne yapıştır
3. Çalışma sayfasına dön
4. **Araçlar** → **Makro** → **OptimizasyonuCalistir** seçin
5. Araç ID'sini girin (1, 2 veya 3)
6. Sonuçları **Sonuçlar** sayfasında görün

## 3. Algoritma Detayları

### 3D Bin Packing Algoritması
- **Yöntem**: Bottom-Left-Back Heuristic
- **Ağırlık Dağılımı**: Ağır paketler alta yerleştirilir
- **Kapasite Kontrolü**: Araç ağırlık limitini aşmaz

### Yerleşim Stratejisi
1. Paketler ağırlığa göre sıralanır (ağır olanlar önce)
2. Ağır paketler araçın altına yerleştirilir
3. Hafif paketler üstüne konur
4. Soldan, arkadan, alttan başlanarak yerleştirme yapılır

## 4. Örnek Veri Seti (80 Paket)

Paketler çeşitli boyut ve ağırlıklarda oluşturulmuştur:
- Paket 1-20: Ağır paketler (15-25 kg)
- Paket 21-50: Orta paketler (8-14 kg)
- Paket 51-80: Hafif paketler (2-7 kg)

## 5. Çıktı Bilgileri

Sonuçlar sayfasında şu bilgiler görünür:

| Alan | Açıklama |
|------|----------|
| Seçili Araç ID | Hangi araç kullanıldığı |
| Toplam Ağırlık | Yüklenen paketlerin toplam ağırlığı |
| Kapasite | Aracın maksimum taşıyabileceği ağırlık |
| Kullanılan Hacim | Araçın ne kadarının doldurulduğu (%) |
| Paket Detayları | Her paketin pozisyonu ve durumu |

## 6. Sorun Giderme

**Makrolar çalışmıyor?**
- Excel Güvenlik Merkezi'nde makroları etkinleştirin
- Dosyayı .xlsm formatında kaydedin

**Veri gönderilmiyor?**
- Paket verilerinin doğru formatta olduğunu kontrol edin
- Sütun başlıklarını değiştirmeyin

**Optimizasyon tamamlanmıyor?**
- Paket sayısını azaltmayı deneyin
- Excel'i yeniden başlatın

---

**Not**: Bu sistem 80 paket ile test edilmiştir. Daha fazla paket için algoritma optimize edilebilir.
