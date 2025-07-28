# 🗺️ Basarsoft Geo Map - Coğrafi Veri Yönetim Sistemi

Bu proje, coğrafi verileri (nokta, çizgi, poligon) yönetmek için geliştirilmiş modern bir web uygulamasıdır. React frontend ve .NET Core backend kullanılarak oluşturulmuştur.

## 📋 İçindekiler

- [Proje Hakkında](#proje-hakkında)
- [Teknolojiler](#teknolojiler)
- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Veritabanı Şeması](#veritabanı-şeması)
- [Proje Yapısı](#proje-yapısı)
- [Katkıda Bulunma](#katkıda-bulunma)

## 🎯 Proje Hakkında

Bu proje, coğrafi veri yönetimi için geliştirilmiş kapsamlı bir sistemdir. Kullanıcılar harita üzerinde:

- **Nokta (Point)**: Şehir, bina, önemli lokasyonlar
- **Çizgi (Line)**: Yollar, sınırlar, rotalar
- **Poligon (Polygon)**: Bölgeler, alanlar, sınırlar

oluşturabilir, düzenleyebilir ve yönetebilir.

### 🌟 Ana Özellikler

- **İnteraktif Harita**: Leaflet.js ile güçlendirilmiş harita arayüzü
- **Gerçek Zamanlı Veri**: Backend ile senkronize çalışan veri yönetimi
- **WKT Formatı**: Standart coğrafi veri formatı desteği
- **PostgreSQL + PostGIS**: Güçlü coğrafi veritabanı desteği
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz

## 🛠️ Teknolojiler

### Backend (.NET Core 8.0)
- **Framework**: ASP.NET Core 8.0
- **Veritabanı**: PostgreSQL + PostGIS
- **ORM**: Entity Framework Core
- **Coğrafi İşlemler**: NetTopologySuite
- **API Dokümantasyonu**: Swagger/OpenAPI
- **CORS**: Cross-Origin Resource Sharing desteği

### Frontend (React 19)
- **Framework**: React 19.1.0
- **Harita Kütüphanesi**: Leaflet.js + React-Leaflet
- **HTTP İstemcisi**: Axios
- **State Yönetimi**: React Context API
- **Build Tool**: Vite
- **Modal**: React-Modal

### Veritabanı
- **Ana Veritabanı**: PostgreSQL 15+
- **Coğrafi Uzantı**: PostGIS
- **Koordinat Sistemi**: WGS84 (EPSG:4326)

## ✨ Özellikler

### 🗺️ Harita İşlemleri
- **Zoom Kontrolü**: Harita yakınlaştırma/uzaklaştırma
- **Pan**: Harita kaydırma
- **Katman Yönetimi**: Farklı veri türleri için ayrı katmanlar
- **Filtreleme**: Veri türüne göre görüntüleme filtreleme

### 📍 Nokta İşlemleri
- **Ekleme**: Harita üzerine tıklayarak nokta ekleme
- **Silme**: ID ile veya harita üzerinden silme
- **Listeleme**: Tüm noktaları görüntüleme
- **WKT Dönüşümü**: Otomatik WKT formatına çevirme

### 📏 Çizgi İşlemleri
- **Çizim**: İki nokta seçerek çizgi oluşturma
- **Silme**: İsim veya ID ile silme
- **Görüntüleme**: Çizgileri harita üzerinde gösterme
- **WKT Dönüşümü**: LINESTRING formatına çevirme

### 📐 Poligon İşlemleri
- **Çizim**: Çoklu nokta seçerek poligon oluşturma
- **Silme**: İsim veya ID ile silme
- **Görüntüleme**: Poligonları harita üzerinde gösterme
- **WKT Dönüşümü**: POLYGON formatına çevirme

### 🔧 Yönetim Özellikleri
- **Toast Bildirimleri**: İşlem sonuçları için bildirimler
- **Modal Pencereler**: Veri girişi için modal arayüzler
- **Sidebar**: Tüm işlemler için yan panel
- **Responsive Tasarım**: Mobil uyumlu arayüz

## 🚀 Kurulum

### Gereksinimler
- .NET 8.0 SDK
- Node.js 18+ ve npm
- PostgreSQL 15+ ve PostGIS uzantısı

### 1. Veritabanı Kurulumu

```sql
-- PostgreSQL'de veritabanı oluşturma
CREATE DATABASE MyPointDb;

-- PostGIS uzantısını etkinleştirme
CREATE EXTENSION postgis;
```

### 2. Backend Kurulumu

```bash
# Backend dizinine git
cd Backend/WebApplication1

# Bağımlılıkları yükle
dotnet restore

# Veritabanı migration'larını çalıştır
dotnet ef database update

# Uygulamayı çalıştır
dotnet run --urls "http://localhost:5290"
```

### 3. Frontend Kurulumu

```bash
# Frontend dizinine git
cd Frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

### 4. Yapılandırma

Backend'de `appsettings.json` dosyasında veritabanı bağlantı bilgilerini güncelleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=MyPointDb;Username=postgres;Password=12345"
  }
}
```

## 📖 Kullanım

### Harita Kontrolleri
- **Sol Tık**: Nokta ekleme modunda nokta ekler
- **Çizgi Modu**: İki nokta seçerek çizgi oluşturur
- **Poligon Modu**: Çoklu nokta seçerek poligon oluşturur
- **Silme Modu**: Mevcut verileri siler

### Sidebar İşlemleri
- **Görüntüleme Filtresi**: Veri türüne göre filtreleme
- **Nokta İşlemleri**: Nokta ekleme ve silme
- **Çizgi İşlemleri**: Çizgi çizme ve silme
- **Alan İşlemleri**: Poligon çizme ve silme
- **Listeleme**: Tüm verileri görüntüleme

## 🔌 API Dokümantasyonu

### Nokta (Point) API

#### GET /api/point
Tüm noktaları getirir.

#### GET /api/point/{id}
Belirli bir noktayı ID ile getirir.

#### POST /api/point
Yeni nokta ekler.
```json
{
  "name": "İstanbul",
  "wkt": "POINT(28.9784 41.0082)"
}
```

#### PUT /api/point/{id}
Nokta günceller.

#### DELETE /api/point/{id}
Nokta siler.

### Çizgi (Line) API

#### GET /api/line
Tüm çizgileri getirir.

#### POST /api/line
Yeni çizgi ekler.
```json
{
  "name": "Ankara-İstanbul Yolu",
  "wkt": "LINESTRING(32.8597 39.9334, 28.9784 41.0082)"
}
```

#### DELETE /api/line/{id}
Çizgi siler.

#### DELETE /api/line/by-name/{name}
İsim ile çizgi siler.

### Poligon (Polygon) API

#### GET /api/polygon
Tüm poligonları getirir.

#### POST /api/polygon
Yeni poligon ekler.
```json
{
  "name": "Türkiye Sınırları",
  "wkt": "POLYGON((26.0 35.0, 45.0 35.0, 45.0 42.0, 26.0 42.0, 26.0 35.0))"
}
```

#### DELETE /api/polygon/{id}
Poligon siler.

#### DELETE /api/polygon/by-name/{name}
İsim ile poligon siler.

## 🗄️ Veritabanı Şeması

### Points Tablosu
```sql
CREATE TABLE "Points" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR NOT NULL,
    "Location" geometry(Point,4326) NOT NULL
);
```

### Lines Tablosu
```sql
CREATE TABLE "Lines" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR NOT NULL,
    "Geometry" geometry(LineString,4326) NOT NULL
);
```

### Polygons Tablosu
```sql
CREATE TABLE "Polygons" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR NOT NULL,
    "Geometry" geometry(Polygon,4326) NOT NULL
);
```

## 📁 Proje Yapısı

```
Basarsoft_Geo_Map_Mono/
├── Backend/
│   └── WebApplication1/
│       ├── Controllers/          # API Controller'ları
│       ├── Data/                 # Entity Framework Context
│       ├── DTOs/                 # Data Transfer Objects
│       ├── Interface/            # Repository Interface'leri
│       ├── Migrations/           # EF Core Migrations
│       ├── Models/               # Entity Modelleri
│       ├── Repositories/         # Repository Implementasyonları
│       ├── Services/             # Service Interface'leri
│       ├── Program.cs            # Uygulama başlangıç noktası
│       └── appsettings.json      # Yapılandırma dosyası
└── Frontend/
    ├── public/                   # Statik dosyalar
    ├── src/
    │   ├── context/              # React Context
    │   ├── services/             # API servisleri
    │   ├── App.jsx               # Ana uygulama bileşeni
    │   ├── MapView.jsx           # Harita bileşeni
    │   └── main.jsx              # Uygulama giriş noktası
    ├── package.json              # NPM bağımlılıkları
    └── vite.config.js            # Vite yapılandırması
```

## 🔧 Geliştirme

### Backend Geliştirme
```bash
# Yeni migration oluştur
dotnet ef migrations add MigrationName

# Migration'ları uygula
dotnet ef database update

# Swagger dokümantasyonunu görüntüle
# http://localhost:5290/swagger
```

### Frontend Geliştirme
```bash
# Yeni bağımlılık ekle
npm install package-name

# Production build oluştur
npm run build

# Linting çalıştır
npm run lint
```

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **CORS Hatası**: Backend'de CORS ayarlarının doğru olduğundan emin olun
2. **Veritabanı Bağlantısı**: PostgreSQL servisinin çalıştığını kontrol edin
3. **Port Çakışması**: Backend ve frontend portlarının farklı olduğundan emin olun
4. **PostGIS Uzantısı**: Veritabanında PostGIS uzantısının etkin olduğunu kontrol edin

### Log Kontrolü
```bash
# Backend logları
dotnet run --verbosity detailed

# Frontend logları (browser console)
F12 > Console
```

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👥 Geliştirici

**Basarsoft** - Coğrafi Bilgi Sistemleri Çözümleri

## 📞 İletişim

- **Email**: ataturmen.ce@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/ata-t%C3%BCrkmen-609274308/

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 