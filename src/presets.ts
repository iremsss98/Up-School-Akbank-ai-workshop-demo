import { CompletedCourse } from './types';

export interface InterviewPreset {
  id: string;
  labelTr: string;
  labelEn: string;
  interviewerTitle: string;
  targetRole: string;
  experienceLevel: string;
  companyContext: string;
}

export interface CareerPreset {
  id: string;
  labelTr: string;
  labelEn: string;
  targetRole: string;
  currentRole: string;
  courses: CompletedCourse[];
}

export const INTERVIEW_PRESETS: InterviewPreset[] = [
  {
    id: 'em-fullstack',
    labelTr: 'Engineering Manager ile Full Stack Görüşmesi',
    labelEn: 'Engineering Manager for Full Stack Role',
    interviewerTitle: 'Engineering Manager',
    targetRole: 'Senior Full Stack Engineer',
    experienceLevel: 'Senior (5+ yıl)',
    companyContext: 'Hızlı büyüyen B2B SaaS girişimi, haftalık release döngüsü ve 8 kişilik çevik ekip.',
  },
  {
    id: 'cto-architect',
    labelTr: 'CTO ile Sistem Mimarisi & Vizyon Görüşmesi',
    labelEn: 'CTO for Principal Architect Role',
    interviewerTitle: 'Chief Technology Officer (CTO)',
    targetRole: 'Staff / Principal Software Architect',
    experienceLevel: 'Lead/Staff (7+ yıl)',
    companyContext: 'Yüksek trafikli FinTech ödeme altyapısı, mikroservis geçişi ve teknik borç optimizasyonu.',
  },
  {
    id: 'hr-director',
    labelTr: 'İK Direktörü ile Kültür & Liderlik Görüşmesi',
    labelEn: 'HR Director Culture & Leadership Screen',
    interviewerTitle: 'Global Talent Acquisition Director',
    targetRole: 'Team Lead / Engineering Manager',
    experienceLevel: 'Lead (5+ yıl)',
    companyContext: 'Global uzaktan çalışan ekip, çok kültürlü ortam ve yüksek otonomi kültürü.',
  },
  {
    id: 'pm-frontend',
    labelTr: 'Kıdemli Ürün Yöneticisi (PM) ile Ürün Görüşmesi',
    labelEn: 'Senior Product Manager Cross-Functional Screen',
    interviewerTitle: 'Lead Product Manager',
    targetRole: 'Senior Frontend Engineer',
    experienceLevel: 'Mid-Level (3-4 yıl)',
    companyContext: 'Kullanıcı deneyimi ve dönüşüm oranları (CR) odaklı B2C mobil/web platformu.',
  },
];

export const CAREER_PRESETS: CareerPreset[] = [
  {
    id: 'react-to-fullstack',
    labelTr: 'Frontend Geliştiriciden Full Stack & Cloud Rotasına',
    labelEn: 'Frontend Dev to Full Stack & Cloud',
    targetRole: 'Senior Full Stack Cloud Engineer',
    currentRole: 'Mid-Level Frontend Developer',
    courses: [
      {
        id: 'c-1',
        title: 'Modern React 19 & TypeScript Masterclass',
        provider: 'Frontend Masters',
        topicsCovered: 'Advanced React Hooks, Custom Hooks, Context API, TypeScript Generics, Component Composition, Strict Type Checking, Tailwind CSS',
        completedYear: '2025',
      },
      {
        id: 'c-2',
        title: 'State Management & Web Performance Optimization',
        provider: 'Udemy',
        topicsCovered: 'TanStack Query (React Query) server-state caching, Zustand, Core Web Vitals, Bundle Splitting, Virtualized Lists, Memory profiling',
        completedYear: '2025',
      },
      {
        id: 'c-3',
        title: 'REST API & Express.js Backend Essentials',
        provider: 'Coursera',
        topicsCovered: 'Node.js runtime, Express routing, Middleware architecture, JWT authentication, PostgreSQL relational database basics, Prisma ORM',
        completedYear: '2026',
      },
    ],
  },
  {
    id: 'data-to-ml',
    labelTr: 'Veri Analistinden Makine Öğrenmesi (ML) Mühendisliğine',
    labelEn: 'Data Analyst to Machine Learning Engineer',
    targetRole: 'Machine Learning & AI Engineer',
    currentRole: 'Junior / Mid Data Analyst',
    courses: [
      {
        id: 'c-4',
        title: 'Python for Data Analysis & Exploratory Data Analysis (EDA)',
        provider: 'DataCamp',
        topicsCovered: 'Pandas DataFrames, NumPy vectorization, Matplotlib & Seaborn visualizations, Handling Missing Data, Outlier Detection, Statistical Inference',
        completedYear: '2024',
      },
      {
        id: 'c-5',
        title: 'Advanced SQL & Data Warehousing',
        provider: 'Coursera',
        topicsCovered: 'Complex Joins, Window Functions, Common Table Expressions (CTEs), Query Execution Plans, Star Schema, BigQuery indexing',
        completedYear: '2025',
      },
      {
        id: 'c-6',
        title: 'Supervised Machine Learning Fundamentals',
        provider: 'DeepLearning.AI',
        topicsCovered: 'Linear & Logistic Regression, Decision Trees, Random Forests, Gradient Boosting (XGBoost), Cross-Validation, Scikit-Learn pipelines',
        completedYear: '2025',
      },
    ],
  },
  {
    id: 'backend-to-devops',
    labelTr: 'Backend Geliştiriciden DevOps & SRE Mimarisine',
    labelEn: 'Backend Dev to DevOps / Cloud Architect',
    targetRole: 'Cloud Solutions & SRE Architect',
    currentRole: 'Backend Software Developer',
    courses: [
      {
        id: 'c-7',
        title: 'Go (Golang) Microservices & gRPC Architecture',
        provider: 'Pluralsight',
        topicsCovered: 'Concurrency with Goroutines & Channels, Protobuf, gRPC client-server communication, Microservice service mesh principles',
        completedYear: '2025',
      },
      {
        id: 'c-8',
        title: 'Docker & Containerization Deep Dive',
        provider: 'Docker Official / Linux Academy',
        topicsCovered: 'Multi-stage Docker builds, Layer caching optimization, Network bridges, Volume persistence, Docker Compose for local microservices',
        completedYear: '2025',
      },
    ],
  },
];
