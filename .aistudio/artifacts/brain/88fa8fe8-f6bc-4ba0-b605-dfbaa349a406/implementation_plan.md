# Interview & Career Agent Coach (Mülakat & Kariyer Koçu)

Mülakat katılımcısının unvanına (title) göre özelleştirilmiş potansiyel sorular ve interaktif mülakat simülasyonu sunan, aynı zamanda tamamlanan eğitim içeriklerini analiz ederek bir sonraki kariyer adımı için kişiselleştirilmiş eğitim yol haritası çıkaran yapay zeka destekli çift yönlü koçluk platformu.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Kullanıcı ile yapılan netleştirme aşamasında aşağıdaki kararlar doğrulanmıştır:

- **Confirmed Decision 1 (Mülakat Modu)**: Kullanıcı hem katılımcı title'ına göre kategorize edilmiş potansiyel soru listesini hem de soruları yanıtlayarak anında yapay zeka geri bildirimi alabileceği **interaktif mülakat simülasyonu**nu istedi.
- **Confirmed Decision 2 (Eğitim & Kariyer Yol Haritası)**: Tamamlanan eğitimler analiz edilerek doğrudan tekil tavsiye yerine **adım adım yetenek haritası (skill matrix), yetenek açığı analizi ve somut kurs önerileri listesi** sunulacak.
- **Confirmed Decision 3 (Dil Desteği)**: Hem Türkçe hem de İngilizce mülakat ve eğitim analizini destekleyen **çift dilli (bilingual TR/EN)** çalışma yapısı kurulacak.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. **Interview Coach Agent (Mülakat Koçu)**: Kullanıcı mülakata gireceği kişinin unvanını (ör. *Engineering Manager, Senior Data Scientist, VP of Product, HR Specialist*), hedef pozisyonu ve varsa şirket/sektör detaylarını girer. Ajan, o unvana ve kıdem seviyesine özel teknik, davranışsal (STAR metodu), durumsal ve şirket kültürü soruları üretir. Kullanıcı dilerse "Simülasyon Modu"na geçerek soruları sesli/yazılı yanıtlayabilir ve anlık değerlendirme (Güçlü yönler, Gelişim alanları, Örnek ideal yanıt) alır.
  2. **Career & Learning Coach Agent (Kariyer & Eğitim Koçu)**: Kullanıcı katıldığı eğitimleri, sertifikaları ve bu eğitimlerin içeriklerini/konularını (ör. "Modern React & State Management", "Docker & Kubernetes Temelleri", "Data Analysis with Python") ve hedef kariyer hedefini ekler. Ajan, mevcut bilgi birikimini analiz eder, yetenek haritası çıkarır, eksik parçaları (knowledge gaps) saptar ve bir sonraki adımda alması gereken en verimli eğitimleri/sertifikaları ve haftalık mikro adımları gerekçeleriyle önerir.
- **Target Audience / Persona**: Mülakatlara hazırlanan yazılımcılar, ürün yöneticileri, tasarımcılar, analistler ve kariyerinde bir üst seviyeye geçmek için eğitim rotasını doğru çizmek isteyen tüm profesyoneller ve öğrenciler.
- **Key Value**: Kişinin mülakat yapacağı kişinin bakış açısını (unvanına göre neleri sorgulayacağını) önceden simüle ederek özgüven kazandırmak ve rastgele eğitim almak yerine mevcut bilgi birikimini tamamlayacak en stratejik sonraki adımı göstermek.

---

### 2. User Experience & Visual Design

- **Layout Structure**:
  - **Top Bar Contract**: Tek satır marka ("Pathfinder Career & Interview Coach"), iki ana modül sekmesi ("Mülakat Koçu", "Kariyer & Eğitim Rotası", "Geçmiş Oturumlar"), dil değiştirici (TR / EN) ve hızlı aksiyon ("Yeni Oturum").
  - **İki Ana Çalışma Alanı**:
    1. **Tab 1: Mülakat Koçu (Interview Coach)**:
       - *Girdi Bölümü*: Mülakat Yapacak Kişinin Title'ı (hızlı önerilerle: Tech Lead, HR Manager, VP of Product, CEO vb.), Hedef Pozisyon, Şirket Türü / Notlar.
       - *Soru Vitrini*: Unvana göre filtrelenmiş 4 kategori (Teknik & Mimari, Davranışsal / STAR, Rol & Liderlik Beklentileri, Kültür & Kriz Yönetimi).
       - *İnteraktif Simülasyon*: Seçilen soruyu canlı cevaplama ekranı, yapay zekanın yanıtı değerlendirmesi (Puanlama: İletişim, Derinlik, Örnekleme) ve "Nasıl Daha İyi Olabilirdi?" rehberi.
    2. **Tab 2: Kariyer & Eğitim Yol Haritası (Career & Learning Agent)**:
       - *Eğitim Giriş Alanı*: Daha önce alınan eğitimlerin başlıkları, içerik özetleri veya müfredat detayları (tek tek ekleme veya toplu metin yapıştırma desteği).
       - *Mevcut Yetenek Radarı*: Edinilen yetkinliklerin seviyelendirilmiş dökümü.
       - *Bir Sonraki Adım Eğitim Önerileri*: Seviye, öncelik, tahmini süre, içerik başlıkları ve bu eğitimi neden alması gerektiğinin rasyoneli ile zenginleştirilmiş kurs kartları.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Zarif, modern SaaS çalışma alanı; yüksek okunabilirlik, odaklanmış kart yapıları ve dikkat dağıtmayan nötr slate zemin.
  - *Color Palette*: Slate-900 / Slate-50 nötr zeminler, mülakat odaklı Indigo/Mavi aksan (`#3B82F6`), kariyer/büyüme odaklı Emerald/Teal aksan (`#10B981`).
  - *Typography*: Başlıklarda `Plus Jakarta Sans`, veri ve gövde metinlerinde `Public Sans` / `DM Sans`, metrik ve sürelerde `tabular-nums`.
