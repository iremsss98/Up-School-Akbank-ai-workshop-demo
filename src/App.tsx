/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InterviewCoach } from './components/InterviewCoach';
import { CareerCoach } from './components/CareerCoach';
import { SavedSessions } from './components/SavedSessions';
import { PresetsModal } from './components/PresetsModal';
import {
  Language,
  InterviewSessionData,
  CareerRoadmapData,
} from './types';
import { InterviewPreset, CareerPreset } from './presets';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('pathfinder_lang');
    return (saved as Language) || 'tr';
  });

  const [activeTab, setActiveTab] = useState<'interview' | 'career' | 'saved'>('interview');
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Active session data
  const [interviewSession, setInterviewSession] = useState<InterviewSessionData | null>(() => {
    const saved = localStorage.getItem('pathfinder_active_interview');
    return saved ? JSON.parse(saved) : null;
  });

  const [careerRoadmap, setCareerRoadmap] = useState<CareerRoadmapData | null>(() => {
    const saved = localStorage.getItem('pathfinder_active_roadmap');
    return saved ? JSON.parse(saved) : null;
  });

  // Archive / Saved Sessions
  const [savedInterviews, setSavedInterviews] = useState<InterviewSessionData[]>(() => {
    const saved = localStorage.getItem('pathfinder_saved_interviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedRoadmaps, setSavedRoadmaps] = useState<CareerRoadmapData[]>(() => {
    const saved = localStorage.getItem('pathfinder_saved_roadmaps');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist language
  useEffect(() => {
    localStorage.setItem('pathfinder_lang', language);
  }, [language]);

  // Persist active sessions
  useEffect(() => {
    if (interviewSession) {
      localStorage.setItem('pathfinder_active_interview', JSON.stringify(interviewSession));
    }
  }, [interviewSession]);

  useEffect(() => {
    if (careerRoadmap) {
      localStorage.setItem('pathfinder_active_roadmap', JSON.stringify(careerRoadmap));
    }
  }, [careerRoadmap]);

  // Persist saved archives
  useEffect(() => {
    localStorage.setItem('pathfinder_saved_interviews', JSON.stringify(savedInterviews));
  }, [savedInterviews]);

  useEffect(() => {
    localStorage.setItem('pathfinder_saved_roadmaps', JSON.stringify(savedRoadmaps));
  }, [savedRoadmaps]);

  // Actions
  const handleSaveInterview = (session: InterviewSessionData) => {
    setSavedInterviews((prev) => {
      const exists = prev.some((s) => s.id === session.id);
      if (exists) {
        return prev.map((s) => (s.id === session.id ? session : s));
      }
      return [session, ...prev];
    });
  };

  const handleSaveRoadmap = (roadmap: CareerRoadmapData) => {
    setSavedRoadmaps((prev) => {
      const exists = prev.some((r) => r.id === roadmap.id);
      if (exists) {
        return prev.map((r) => (r.id === roadmap.id ? roadmap : r));
      }
      return [roadmap, ...prev];
    });
  };

  const handleDeleteInterview = (id: string) => {
    setSavedInterviews((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteRoadmap = (id: string) => {
    setSavedRoadmaps((prev) => prev.filter((r) => r.id !== id));
  };

  const handleLoadInterviewFromSaved = (session: InterviewSessionData) => {
    setInterviewSession(session);
    setActiveTab('interview');
  };

  const handleLoadRoadmapFromSaved = (roadmap: CareerRoadmapData) => {
    setCareerRoadmap(roadmap);
    setActiveTab('career');
  };

  const handleSelectInterviewPreset = (preset: InterviewPreset) => {
    // Generate a starter session draft with the preset parameters
    setInterviewSession({
      id: 'int_preset_' + Date.now(),
      interviewerTitle: preset.interviewerTitle,
      targetRole: preset.targetRole,
      experienceLevel: preset.experienceLevel,
      companyContext: preset.companyContext,
      interviewerPerspective: '',
      keyFocusAreas: [],
      mindsetTips: [],
      questions: [],
      createdAt: new Date().toISOString(),
    });
    setActiveTab('interview');
  };

  const handleSelectCareerPreset = (preset: CareerPreset) => {
    setCareerRoadmap({
      id: 'rd_preset_' + Date.now(),
      targetRole: preset.targetRole,
      currentRole: preset.currentRole,
      currentLevelSummary: '',
      verifiedSkills: [],
      skillGaps: [],
      recommendedNextCourses: [],
      milestoneTimeline: [],
      completedCoursesSnapshot: preset.courses,
      createdAt: new Date().toISOString(),
    });
    setActiveTab('career');
  };

  const handleReset = () => {
    if (activeTab === 'interview') {
      setInterviewSession(null);
      localStorage.removeItem('pathfinder_active_interview');
    } else if (activeTab === 'career') {
      setCareerRoadmap(null);
      localStorage.removeItem('pathfinder_active_roadmap');
    }
  };

  const totalSavedCount = savedInterviews.length + savedRoadmaps.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onReset={handleReset}
        savedCount={totalSavedCount}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'interview' && (
          <InterviewCoach
            language={language}
            sessionData={interviewSession}
            setSessionData={setInterviewSession}
            onSaveSession={handleSaveInterview}
          />
        )}

        {activeTab === 'career' && (
          <CareerCoach
            language={language}
            roadmapData={careerRoadmap}
            setRoadmapData={setCareerRoadmap}
            onSaveRoadmap={handleSaveRoadmap}
          />
        )}

        {activeTab === 'saved' && (
          <SavedSessions
            language={language}
            savedInterviews={savedInterviews}
            savedRoadmaps={savedRoadmaps}
            onLoadInterview={handleLoadInterviewFromSaved}
            onLoadRoadmap={handleLoadRoadmapFromSaved}
            onDeleteInterview={handleDeleteInterview}
            onDeleteRoadmap={handleDeleteRoadmap}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Pathfinder AI</span>
            <span aria-hidden="true">·</span>
            <span>Mülakat & Kariyer Koçu</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Kişiselleştirilmiş İşe Alım & Öğrenme Analitiği</span>
          </div>
        </div>
      </footer>

      {/* Quick Presets Modal */}
      {isPresetsOpen && (
        <PresetsModal
          language={language}
          onSelectInterviewPreset={handleSelectInterviewPreset}
          onSelectCareerPreset={handleSelectCareerPreset}
          onClose={() => setIsPresetsOpen(false)}
        />
      )}
    </div>
  );
}
