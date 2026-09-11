export type SupportLevel = 'level_1' | 'level_2' | 'level_3' | 'monitoring';

export type NeurotypeCategory =
  | 'TEA' // Transtorno do Espectro Autista
  | 'TDAH' // Transtorno do Déficit de Atenção e Hiperatividade
  | 'Dislexia' // Dificuldade Específica de Leitura/Escrita
  | 'Discalculia' // Dificuldade na Matemática
  | 'Dispraxia' // Transtorno do Desenvolvimento da Coordenação
  | 'AH_SD' // Altas Habilidades / Superdotação
  | 'TOD' // Transtorno Opositivo Desafiador
  | 'TPS' // Transtorno do Processamento Sensorial
  | 'Deficiencia_Intelectual'
  | 'Outro';

export type EmotionZone = 'green' | 'yellow' | 'blue' | 'red';

export interface SensoryProfile {
  auditory: 'hypersensitive' | 'hyposensitive' | 'typical';
  visual: 'hypersensitive' | 'hyposensitive' | 'typical';
  tactile: 'hypersensitive' | 'hyposensitive' | 'typical';
  vestibularMotor: 'seeker' | 'avoider' | 'typical';
  notes: string;
}

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  grade: string;
  supportLevel: SupportLevel;
  neurotypes: NeurotypeCategory[];
  diagnosisStatus: 'diagnosed' | 'under_evaluation' | 'pedagogical_observation';
  communicationType: 'verbal' | 'caa_alternative' | 'gestural_mixed' | 'in_development';
  specialInterests: string[]; // Hiperfocos (ex: robótica, animais, trens, dinossauros, astronomia)
  strengths: string[]; // Pontos fortes (ex: memória visual, criatividade, empatia, foco)
  sensoryProfile: SensoryProfile;
  triggers: string[]; // Gatilhos emocionais/sensoriais conhecidos
  calmingStrategies: string[]; // Estratégias que comprovadamente acalmam o aluno
  guardianContact: string;
  emergencyCarePlan: string;
  avatarColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyReport {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  period: 'morning' | 'afternoon' | 'full_day';
  moodArrival: EmotionZone;
  moodDeparture: EmotionZone;
  academicEngagement: number; // 1 to 5
  triggersObserved: string[];
  behaviorsObserved: string[];
  pedagogicalManagementsUsed: string[];
  sensorySupportsUsed: string[];
  achievementsToday: string;
  challengesEncountered: string;
  familyFeedbackNotes: string;
  recordedBy: string;
  createdAt: string;
}

export interface GoalStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface LearningGoal {
  id: string;
  studentId: string;
  title: string;
  category: 'academic' | 'socioemotional' | 'communication' | 'autonomy' | 'sensory_motor';
  description: string;
  supportLevelRequired: 'independent' | 'minimal_prompt' | 'moderate_guidance' | 'full_assistance';
  status: 'not_started' | 'in_progress' | 'achieved_with_support' | 'mastered';
  steps: GoalStep[];
  targetDate: string;
  progressPercentage: number;
  evidenceNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityAdaptationPlan {
  id: string;
  studentId: string;
  activityTitle: string;
  subject: string;
  originalObjective: string;
  supportLevel: SupportLevel;
  duaRepresentation: string[]; // Múltiplas formas de Apresentação
  duaActionExpression: string[]; // Múltiplas formas de Resposta e Ação
  duaEngagement: string[]; // Conexões de interesse e hiperfoco
  sensoryAccommodations: string[]; // Fones, iluminação, descanso
  timeAndPacing: string; // Ex: 50% mais tempo, pausas a cada 15 min
  adaptedEvaluationCriteria: string; // Como pontuar com equidade
  createdAt: string;
}

export interface GuideStrategy {
  id: string;
  title: string;
  category: 'pedagogical' | 'psychological' | 'social' | 'sensory';
  targetNeurotypes: NeurotypeCategory[];
  supportLevels: SupportLevel[];
  problemScenario: string;
  whatToDo: string[];
  whatToAvoid: string[];
  classroomExample: string;
  tags: string[];
}

export interface ScreeningItem {
  id: string;
  category: 'social_interaction' | 'communication' | 'sensory_processing' | 'attention_executive' | 'academic_learning' | 'motor_regulation';
  question: string;
  neurotypeIndicator: NeurotypeCategory;
  score: 0 | 1 | 2; // 0 = Nunca/Raro, 1 = Às vezes/Moderado, 2 = Frequente/Intenso
}

export interface StudentScreening {
  id: string;
  studentId?: string;
  studentName: string;
  studentAge: number;
  grade: string;
  observationDate: string;
  observerName: string;
  role: string;
  responses: Record<string, number>; // itemId -> score
  categoryScores: Record<string, { total: number; max: number }>;
  primaryIndicators: NeurotypeCategory[];
  qualitativeNotes: string;
  suggestedSchoolAccommodations: string[];
  suggestedSpecialistReferrals: string[]; // ex: Neuropediatra, Neuropsicólogo, Fonoaudiólogo, Terapeuta Ocupacional
  createdAt: string;
}

export interface UserSettings {
  teacherName: string;
  schoolName: string;
  teacherRole: string;
  dyslexiaFont: boolean;
  fontSize: 'normal' | 'large' | 'huge';
  calmMode: boolean; // Desativa animações intensas e reduz saturação
  highContrast: boolean;
  hasSampleData: boolean;
}
