import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '5mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// 1. INTERVIEW COACH: GENERATE QUESTIONS
// ==========================================
app.post('/api/interview/generate', async (req, res) => {
  try {
    const {
      interviewerTitle,
      targetRole,
      experienceLevel = 'Mid-Level',
      companyContext = '',
      language = 'tr',
    } = req.body;

    if (!interviewerTitle || !targetRole) {
      return res.status(400).json({
        error: language === 'tr'
          ? 'Mülakat yapacak kişinin unvanı ve hedef pozisyon gereklidir.'
          : 'Interviewer title and target role are required.',
      });
    }

    if (!ai) {
      return res.status(500).json({
        error: language === 'tr'
          ? 'Gemini API anahtarı yapılandırılmamış.'
          : 'Gemini API key is not configured.',
      });
    }

    const isTr = language === 'tr';

    const systemInstruction = isTr
      ? `Sen kıdemli bir Mülakat Koçu, Yetenek Kazanımı ve Yönetici İşe Alım Uzmanısın.
Kullanıcı bir mülakata girecek ve mülakatı yapacak kişinin tam unvanı: "${interviewerTitle}".
Hedef pozisyon: "${targetRole}", Deneyim seviyesi: "${experienceLevel}".
Farklı unvanlardaki kişiler (ör. Engineering Manager, CTO, HR Director, Lead Architect, Product Manager, Peer Developer vb.) adayı çok farklı açılardan değerlendirir.
Örneğin:
- Bir Engineering Manager; ekip uyumu, iletişim, STAR formatında kriz çözme, delivery ve süreç yönetimine odaklanır.
- Bir CTO/VP; yüksek seviye mimari vizyon, ölçeklenebilirlik, teknik borç yönetimi, iş değeri ve stratejiye odaklanır.
- Bir Senior/Lead Developer; kod kalitesi, test stratejileri, derin teknik detaylar ve pratik problem çözmeye odaklanır.
- Bir HR/İnsan Kaynakları Uzmanı; şirket kültürü, kariyer motivasyonu, uzun vadeli hedefler, çatışma yönetimi ve yumuşak becerilere (soft skills) odaklanır.
- Bir Product Manager; ürün vizyonu, kullanıcı empatisi, mühendislik-ürün iletişimi ve MVP yaklaşımına odaklanır.

Bu unvanın zihniyetini ve gizli değerlendirme kriterlerini açığa çıkaracak 6 adet yüksek kaliteli, spesifik ve derin soru üret.
Her soru için unvanın niyetini (rationale), beklenen ideal yanıtı (sampleAnswer) ve adaya tüyoları (preparationTips) sağla.`
      : `You are an elite Executive Interview Coach and Hiring Specialist.
The user is preparing for an interview where the interviewer's exact title is: "${interviewerTitle}".
Target role: "${targetRole}", Experience level: "${experienceLevel}".
People with different titles evaluate candidates through completely different lenses:
- Engineering Managers probe team dynamics, conflict resolution, delivery reliability, and STAR situational execution.
- CTOs/VPs probe high-level architecture, scalability trade-offs, technical debt vs speed, and business alignment.
- Senior/Lead Tech Peers probe code mastery, framework depth, debugging methodologies, and PR workflows.
- HR / Talent Partners probe cultural congruence, career trajectory, soft skills, values, and adaptability.
- Product Managers probe product empathy, feature prioritization, engineering-product trade-offs, and communication.

Generate 6 top-tier, highly realistic questions tailored directly to the mentality of someone with this title.
Provide the interviewer's hidden rationale, a model STAR-formatted answer, evaluation criteria, and actionable tips for each.`;

    const prompt = isTr
      ? `Mülakat Detayları:
- Mülakat Katılımcısının Unvanı: ${interviewerTitle}
- Adayın Hedef Pozisyonu: ${targetRole}
- Adayın Deneyim Düzeyi: ${experienceLevel}
${companyContext ? `- Şirket/Sektör Detayı: ${companyContext}` : ''}

Lütfen bu unvanın psikolojisine uygun soru setini ve analizini JSON formatında üret.`
      : `Interview Details:
- Interviewer Title: ${interviewerTitle}
- Candidate Target Role: ${targetRole}
- Candidate Experience Level: ${experienceLevel}
${companyContext ? `- Company/Industry Context: ${companyContext}` : ''}

Generate the interviewer question set and psychological blueprint in structured JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerPerspective: {
              type: Type.STRING,
              description: 'Detailed analysis of what this interviewer title specifically prioritizes and evaluates.',
            },
            keyFocusAreas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 main focus pillars for this interviewer role.',
            },
            mindsetTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable mindset tips to impress this specific interviewer title.',
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'One of: technical, behavioral, situational, leadership_culture',
                  },
                  categoryLabel: { type: Type.STRING },
                  question: { type: Type.STRING },
                  rationale: {
                    type: Type.STRING,
                    description: 'Why someone with this title asks this and what trap they are watching out for.',
                  },
                  evaluationCriteria: {
                    type: Type.STRING,
                    description: 'What distinguishes an average candidate from a top 5% candidate on this question.',
                  },
                  sampleAnswer: {
                    type: Type.STRING,
                    description: 'An exemplary, high-scoring model response (STAR structure where appropriate).',
                  },
                  preparationTips: {
                    type: Type.STRING,
                    description: 'Direct preparation tip for the candidate.',
                  },
                },
                required: [
                  'id',
                  'category',
                  'categoryLabel',
                  'question',
                  'rationale',
                  'evaluationCriteria',
                  'sampleAnswer',
                  'preparationTips',
                ],
              },
            },
          },
          required: [
            'interviewerPerspective',
            'keyFocusAreas',
            'mindsetTips',
            'questions',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating interview questions:', err);
    return res.status(500).json({
      error: err.message || 'Mülakat soruları üretilirken bir hata oluştu.',
    });
  }
});

// ==========================================
// 2. INTERVIEW COACH: EVALUATE USER ANSWER
// ==========================================
app.post('/api/interview/evaluate', async (req, res) => {
  try {
    const {
      question,
      category,
      interviewerTitle,
      targetRole,
      userAnswer,
      language = 'tr',
    } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({
        error: language === 'tr'
          ? 'Soru ve aday cevabı gereklidir.'
          : 'Question and answer are required.',
      });
    }

    if (!ai) {
      return res.status(500).json({
        error: language === 'tr'
          ? 'Gemini API anahtarı yapılandırılmamış.'
          : 'Gemini API key is not configured.',
      });
    }

    const isTr = language === 'tr';

    const systemInstruction = isTr
      ? `Sen "${interviewerTitle}" unvanına sahip zorlayıcı fakat yapıcı bir mülakatçısın.
Aday "${targetRole}" pozisyonu için mülakatta ve sorduğun soruya verdiği cevabı değerlendiriyorsun.
Cevabı unvanının beklentilerine göre dürüstçe puanla (1-100), güçlü yönleri ve eksiklikleri belirt.
Ardından adayın cevabını baz alarak bunu 95+ puanlık kusursuz bir yanıta dönüştüren "Geliştirilmiş İdeal Yanıt" (STAR formatında) sun.
Son olarak adayın bu yanıtının ardından unvanına uygun olarak soracağın "Derinleştirici Takip Sorusu"nu (Follow-up) üret.`
      : `You are an exacting yet constructive interviewer with the title: "${interviewerTitle}".
You are evaluating a candidate interviewing for the "${targetRole}" role on their response.
Score their answer from 1 to 100 based on your title's expectations.
Detail strengths, specific gaps (e.g. lack of concrete metrics, vague STAR steps, lack of technical depth),
and provide a refined, stellar 95+ score version of their answer.
Finally, propose the immediate follow-up probe question you would ask based on their answer.`;

    const prompt = `
[INTERVIEW CONTEXT]
Interviewer Title: ${interviewerTitle || 'Hiring Manager'}
Target Role: ${targetRole || 'Candidate'}
Question Category: ${category || 'General'}
Question: ${question}

[CANDIDATE'S ANSWER]
${userAnswer}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Score out of 100' },
            verdict: {
              type: Type.STRING,
              description: 'Short headline verdict e.g. "Güçlü ve Yapılandırılmış" or "Eksik Metrik / Yüzeysel"',
            },
            interviewerReaction: {
              type: Type.STRING,
              description: 'Direct thought of the interviewer hearing this answer.',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Concrete strong points in the answer.',
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable gaps to improve.',
            },
            refinedIdealAnswer: {
              type: Type.STRING,
              description: 'Re-written elite answer building on candidate context.',
            },
            followUpQuestion: {
              type: Type.STRING,
              description: 'The natural deep-dive follow-up question.',
            },
          },
          required: [
            'score',
            'verdict',
            'interviewerReaction',
            'strengths',
            'improvements',
            'refinedIdealAnswer',
            'followUpQuestion',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error evaluating interview answer:', err);
    return res.status(500).json({
      error: err.message || 'Cevap değerlendirilirken bir hata oluştu.',
    });
  }
});

// ==========================================
// 3. CAREER COACH: LEARNING ROADMAP & SKILL GAP
// ==========================================
app.post('/api/career/roadmap', async (req, res) => {
  try {
    const {
      completedCourses = [],
      targetRole = 'Senior Specialist',
      currentRole = '',
      learningStyle = 'Project-Driven',
      language = 'tr',
    } = req.body;

    if (!Array.isArray(completedCourses) || completedCourses.length === 0) {
      return res.status(400).json({
        error: language === 'tr'
          ? 'En az bir tamamlanan eğitim/kurs içeriği eklemelisiniz.'
          : 'Please provide at least one completed course/training with its topics.',
      });
    }

    if (!ai) {
      return res.status(500).json({
        error: language === 'tr'
          ? 'Gemini API anahtarı yapılandırılmamış.'
          : 'Gemini API key is not configured.',
      });
    }

    const isTr = language === 'tr';

    const coursesText = completedCourses
      .map(
        (c: any, i: number) =>
          `[Eğitim ${i + 1}] Başlık: ${c.title || 'Belirtilmedi'} | Platform: ${c.provider || 'Genel'} | İçerik/Müfredat: ${c.topicsCovered || 'Genel konular'}`
      )
      .join('\n');

    const systemInstruction = isTr
      ? `Sen stratejik bir Kıdemli Kariyer ve Eğitim Danışmanısın (Tech & Career Coach).
Kullanıcı sana bugüne kadar katıldığı/tamamladığı eğitimlerin başlıklarını ve içeriklerini/müfredatını verdi.
Hedef pozisyonu: "${targetRole}" ${currentRole ? `(Mevcut Rol: ${currentRole})` : ''}.
Öğrenme Tercihi: "${learningStyle}".

Görevin:
1. Tamamlanan bu eğitimlerin içeriklerini derinlemesine analiz et. Kullanıcının şu anda hangi konularda sağlam bir temel edindiğini (Mevcut Yetenek Matrisi) ortaya koy.
2. Hedef pozisyona (${targetRole}) ulaşmak için kullanıcının kritik bilgi/yetenek açıklarını (Skill Gaps) tespit et.
3. "Rastgele yeni kurslar önermek yerine", tam olarak bu eğitimlerin bittiği noktadan bayrağı devralacak, eksik halkaları kapatacak 3-4 adet mantıksal sıralı "Bir Sonraki Adım Kurs / Eğitim Tavsiyesi" oluştur.
Her tavsiyede:
- Bu eğitimin neden hemen bir sonraki adım olması gerektiğinin rasyoneli (Rastgele değil, tamamlanan X eğitiminin üzerine inşa edilen Y konusu).
- Eğitimin içermesi gereken net müfredat başlıkları.
- Uygulamalı bitirme projesi önerisi (Hands-on Capstone).
- Tahmini çalışma süresi ve arama terimleri/önerilen platformlar.
4. Adım adım bir ilerleme yol haritası (Milestone Timeline) oluştur.`
      : `You are an elite Senior Career & Learning Path Strategist.
The user provides a dossier of courses and trainings they have completed, including their specific curricula and topics covered.
Target Role: "${targetRole}" ${currentRole ? `(Current Role: ${currentRole})` : ''}.
Learning Preference: "${learningStyle}".

Your task:
1. Analyze the completed training contents deeply. Synthesize their current verified skill profile.
2. Pinpoint the highest-leverage skill gaps separating them from their target role.
3. Formulate 3-4 logically sequenced "Next Step Learning Recommendations" that pick up precisely where their previous courses left off, explaining the exact rationale of why this specific training is the sequential next step.
Include core curriculum modules, a hands-on portfolio project idea, duration, and search keywords.
4. Provide a milestone progression timeline.`;

    const prompt = isTr
      ? `Tamamlanan Eğitimler:
${coursesText}

Hedef Rol: ${targetRole}
${currentRole ? `Mevcut Rol: ${currentRole}` : ''}
Öğrenme Tercihi: ${learningStyle}

Lütfen bu içerikleri sentezleyerek adım adım bir sonraki eğitim rotasını JSON formatında oluştur.`
      : `Completed Trainings:
${coursesText}

Target Role: ${targetRole}
${currentRole ? `Current Role: ${currentRole}` : ''}
Learning Style: ${learningStyle}

Synthesize these courses and produce the next-step curriculum roadmap in structured JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentLevelSummary: {
              type: Type.STRING,
              description: 'Executive summary of the candidate skills synthesized from their completed trainings.',
            },
            verifiedSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  category: { type: Type.STRING },
                  masteryLevel: { type: Type.STRING, description: 'Temel, Orta, İleri' },
                  evidence: { type: Type.STRING, description: 'Hangi eğitim içeriğinden kazanıldı' },
                },
                required: ['skill', 'category', 'masteryLevel', 'evidence'],
              },
            },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  missingSkill: { type: Type.STRING },
                  importance: { type: Type.STRING, description: 'Kritik, Yüksek, Orta' },
                  whyItMatters: { type: Type.STRING },
                },
                required: ['missingSkill', 'importance', 'whyItMatters'],
              },
            },
            recommendedNextCourses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priorityOrder: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  targetDomain: { type: Type.STRING },
                  level: { type: Type.STRING, description: 'Orta Düzey, İleri Düzey, Uzman' },
                  estimatedDuration: { type: Type.STRING },
                  whyThisNext: {
                    type: Type.STRING,
                    description: 'Tamamlanan eğitimlerle olan doğrudan bağlantısı ve bir sonraki adım olma gerekçesi.',
                  },
                  essentialCurriculum: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Bu eğitimde kesinlikle yer alması gereken 4-6 ana konu başlığı.',
                  },
                  capstoneProject: {
                    type: Type.STRING,
                    description: 'Bu eğitimi taçlandıracak portfolyo projesi.',
                  },
                  recommendedPlatforms: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  searchKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  'priorityOrder',
                  'title',
                  'targetDomain',
                  'level',
                  'estimatedDuration',
                  'whyThisNext',
                  'essentialCurriculum',
                  'capstoneProject',
                  'recommendedPlatforms',
                  'searchKeywords',
                ],
              },
            },
            milestoneTimeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  timeframe: { type: Type.STRING },
                  objective: { type: Type.STRING },
                },
                required: ['phase', 'timeframe', 'objective'],
              },
            },
          },
          required: [
            'currentLevelSummary',
            'verifiedSkills',
            'skillGaps',
            'recommendedNextCourses',
            'milestoneTimeline',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating career roadmap:', err);
    return res.status(500).json({
      error: err.message || 'Kariyer ve eğitim yol haritası üretilirken bir hata oluştu.',
    });
  }
});

// ==========================================
// STATIC / VITE INTEGRATION
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
