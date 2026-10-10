import React from 'react';
import { X, Sparkles, UserCheck, BookOpen, ArrowRight } from 'lucide-react';
import { INTERVIEW_PRESETS, CAREER_PRESETS, InterviewPreset, CareerPreset } from '../presets';
import { Language } from '../types';

interface PresetsModalProps {
  language: Language;
  onSelectInterviewPreset: (preset: InterviewPreset) => void;
  onSelectCareerPreset: (preset: CareerPreset) => void;
  onClose: () => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  language,
  onSelectInterviewPreset,
  onSelectCareerPreset,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              {language === 'tr' ? 'Hazır Senaryolar ile Hızlı Başlangıç' : 'Quick Start Real Scenarios'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Interview Coach Presets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>{language === 'tr' ? 'Mülakat Koçu Senaryoları' : 'Interview Coach Scenarios'}</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {INTERVIEW_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectInterviewPreset(preset);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors group flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-900">
                      {language === 'tr' ? preset.labelTr : preset.labelEn}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="font-medium text-slate-700">Mülakatçı: {preset.interviewerTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span>{preset.targetRole}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Career Roadmap Presets */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>{language === 'tr' ? 'Eğitim & Kariyer Rotası Senaryoları' : 'Career Learning Scenarios'}</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {CAREER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectCareerPreset(preset);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors group flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-emerald-900">
                      {language === 'tr' ? preset.labelTr : preset.labelEn}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="font-medium text-slate-700">{preset.courses.length} Tamamlanan Eğitim</span>
                      <span aria-hidden="true">·</span>
                      <span>Hedef: {preset.targetRole}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {language === 'tr' ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
