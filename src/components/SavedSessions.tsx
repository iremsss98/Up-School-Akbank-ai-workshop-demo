import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Calendar,
  UserCheck,
  BookOpen,
  FileDown,
} from 'lucide-react';
import { InterviewSessionData, CareerRoadmapData, Language } from '../types';
import { translations } from '../translations';

interface SavedSessionsProps {
  language: Language;
  savedInterviews: InterviewSessionData[];
  savedRoadmaps: CareerRoadmapData[];
  onLoadInterview: (session: InterviewSessionData) => void;
  onLoadRoadmap: (roadmap: CareerRoadmapData) => void;
  onDeleteInterview: (id: string) => void;
  onDeleteRoadmap: (id: string) => void;
}

export const SavedSessions: React.FC<SavedSessionsProps> = ({
  language,
  savedInterviews,
  savedRoadmaps,
  onLoadInterview,
  onLoadRoadmap,
  onDeleteInterview,
  onDeleteRoadmap,
}) => {
  const t = translations[language];
  const [subTab, setSubTab] = useState<'interview' | 'career'>('interview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          <Bookmark className="w-4 h-4 text-slate-700" />
          <span>{language === 'tr' ? 'Yerel Arşiv' : 'Local Archive'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t.navSaved}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          {language === 'tr'
            ? 'Geçmişte oluşturduğunuz mülakat soru setleri ve kariyer yol haritalarını inceleyin veya yeniden açın.'
            : 'Access and review your previously generated interview question sets and career roadmaps.'}
        </p>
      </div>

      {/* Segmented Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setSubTab('interview')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
            subTab === 'interview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.interviewTabLabel}</span>
          <span className="text-xs font-mono ml-1 tabular-nums opacity-80">
            ({savedInterviews.length})
          </span>
        </button>

        <button
          onClick={() => setSubTab('career')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
            subTab === 'career'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.careerTabLabel}</span>
          <span className="text-xs font-mono ml-1 tabular-nums opacity-80">
            ({savedRoadmaps.length})
          </span>
        </button>
      </div>

      {/* Saved Interviews List */}
      {subTab === 'interview' && (
        <div className="space-y-4">
          {savedInterviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
              {t.savedEmpty}
            </div>
          ) : (
            savedInterviews.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-indigo-700">
                      {session.interviewerTitle}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{session.targetRole}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-mono">
                      {session.questions.length} Soru
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 max-w-2xl">
                    {session.interviewerPerspective}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onLoadInterview(session)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.loadButton}</span>
                  </button>

                  <button
                    onClick={() => onDeleteInterview(session.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={t.deleteButton}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Saved Career Roadmaps List */}
      {subTab === 'career' && (
        <div className="space-y-4">
          {savedRoadmaps.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
              {t.savedEmpty}
            </div>
          ) : (
            savedRoadmaps.map((roadmap) => (
              <div
                key={roadmap.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-emerald-700">
                      {roadmap.targetRole}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-mono">
                      {roadmap.recommendedNextCourses.length} Kurs Tavsiyesi
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 max-w-2xl">
                    {roadmap.currentLevelSummary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onLoadRoadmap(roadmap)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.loadButton}</span>
                  </button>

                  <button
                    onClick={() => onDeleteRoadmap(roadmap.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={t.deleteButton}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
