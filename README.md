# 3D Araç Yükleme Optimizasyonu

Excel VBA tabanlı 3D araç yükleme optimizasyon sistemi. Paketleri farklı ölçü ve kapasitedeki araçlara en verimli şekilde yükler.

## Özellikler

- ✅ 3 farklı araç tipi tanımı
- ✅ Excel'den paket datası okuma
- ✅ 3D Bin Packing algoritması
- ✅ Ağır paletler alta yerleştirme
- ✅ Detaylı raporlar ve istatistikler
- ✅ Optimum araç seçimi

## Dosya Yapısı

- `Yükleme_Optimizasyonu.xlsm` - Ana Excel dosyası (VBA makrolu)
  - **Araçlar**: Araç özellikleri
  - **Paketler**: Paket datası
  - **Sonuçlar**: Yükleme sonuçları
  - **İstatistikler**: Raporlar

## Nasıl Kullanılır

1. `Yükleme_Optimizasyonu.xlsm` dosyasını indirin ve açın
2. **Paketler** sayfasında paket verilerini girin (ID, Uzunluk, Genişlik, Yükseklik, Ağırlık)
3. **Araçlar** sayfasından bir araç seçin
4. **"Optimizasyonu Çalıştır"** düğmesine tıklayın
5. **Sonuçlar** sayfasında yerleşim detaylarını görün

## Teknik Detaylar

- **Dil**: Excel VBA
- **Algoritma**: 3D Bin Packing (Bottom-Left-Back heuristic)
- **Ağırlık Dağılımı**: Ağır paketler alta yerleştirilir
- **Kapasite Kontrolü**: Araç ağırlık limitini kontrol eder

## Gereksinimler

- Microsoft Excel 2016 veya üstü
- Makroların etkinleştirilmesi gereklidir

---

**Geliştirici**: Freeman662
**Sürüm**: 1.0
