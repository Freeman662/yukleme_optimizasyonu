# Hızlı Başlangıç

## 1️⃣ Excel Dosyasını Oluştur (30 saniye)

**Python yüklü?** 
```bash
python src/generate_excel.py
```

Bu komut otomatik olarak `Yükleme_Optimizasyonu.xlsm` dosyasını oluşturur:
- ✅ 3 araç tipi
- ✅ 80 paket (ağır, orta, hafif karışık)
- ✅ Hazır sayfalar

**Python yok?** → Excel'i manuel oluştur:
1. Yukarıdaki `KURULUM_KILAVUZU.md` dosyasını oku
2. Sayfaları elle tanımla

---

## 2️⃣ VBA Kodunu Ekle (1 dakika)

Excel dosyasını açtıktan sonra:

1. **Alt+F11** tuşlarına bas (VBA Editor açılır)
2. Sol panel → **Module** → **Insert Module**
3. `src/Yükleme_Optimizasyonu_VBA.bas` dosyasındaki kodu kopyala
4. VBA editörüne yapıştır
5. **Kaydet** (Ctrl+S)

---

## 3️⃣ Optimizasyonu Çalıştır (2 dakika)

1. Excel'de **Alt+F8** tuşlarına bas (Makro listesi açılır)
2. **OptimizasyonuCalistir** seçin
3. **Çalıştır** tıkla
4. **Araç ID** gir (1, 2 veya 3)
5. **Sonuçlar** sayfasında sonuçları görüntüle!

---

## 4️⃣ 3D Görselleştirme (Opsiyonel)

Sonuçları görselleştirmek için:

```bash
python src/visualize_3d.py
```

Bu, `yukleme_3d_gorsel.png` dosyasını oluşturur.

---

## 📋 Dosya Yapısı

```
yukleme_optimizasyonu/
├── README.md                              # Ana dokümantasyon
├── docs/
│   └── KURULUM_KILAVUZU.md               # Detaylı kurulum kılavuzu
├── src/
│   ├── Yükleme_Optimizasyonu_VBA.bas     # VBA kodu
│   ├── generate_excel.py                  # Excel template oluşturucu
│   └── visualize_3d.py                    # 3D görselleştirme
└── Yükleme_Optimizasyonu.xlsm            # Çalışan Excel dosyası (siz oluşturacaksınız)
```

---

## ❓ Sorunlar

| Problem | Çözüm |
|---------|--------|
| `ModuleNotFoundError: openpyxl` | `pip install openpyxl pandas matplotlib` |
| Makrolar çalışmıyor | Excel Güvenlik Merkezi → Makroları etkinleştir |
| "Dosya bulunamadı" | Python'u `src/` klasöründen çalıştır |

---

## 🎯 Sonraki Adımlar

✅ Excel dosyasını oluştur
✅ VBA kodunu ekle
✅ Optimizasyonu çalıştır
✅ Sonuçları kontrol et
✅ 3D görselleştirme oluştur (isteğe bağlı)

**Herhangi sorun yaşarsanız, GitHub Issues açın!**
