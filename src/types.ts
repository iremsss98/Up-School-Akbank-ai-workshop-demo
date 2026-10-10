export type Language = 'tr' | 'en';

export type QuestionCategory = 'technical' | 'behavioral' | 'situational' | 'leadership_culture';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory | string;
  categoryLabel: string;
  question: string;
  rationale: string;
  evaluationCriteria: string;
  sampleAnswer: string;
  preparationTips: string;
}

export interface InterviewSessionData {
  id: string;
  interviewerTitle: string;
  targetRole: string;
  experienceLevel: string;
  companyContext?: string;
  interviewerPerspective: string;
  keyFocusAreas: string[];
  mindsetTips: string[];
  questions: InterviewQuestion[];
  createdAt: string;
}

export interface AnswerEvaluation {
  score: number;
  verdict: string;
  interviewerReaction: string;
  strengths: string[];
  improvements: string[];
  refinedIdealAnswer: string;
  followUpQuestion: string;
}

export interface CompletedCourse {
  id: string;
  title: string;
  provider: string;
  topicsCovered: string;
  completedYear?: string;
}

export interface VerifiedSkill {
  skill: string;
  category: string;
  masteryLevel: string;
  evidence: string;
}

export interface SkillGap {
  missingSkill: string;
  importance: string;
  whyItMatters: string;
}

export interface RecommendedCourse {
  priorityOrder: number;
  title: string;
  targetDomain: string;
  level: string;
  estimatedDuration: string;
  whyThisNext: string;
  essentialCurriculum: string[];
  capstoneProject: string;
  recommendedPlatforms: string[];
  searchKeywords: string[];
}

export interface MilestoneStep {
  phase: string;
  timeframe: string;
  objective: string;
}

export interface CareerRoadmapData {
  id: string;
  targetRole: string;
  currentRole?: string;
  currentLevelSummary: string;
  verifiedSkills: VerifiedSkill[];
  skillGaps: SkillGap[];
  recommendedNextCourses: RecommendedCourse[];
  milestoneTimeline: MilestoneStep[];
  completedCoursesSnapshot: CompletedCourse[];
  createdAt: string;
}
