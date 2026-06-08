import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import numpy as np

def read_excel_results(filename):
    """Excel sonuçlarını oku"""
    df = pd.read_excel(filename, sheet_name='Sonuçlar', skiprows=7)
    return df

def draw_3d_visualization(df, arac_uz, arac_gen, arac_yuk):
    """3D görselleştirme oluştur"""
    
    fig = plt.figure(figsize=(14, 10))
    ax = fig.add_subplot(111, projection='3d')
    
    # Araç kutusu çiz
    draw_box(ax, 0, 0, 0, arac_uz, arac_gen, arac_yuk, 'black', alpha=0.1)
    
    # Paketleri çiz
    colors = plt.cm.Set3(np.linspace(0, 1, len(df)))
    
    for idx, row in df.iterrows():
        if pd.notna(row['X (cm)']) and row['Durum'] == 'Yerleştirildi':
            x = row['X (cm)']
            y = row['Y (cm)']
            z = row['Z (cm)']
            dx = row['Uzunluk']
            dy = row['Genişlik']
            dz = row['Yükseklik']
            
            draw_box(ax, x, y, z, dx, dy, dz, colors[idx], alpha=0.7)
            
            # Paket ID'sini yazı olarak ekle
            ax.text(x + dx/2, y + dy/2, z + dz/2, str(int(row['Paket ID'])), 
                   fontsize=8, ha='center')
    
    # Eksen ayarları
    ax.set_xlabel('Uzunluk (cm)')
    ax.set_ylabel('Genişlik (cm)')
    ax.set_zlabel('Yükseklik (cm)')
    
    ax.set_xlim(0, arac_uz)
    ax.set_ylim(0, arac_gen)
    ax.set_zlim(0, arac_yuk)
    
    ax.set_title('3D Araç Yükleme Görselleştirmesi', fontsize=16, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('yukleme_3d_gorsel.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    print("Görselleştirme başarıyla kaydedildi: yukleme_3d_gorsel.png")

def draw_box(ax, x, y, z, dx, dy, dz, color, alpha=0.7):
    """3D kutu çiz"""
    
    vertices = [
        [x, y, z], [x+dx, y, z], [x+dx, y+dy, z], [x, y+dy, z],  # Alt
        [x, y, z+dz], [x+dx, y, z+dz], [x+dx, y+dy, z+dz], [x, y+dy, z+dz]  # Üst
    ]
    
    faces = [
        [vertices[0], vertices[1], vertices[5], vertices[4]],  # Ön
        [vertices[2], vertices[3], vertices[7], vertices[6]],  # Arka
        [vertices[0], vertices[3], vertices[7], vertices[4]],  # Sol
        [vertices[1], vertices[2], vertices[6], vertices[5]],  # Sağ
        [vertices[0], vertices[1], vertices[2], vertices[3]],  # Alt
        [vertices[4], vertices[5], vertices[6], vertices[7]]   # Üst
    ]
    
    poly = Poly3DCollection(faces, alpha=alpha, facecolor=color, edgecolor='black', linewidth=0.5)
    ax.add_collection3d(poly)

def print_statistics(df):
    """İstatistikleri yazdır"""
    
    print("\n" + "="*50)
    print("YÜKLEME OPTİMİZASYONU İSTATİSTİKLERİ")
    print("="*50)
    
    if 'Toplam Ağırlık (kg):' in df.columns:
        print(f"Toplam Ağırlık: {df['Toplam Ağırlık (kg):'].values[0]} kg")
    
    if 'Kullanılan Hacim (%):' in df.columns:
        print(f"Kullanılan Hacim: {df['Kullanılan Hacim (%)'].values[0]}")
    
    yerlestirildi = len(df[df['Durum'] == 'Yerleştirildi'])
    asildi = len(df[df['Durum'] == 'Kapasite Aşıldı'])
    
    print(f"Yerleştirilen Paket: {yerlestirildi}")
    print(f"Kapasite Aşıldı: {asildi}")
    print("="*50 + "\n")

if __name__ == "__main__":
    # Excel dosyasını oku
    excel_file = "Yükleme_Optimizasyonu.xlsm"
    
    try:
        df = read_excel_results(excel_file)
        
        # Araç ölçüleri (Araç 1 örneği)
        arac_uz, arac_gen, arac_yuk = 600, 250, 250
        
        # İstatistikleri yazdır
        print_statistics(df)
        
        # 3D görselleştirme oluştur
        draw_3d_visualization(df, arac_uz, arac_gen, arac_yuk)
        
    except FileNotFoundError:
        print(f"Hata: {excel_file} dosyası bulunamadı!")
    except Exception as e:
        print(f"Hata: {e}")
