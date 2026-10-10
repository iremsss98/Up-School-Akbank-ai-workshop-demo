import React, { useState } from 'react';
import {
  UserCheck,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Award,
  Lightbulb,
  CheckCircle,
  Play,
  Save,
  FileDown,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { InterviewSessionData, InterviewQuestion, Language } from '../types';
import { translations } from '../translations';
import { InterviewSimulationModal } from './InterviewSimulationModal';

interface InterviewCoachProps {
  language: Language;
  sessionData: InterviewSessionData | null;
  setSessionData: React.Dispatch<React.SetStateAction<InterviewSessionData | null>>;
  onSaveSession: (session: InterviewSessionData) => void;
}

const COMMON_TITLES = [
  'Engineering Manager',
  'Chief Technology Officer (CTO)',
  'Lead System Architect',
  'HR / Talent Acquisition Director',
  'Senior Product Manager',
  'Principal Frontend Engineer',
];

export const InterviewCoach: React.FC<InterviewCoachProps> = ({
  language,
  sessionData,
  setSessionData,
  onSaveSession,
}) => {
  const t = translations[language];

  // Form State
  const [interviewerTitle, setInterviewerTitle] = useState(sessionData?.interviewerTitle || '');
  const [targetRole, setTargetRole] = useState(sessionData?.targetRole || '');
  const [experienceLevel, setExperienceLevel] = useState(sessionData?.experienceLevel || 'Mid-Level (2-5 yıl)');
  const [companyContext, setCompanyContext] = useState(sessionData?.companyContext || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Expanded answers state (question id -> boolean)
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});

  // Active question for mock practice modal
  const [activePracticeQuestion, setActivePracticeQuestion] = useState<InterviewQuestion | null>(null);
  
  // Save notification toast
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (sessionData) {
      setInterviewerTitle(sessionData.interviewerTitle || '');
      setTargetRole(sessionData.targetRole || '');
      setExperienceLevel(sessionData.experienceLevel || 'Mid-Level (2-5 yıl)');
      setCompanyContext(sessionData.companyContext || '');
    }
  }, [sessionData]);

  const toggleAnswer = (id: string) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewerTitle.trim() || !targetRole.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle: interviewerTitle.trim(),
          targetRole: targetRole.trim(),
          experienceLevel,
          companyContext: companyContext.trim(),
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Sorular üretilemedi.');
      }

      const newSession: InterviewSessionData = {
        id: 'int_' + Date.now(),
        interviewerTitle: interviewerTitle.trim(),
        targetRole: targetRole.trim(),
        experienceLevel,
        companyContext: companyContext.trim(),
        interviewerPerspective: data.interviewerPerspective,
        keyFocusAreas: data.keyFocusAreas || [],
        mindsetTips: data.mindsetTips || [],
        questions: data.questions || [],
        createdAt: new Date().toISOString(),
      };

      setSessionData(newSession);
      setSelectedCategory('all');
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!sessionData) return;
    onSaveSession(sessionData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportMarkdown = () => {
    if (!sessionData) return;
    const content = `# Pathfinder AI Mülakat Seti
**Mülakatçı Unvanı:** ${sessionData.interviewerTitle}
**Hedef Rol:** ${sessionData.targetRole}
**Deneyim:** ${sessionData.experienceLevel}
${sessionData.companyContext ? `**Şirket/Sektör:** ${sessionData.companyContext}\n` : ''}
---
### Mülakatçı Zihniyeti
${sessionData.interviewerPerspective}

### Temel Odak Alanları
${sessionData.keyFocusAreas.map((f) => `- ${f}`).join('\n')}

---
### Sorular
${sessionData.questions
  .map(
    (q, i) => `#### ${i + 1}. [${q.categoryLabel}] ${q.question}
**Bu unvan neden sorar?** ${q.rationale}
**Değerlendirme Kriteri:** ${q.evaluationCriteria}
**Hazırlık Tüyosu:** ${q.preparationTips}
**Örnek Model Yanıt:**
${q.sampleAnswer}
`
  )
  .join('\n---\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mulakat_${sessionData.interviewerTitle.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter questions
  const filteredQuestions = sessionData?.questions.filter((q) => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1.5">
          <UserCheck className="w-4 h-4" />
          <span>{language === 'tr' ? 'Unvan Odaklı Mülakat Koçu' : 'Interviewer Title Grounded Coach'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.interviewHeading}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          {t.interviewSubheading}
        </p>
      </div>

      {/* Input Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Interviewer Title */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-900">
                {t.interviewerTitleLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder={t.interviewerTitlePlaceholder}
                className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900 placeholder-slate-400 transition-colors"
                required
              />
              {/* Quick suggestion buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1">{t.quickTitles}</span>
                {COMMON_TITLES.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setInterviewerTitle(title)}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-900">
                {t.targetRoleLabel} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder={t.targetRolePlaceholder}
                className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900 placeholder-slate-400 transition-colors"
                required
              />
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-900">
                {t.experienceLevelLabel}
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900 transition-colors bg-white"
              >
                <option value="Junior (0-2 yıl)">Junior (0-2 yıl / 0-2 yrs)</option>
                <option value="Mid-Level (2-5 yıl)">Mid-Level (2-5 yıl / 2-5 yrs)</option>
                <option value="Senior (5+ yıl)">Senior (5+ yıl / 5+ yrs)</option>
                <option value="Lead / Staff / Director (7+ yıl)">Lead / Staff / Director (7+ yıl)</option>
              </select>
            </div>

            {/* Company Context */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-900">
                {t.companyContextLabel}
              </label>
              <input
                type="text"
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                placeholder={t.companyContextPlaceholder}
                className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-900 placeholder-slate-400 transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 hidden sm:inline">
              {language === 'tr'
                ? 'Seçtiğiniz unvanın psikolojisine ve değerlendirme kriterlerine özel soru seti hazırlanır.'
                : 'Questions calibrated to this specific title mindset and interview rubrics.'}
            </span>

            <button
              type="submit"
              disabled={loading || !interviewerTitle.trim() || !targetRole.trim()}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all shadow-xs ml-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.btnGenerating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>{t.btnGenerateQuestions}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {sessionData && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Action Ribbon: Save & Export */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{sessionData.interviewerTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{sessionData.targetRole}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono">{sessionData.questions.length} Soru</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{language === 'tr' ? 'Kaydedildi' : 'Saved'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-slate-600" />
                    <span>{language === 'tr' ? 'Oturumu Kaydet' : 'Save Session'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-600" />
                <span>{t.exportMarkdown}</span>
              </button>
            </div>
          </div>

          {/* Interviewer Psychology & Perspective Dossier */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-5 shadow-lg border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.perspectiveTitle}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  "{sessionData.interviewerTitle}" Unvanının Masadaki Gizli Ajandası
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {sessionData.interviewerPerspective}
            </p>

            {/* Key Focus Pillars & Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              {/* Pillars */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {t.keyFocusPillars}
                </div>
                <ul className="space-y-1.5">
                  {sessionData.keyFocusAreas.map((area, idx) => (
                    <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">·</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mindset tips */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {t.mindsetAdvices}
                </div>
                <ul className="space-y-1.5">
                  {sessionData.mindsetTips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">·</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {[
                { id: 'all', label: t.allQuestions },
                { id: 'technical', label: t.categoryTechnical },
                { id: 'behavioral', label: t.categoryBehavioral },
                { id: 'situational', label: t.categorySituational },
                { id: 'leadership_culture', label: t.categoryLeadership },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-medium tabular-nums hidden sm:inline">
              {filteredQuestions.length} {language === 'tr' ? 'soru listeleniyor' : 'questions shown'}
            </span>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const isExpanded = !!expandedAnswers[q.id];

              return (
                <div
                  key={q.id || idx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs transition-shadow hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-indigo-700">
                          {q.categoryLabel || q.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">Soru {idx + 1}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    {/* Simulation Action CTA */}
                    <button
                      onClick={() => setActivePracticeQuestion(q)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs shrink-0 self-start"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t.simulateBtn}</span>
                    </button>
                  </div>

                  {/* Why They Ask & Evaluation Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t.whyTheyAsk}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {q.rationale}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{t.evaluationScale}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {q.evaluationCriteria}
                      </p>
                    </div>
                  </div>

                  {/* Preparation Tip Box */}
                  <div className="text-xs text-slate-600 flex items-start gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>{t.prepTip}</strong> {q.preparationTips}
                    </span>
                  </div>

                  {/* Toggle Model Answer */}
                  <div className="pt-1">
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>{t.modelAnswerBtn}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in duration-200">
                        <div className="text-xs font-semibold text-slate-800">
                          {language === 'tr' ? 'Kusursuz Yanıt Modeli (STAR & Derinlik):' : 'Exemplary Model Response (STAR & Depth):'}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {q.sampleAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Mock Practice Modal */}
      {activePracticeQuestion && sessionData && (
        <InterviewSimulationModal
          question={activePracticeQuestion}
          interviewerTitle={sessionData.interviewerTitle}
          targetRole={sessionData.targetRole}
          language={language}
          onClose={() => setActivePracticeQuestion(null)}
        />
      )}
    </div>
  );
};
