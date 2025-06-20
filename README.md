# Checklyzer

🚀 **Checklyzer** — Web siteniz için SEO, güvenlik, hız, mobil uyumluluk ve daha fazlasını tek tıkla analiz edin!  
Modern, açık kaynak ve geliştirici dostu araç platformu.

## Özellikler

- **Tek Tıkla Toplu Analiz:** SEO, SSL, Mobil Uyumluluk, Hız, Robots.txt, Favicon, Kırık Link, Canonical, Sayfa Boyutu ve Meta Tag analizleri.
- **Modern ve Kullanıcı Dostu Arayüz:** Next.js & TailwindCSS ile responsive, hızlı ve şık tasarım.
- **PDF Olarak İndir:** Analiz sonuçlarını tek tıkla PDF olarak kaydedin.
- **Açık Kaynak & Özelleştirilebilir:** Katkıya açık, marka adı ve temel ayarlar env ile kolayca değiştirilebilir.
- **Güvenlik:** Rate limit ve timeout ile API güvenliği.

## Demo

[Canlı Demo](https://checklyzer.sade.works)

(Eğer yayında değilse, kendi ortamınızda kolayca çalıştırabilirsiniz.)

## Kurulum

```bash
git clone https://github.com/sadeuckun/checklyzer.git
cd checklyzer
npm install
cp .env.example .env
# .env dosyasını doldurun (ör: NEXT_PUBLIC_BRAND_NAME, RATE_LIMIT, PAGESPEED_API_KEY)
npm run dev
```

> **Not:** Production için `npm run build && npm start` kullanın.

### .env Örneği
```env
NEXT_PUBLIC_BRAND_NAME=Checklyzer
RATE_LIMIT=5
PAGESPEED_API_KEY=your_google_api_key
NODE_ENV=production
```

## Kullanım

- Ana sayfadan istediğiniz aracı seçin veya "Tüm Araçları Dene" ile toplu analiz yapın.
- Sonuçları modern kartlar halinde, badge, puan ve önerilerle görün.
- Sonuçları PDF olarak indirin veya paylaşın.

## Katkı

Katkılarınızı bekliyoruz!
- Fork'layın, yeni özellik ekleyin veya hata düzeltin.
- PR açmadan önce lütfen bir issue oluşturun veya mevcut issue'lara göz atın.

## Lisans

[MIT](LICENSE)