- **Interactive Feedback**:
  - Hızlı örnek senaryolar (örn. "Senior Frontend için Lead Mülakatı", "Backend Dev için AWS & Cloud Eğitimleri") tek tıkla yüklenebilir.
  - Soru ve öneri kartlarında yerel kopyalama, yer imlerine ekleme ve PDF/Markdown formatında dışa aktarma (Export) imkanı.
  - Hata, boş durum (empty state) ve yapay zeka üretim sırasında pürüzsüz skeleton/yükleme durumları.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Gemini 3.8 Flash via Server-Side Proxy**:
  - *Approach*: İstemci hiçbir zaman API anahtarına erişmez. Tüm prompt mühendisliği ve yapılandırılmış JSON çıktıları `server.ts` ve Vite middleware API proxy'si (`/api/interview/generate`, `/api/interview/evaluate`, `/api/career/roadmap`) üzerinden yürütülür.
  - *Why*: Güvenlik standardına tam uyum, deterministik JSON şema doğrulaması (`responseMimeType: "application/json"` ile `responseSchema`) ve hızlı yanıt süreleri.
- **Decision 2: LocalStorage ile Kalıcı Çalışma Alanı + Ön Tanımlı Gerçekçi Şablonlar**:
  - *Approach*: Kullanıcının girdiği eğitim içerikleri ve mülakat simülasyon geçmişi tarayıcı yerel hafızasında saklanır. Ayrıca ilk girişte anında test edebilmesi için zengin hazır profiller (ör. "Frontend Junior -> Mid Geçişi", "Veri Analisti -> Data Scientist Geçişi") sunulur.
- **Decision 3: Çift Dilli (TR / EN) Prompt ve Arayüz Altyapısı**:
  - *Approach*: UI dil seçimine göre promptlar ve analiz çıktıları Türkçe veya İngilizce olarak üretilir; unvanlar her iki dilde de akıllıca işlenir.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER (React 19)                │
│                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  │
│  │   Interview Coach View  │  │   Career Roadmap View    │  │
│  │  - Title & Context Form │  │  - Completed Course List │  │
│  │  - Question Categorizer │  │  - Skill Gap Analyzer    │  │
│  │  - Mock Practice / Eval │  │  - Next-Step Course Recs │  │
│  └───────────┬─────────────┘  └───────────┬──────────────┘  │
│              │                            │                 │
│              └──────────────┬─────────────┘                 │
│                             ▼                               │
│                  API Service Layer (/api/*)                 │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP POST (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SERVER (Express & Vite Middleware)              │
│                                                             │
│   POST /api/interview/generate   -->  Gemini 3.8 Flash      │
│   POST /api/interview/evaluate   -->  Gemini 3.8 Flash      │
│   POST /api/career/roadmap       -->  Gemini 3.8 Flash      │
│                                                             │
│   • Enforces JSON Schema (Type.OBJECT, Type.ARRAY)          │
│   • System Prompts for Intervew & Learning Methodologies    │
│   • Telemetry Header: User-Agent: aistudio-build            │
└─────────────────────────────────────────────────────────────┘
```

#### Veri Yapıları:
- `InterviewSession`: `interviewerTitle`, `targetRole`, `companyContext`, `language`, `questions: [{ id, question, category, rationale, sampleAnswer, tips }]`
- `InterviewAnswerEvaluation`: `feedback`, `strengths`, `improvements`, `sampleRefinedAnswer`, `rating`
- `CompletedCourse`: `id`, `title`, `providerOrPlatform`, `topicsCovered`, `completionDate`
- `CareerRoadmap`: `targetRole`, `currentSkillsSummary: [{ skill, level, notes }]`, `skillGaps: [{ missingSkill, importance }]`, `recommendedNextCourses: [{ title, level, priority, syllabusTopics, rationale, estimatedDuration, searchKeywords }]`

---

### Verification Plan

1. **Compilation Check**: `compile_applet` çalıştırılarak TypeScript, React 19 ve Vite derleme kontrolleri sağlanacak.
2. **Interview Agent Test**: Farklı unvanlar (ör. "CTO", "HR Director", "Lead QA Engineer") girilerek unvana özel soru üretiminin doğruluğu kontrol edilecek.
3. **Simülasyon Testi**: Soruya yanıt verilerek geri bildirim, puanlama ve geliştirme tavsiyeleri test edilecek.
4. **Kariyer Ajanı Testi**: Örnek eğitim içerikleri girilerek (ör. "Python Basics, Pandas, Matplotlib") mantıklı bir sonraki adım eğitim tavsiyesi (ör. "Machine Learning & Scikit-Learn veya SQL for Data Science") ürettiği teyit edilecek.
5. **TR/EN Dil Değişimi**: Dil geçişlerinin arayüz ve analiz çıktılarında kusursuz çalıştığı kontrol edilecek.
