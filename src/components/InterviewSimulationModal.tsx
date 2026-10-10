import React, { useState } from 'react';
import {
  X,
  Send,
  Loader2,
  Award,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation, Language } from '../types';
import { translations } from '../translations';

interface InterviewSimulationModalProps {
  question: InterviewQuestion;
  interviewerTitle: string;
  targetRole: string;
  language: Language;
  onClose: () => void;
}

export const InterviewSimulationModal: React.FC<InterviewSimulationModalProps> = ({
  question,
  interviewerTitle,
  targetRole,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          category: question.category,
          interviewerTitle,
          targetRole,
          userAnswer: userAnswer.trim(),
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Cevap değerlendirilemedi.');
      }

      setEvaluation(data);
    } catch (err: any) {
      setError(err.message || 'Değerlendirme sırasında bir hata meydana geldi.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span>{t.simulationHeader}</span>
              <span aria-hidden="true">·</span>
              <span>{interviewerTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{targetRole}</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
              {question.question}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Question Context Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">
              {question.categoryLabel}
            </div>
            <p className="text-sm font-medium text-slate-800 mb-2">
              "{question.question}"
            </p>
            <div className="text-xs text-slate-600 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>{t.whyTheyAsk}:</strong> {question.rationale}
              </span>
            </div>
          </div>

          {/* Answer Input Form */}
          {!evaluation && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {language === 'tr' ? 'Yanıtınız:' : 'Your Response:'}
                </label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={t.yourAnswerPlaceholder}
                  className="w-full text-sm rounded-xl border border-slate-300 p-3.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800 placeholder-slate-400 transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  {language === 'tr'
                    ? 'İpucu: STAR formatını (Durum, Görev, Aksiyon, Sonuç) kullanarak somut veriler verin.'
                    : 'Tip: Leverage the STAR method with tangible metrics.'}
                </span>

                <button
                  type="submit"
                  disabled={loading || !userAnswer.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors shadow-xs shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.btnEvaluating}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.btnSubmitAnswer}</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          )}

          {/* Evaluation Results */}
          {evaluation && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score & Verdict Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border font-bold ${getScoreColor(
                      evaluation.score
                    )}`}
                  >
                    <span className="text-2xl tabular-nums leading-none">
                      {evaluation.score}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75 mt-0.5">
                      / 100
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {t.scoreTitle}
                    </div>
                    <div className="text-base font-bold text-slate-900">
                      {evaluation.verdict}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEvaluation(null);
                    setUserAnswer('');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors self-start sm:self-auto"
                >
                  {language === 'tr' ? 'Yeniden Yanıtla' : 'Re-attempt Answer'}
                </button>
              </div>

              {/* Interviewer Immediate Reaction */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-150">
                <div className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{t.interviewerReactionTitle} ({interviewerTitle})</span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-950 italic">
                  "{evaluation.interviewerReaction}"
                </p>
              </div>

              {/* Strengths & Improvements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-150">
                  <div className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5 mb-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.strengthsTitle}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {evaluation.strengths.map((str, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-emerald-950 flex items-start gap-1.5"
                      >
                        <span className="text-emerald-500 font-bold shrink-0">·</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-150">
                  <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5 mb-2.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.improvementsTitle}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {evaluation.improvements.map((imp, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-amber-950 flex items-start gap-1.5"
                      >
                        <span className="text-amber-500 font-bold shrink-0">·</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Refined 95+ Model Answer */}
              <div className="p-4.5 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>{t.refinedIdealTitle}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3.5 rounded-lg border border-slate-150">
                  {evaluation.refinedIdealAnswer}
                </div>
              </div>

              {/* Follow-up Probe Question */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5">
                <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.followUpProbeTitle}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  "{evaluation.followUpQuestion}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t.closeSimulateBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
