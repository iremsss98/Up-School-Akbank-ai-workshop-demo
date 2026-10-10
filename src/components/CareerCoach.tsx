import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Compass,
  Calendar,
  Layers,
  ArrowRight,
  Save,
  FileDown,
  Info,
  Clock,
  Target,
  Search,
} from 'lucide-react';
import { CompletedCourse, CareerRoadmapData, Language } from '../types';
import { translations } from '../translations';
import { CAREER_PRESETS } from '../presets';

interface CareerCoachProps {
  language: Language;
  roadmapData: CareerRoadmapData | null;
  setRoadmapData: React.Dispatch<React.SetStateAction<CareerRoadmapData | null>>;
  onSaveRoadmap: (roadmap: CareerRoadmapData) => void;
}

export const CareerCoach: React.FC<CareerCoachProps> = ({
  language,
  roadmapData,
  setRoadmapData,
  onSaveRoadmap,
}) => {
  const t = translations[language];

  // Course List State (defaults to a realistic starter set)
  const [courses, setCourses] = useState<CompletedCourse[]>(
    roadmapData?.completedCoursesSnapshot || [
      {
        id: 'c-init-1',
        title: 'Modern React 19 & TypeScript Masterclass',
        provider: 'Frontend Masters',
        topicsCovered:
          'Advanced React Hooks, Context API, TypeScript Generics, Component Composition, Strict Types, Tailwind CSS styling',
        completedYear: '2025',
      },
      {
        id: 'c-init-2',
        title: 'State Management & Web Performance Optimization',
        provider: 'Udemy',
        topicsCovered:
          'TanStack Query (React Query) server-state caching, Zustand, Core Web Vitals, Bundle Splitting, Virtualized Lists, Memory profiling',
        completedYear: '2025',
      },
    ]
  );

  // New Course Form Inputs
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newTopics, setNewTopics] = useState('');
  const [newYear, setNewYear] = useState('');

  // Career Goal Form Inputs
  const [targetRole, setTargetRole] = useState(roadmapData?.targetRole || 'Senior Full Stack Cloud Engineer');
  const [currentRole, setCurrentRole] = useState(roadmapData?.currentRole || 'Mid-Level Frontend Developer');
  const [learningStyle, setLearningStyle] = useState('Uygulamalı Portfolyo & Proje Odaklı');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (roadmapData) {
      if (roadmapData.completedCoursesSnapshot && roadmapData.completedCoursesSnapshot.length > 0) {
        setCourses(roadmapData.completedCoursesSnapshot);
      }
      if (roadmapData.targetRole) setTargetRole(roadmapData.targetRole);
      if (roadmapData.currentRole) setCurrentRole(roadmapData.currentRole);
    }
  }, [roadmapData]);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopics.trim()) return;

    const newCourse: CompletedCourse = {
      id: 'c_' + Date.now(),
      title: newTitle.trim(),
      provider: newProvider.trim() || 'Genel Platform',
      topicsCovered: newTopics.trim(),
      completedYear: newYear.trim() || new Date().getFullYear().toString(),
    };

    setCourses((prev) => [...prev, newCourse]);
    setNewTitle('');
    setNewProvider('');
    setNewTopics('');
    setNewYear('');
    setIsAddingCourse(false);
  };

  const handleRemoveCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = CAREER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setCourses(preset.courses);
    setTargetRole(preset.targetRole);
    setCurrentRole(preset.currentRole);
  };

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (courses.length === 0) {
      setError(
        language === 'tr'
          ? 'Lütfen en az bir tamamlanan eğitim/kurs ekleyin.'
          : 'Please add at least one completed training/course.'
      );
      return;
    }

    if (!targetRole.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/career/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedCourses: courses,
          targetRole: targetRole.trim(),
          currentRole: currentRole.trim(),
          learningStyle,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Yol haritası oluşturulamadı.');
      }

      const newRoadmap: CareerRoadmapData = {
        id: 'rd_' + Date.now(),
        targetRole: targetRole.trim(),
        currentRole: currentRole.trim(),
        currentLevelSummary: data.currentLevelSummary,
        verifiedSkills: data.verifiedSkills || [],
        skillGaps: data.skillGaps || [],
        recommendedNextCourses: data.recommendedNextCourses || [],
        milestoneTimeline: data.milestoneTimeline || [],
        completedCoursesSnapshot: [...courses],
        createdAt: new Date().toISOString(),
      };

      setRoadmapData(newRoadmap);
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında bir hata meydana geldi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!roadmapData) return;
    onSaveRoadmap(roadmapData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportMarkdown = () => {
    if (!roadmapData) return;
    const content = `# Pathfinder AI: Kariyer & Eğitim Yol Haritası
**Hedef Pozisyon:** ${roadmapData.targetRole}
**Mevcut Rol:** ${roadmapData.currentRole || 'Belirtilmedi'}
**Tarih:** ${new Date(roadmapData.createdAt).toLocaleDateString()}

---
### Mevcut Durum & Yetkinlik Sentezi
${roadmapData.currentLevelSummary}

---
### Kanıtlı Kazanılmış Yetkinlikler
${roadmapData.verifiedSkills
  .map((s) => `- **${s.skill}** (${s.masteryLevel}): ${s.evidence}`)
  .join('\n')}

---
### Kritik Yetenek Açıkları (Skill Gaps)
${roadmapData.skillGaps
  .map((g) => `- **${g.missingSkill}** [${g.importance}]: ${g.whyItMatters}`)
  .join('\n')}

---
### Bir Sonraki Adım İçin Önerilen Eğitimler
${roadmapData.recommendedNextCourses
  .map(
    (c, i) => `#### ${i + 1}. ${c.title} (${c.level} - ${c.estimatedDuration})
**Neden Bu Eğitim Sonraki Adım?** ${c.whyThisNext}
**Müfredat:**
${c.essentialCurriculum.map((m) => `  - ${m}`).join('\n')}
**Bitirme Portfolyo Projesi:** ${c.capstoneProject}
**Arama Terimleri:** ${c.searchKeywords.join(', ')}
`
  )
  .join('\n---\n')}

---
### Zaman Çizelgesi
${roadmapData.milestoneTimeline
  .map((m) => `- **${m.phase}** (${m.timeframe}): ${m.objective}`)
  .join('\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kariyer_rotasi_${roadmapData.targetRole.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1.5">
          <BookOpen className="w-4 h-4" />
          <span>{language === 'tr' ? 'Eğitim İçeriklerine Dayalı Kariyer Koçu' : 'Curriculum-Grounded Career Coach'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.careerHeading}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          {t.careerSubheading}
        </p>
      </div>

      {/* Main Dossier & Analysis Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Completed Courses Header & Preset Quick Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t.completedTrainingsHeader}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'tr'
                ? 'Katıldığınız kursları ve öğrendiğiniz konuları aşağıya listeleyin.'
                : 'List your completed courses and the topics/syllabus covered.'}
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Örnek:</span>
            {CAREER_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleLoadPreset(p.id)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors whitespace-nowrap"
              >
                {language === 'tr' ? p.labelTr : p.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Existing Courses List */}
        <div className="space-y-3">
          {courses.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
              {t.noCoursesYet}
            </div>
          ) : (
            courses.map((course, idx) => (
              <div
                key={course.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-900">
                      #{idx + 1} {course.title}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{course.provider}</span>
                    {course.completedYear && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-mono">{course.completedYear}</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-150">
                    <strong className="text-slate-900">İçerik / Konular:</strong> {course.topicsCovered}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCourse(course.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors self-start shrink-0"
                  title="Eğitimi Kaldır"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          {/* Add Course Toggle & Inline Form */}
          {!isAddingCourse ? (
            <button
              type="button"
              onClick={() => setIsAddingCourse(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-1"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addCourseBtn}</span>
            </button>
          ) : (
            <form
              onSubmit={handleAddCourse}
              className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-150 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t.courseTitle} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="ör. Microservices Architecture with Node.js & Docker"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    {t.courseProvider}
                  </label>
                  <input
                    type="text"
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    placeholder="ör. Coursera, Udemy, BootCamp..."
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t.courseTopics} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  placeholder={t.courseTopicsPlaceholder}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <input
                  type="text"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  placeholder="Yıl (ör. 2025)"
                  className="w-28 text-xs rounded-lg border border-slate-300 p-2 bg-white text-slate-900 outline-none"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCourse(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                  >
                    {t.btnAddCourseSubmit}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Target Role & Career Objectives Form */}
        <div className="pt-4 border-t border-slate-200">
          <form onSubmit={handleGenerateRoadmap} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  {t.targetCareerLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder={t.targetCareerPlaceholder}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-indigo-500 outline-none text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  {t.currentCareerLabel}
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder={t.currentCareerPlaceholder}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-indigo-500 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  {t.learningStyleLabel}
                </label>
                <select
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-indigo-500 outline-none text-slate-900 bg-white"
                >
                  <option value="Uygulamalı Portfolyo & Proje Odaklı">
                    Uygulamalı Portfolyo & Proje Odaklı
                  </option>
                  <option value="Derin Teorik & Mimari Prensipler">
                    Derin Teorik & Mimari Prensipler
                  </option>
                  <option value="Endüstri Standartları & Sertifikasyon">
                    Endüstri Standartları & Sertifikasyon
                  </option>
                </select>
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
                  ? 'Mevcut eğitimlerinizin bittiği noktadan sonraki stratejik adımlar tespit edilir.'
                  : 'Detects the optimal next steps precisely where previous courses ended.'}
              </span>

              <button
                type="submit"
                disabled={loading || courses.length === 0 || !targetRole.trim()}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all shadow-xs ml-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.btnAnalyzingCourses}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{t.btnGenerateRoadmap}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results View: Skill Gap Analysis & Recommended Next Steps */}
      {roadmapData && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Action Ribbon: Save & Export */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{roadmapData.targetRole}</span>
              <span aria-hidden="true">·</span>
              <span>{roadmapData.recommendedNextCourses.length} Önerilen Eğitim</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono">{roadmapData.skillGaps.length} Yetenek Açığı</span>
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
                    <span>{language === 'tr' ? 'Rotayı Kaydet' : 'Save Roadmap'}</span>
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

          {/* Current Baseline Analysis Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-4 shadow-lg border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>{t.currentBaselineTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Eğitimlerinizin Sentezi ve Mevcut Bilgi Birikiminiz
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {roadmapData.currentLevelSummary}
            </p>
          </div>

          {/* Dual Grid: Verified Skills vs. Skill Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Verified Acquired Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.verifiedSkillsTitle}</span>
              </div>
              <div className="space-y-2.5">
                {roadmapData.verifiedSkills.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-150 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{item.skill}</span>
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.masteryLevel}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      <strong>Kanıt:</strong> {item.evidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Critical Skill Gaps */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t.skillGapsTitle}</span>
              </div>
              <div className="space-y-2.5">
                {roadmapData.skillGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50/50 border border-amber-150 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-950">{gap.missingSkill}</span>
                      <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {gap.importance} Öncelik
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-900 leading-relaxed">
                      {gap.whyItMatters}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Next Step Courses Section */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                <Layers className="w-4 h-4" />
                <span>{language === 'tr' ? 'Mantıksal Sıralı Rota' : 'Sequenced Learning Path'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {t.recommendedNextCoursesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {language === 'tr'
                  ? 'Aşağıdaki eğitimler rastgele seçilmemiştir; tamamladığınız eğitimlerin doğrudan devamı niteliğindedir.'
                  : 'These courses directly bridge the exact concepts left off by your previous curricula.'}
              </p>
            </div>

            <div className="space-y-6">
              {roadmapData.recommendedNextCourses.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs transition-shadow hover:shadow-md"
                >
                  {/* Step Rank & Title */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-150">
                          {idx === 0
                            ? 'Öncelik 1: İlk Alınması Gereken Adım'
                            : `Öncelik ${idx + 1}: Sıradaki Gelişim Adımı`}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{rec.level}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {rec.estimatedDuration}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                        {rec.title}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium">
                        Hedef Alan: {rec.targetDomain}
                      </div>
                    </div>
                  </div>

                  {/* WHY THIS COURSE IS THE EXACT NEXT STEP (User's primary requirement!) */}
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-150 space-y-1">
                    <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-600" />
                      <span>{t.whyThisNextCourse}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
                      {rec.whyThisNext}
                    </p>
                  </div>

                  {/* Essential Curriculum Checklist & Capstone Idea */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Curriculum modules */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-2">
                      <div className="text-xs font-semibold text-slate-900">
                        {t.curriculumChecklist}
                      </div>
                      <ul className="space-y-1.5">
                        {rec.essentialCurriculum.map((item, cIdx) => (
                          <li
                            key={cIdx}
                            className="text-xs text-slate-700 flex items-start gap-2"
                          >
                            <span className="text-indigo-600 font-bold shrink-0">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Capstone project */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-2">
                      <div className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t.capstoneIdea}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {rec.capstoneProject}
                      </p>
                    </div>
                  </div>

                  {/* Search Keywords & Platforms */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{t.platformsLabel}</span>
                      <span className="text-slate-600">
                        {rec.recommendedPlatforms.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{t.searchKeywordsLabel}</span>
                      <div className="flex items-center gap-1">
                        {rec.searchKeywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-700 font-mono"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{t.timelineTitle}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {roadmapData.milestoneTimeline.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-150 space-y-2 relative"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-700">{step.phase}</span>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {step.timeframe}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {step.objective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
