import {
  Student,
  DailyReport,
  LearningGoal,
  ActivityAdaptationPlan,
  StudentScreening,
  UserSettings
} from '../types';

const DB_NAME = 'inclui_plus_pedagogy_db';
const DB_VERSION = 1;

const STORES = {
  STUDENTS: 'students',
  DAILY_REPORTS: 'daily_reports',
  GOALS: 'goals',
  ADAPTATIONS: 'adaptations',
  SCREENINGS: 'screenings',
  SETTINGS: 'settings'
};

// Default Initial Settings
export const DEFAULT_SETTINGS: UserSettings = {
  teacherName: 'Prof. Dayana Dias',
  schoolName: 'Escola Municipal de Ensino Inclusivo Esperança',
  teacherRole: 'Pedagoga e Especialista em AEE',
  dyslexiaFont: false,
  fontSize: 'normal',
  calmMode: false,
  highContrast: false,
  hasSampleData: true
};

// Initial Seed Students (Pedagogically Rich)
export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-arthur-01',
    name: 'Arthur Mendonça Vieira',
    birthDate: '2016-04-12',
    grade: '4º Ano B - Ensino Fundamental I',
    supportLevel: 'level_1',
    neurotypes: ['TEA', 'TPS'],
    diagnosisStatus: 'diagnosed',
    communicationType: 'verbal',
    specialInterests: ['Robótica', 'Astronomia', 'Trens de alta velocidade', 'Peças de encaixe'],
    strengths: ['Excelente memória visual e espacial', 'Atenção a detalhes meticulosos', 'Honestidade e senso de justiça'],
    sensoryProfile: {
      auditory: 'hypersensitive',
      visual: 'typical',
      tactile: 'hypersensitive',
      vestibularMotor: 'typical',
      notes: 'Desconforto intenso com sinal da escola, palmas em uníssono e atrito de giz. Usa abafador auricular em transições.'
    },
    triggers: [
      'Mudança imprevista na ordem das aulas',
      'Barulho alto e repentino no refeitório',
      'Exigência de redação aberta sem roteiro passo a passo'
    ],
    calmingStrategies: [
      'Uso de fone antirruído acolchoado',
      'Pausa de 5 minutos no "Cantinho da Leitura Espacial"',
      'Manipulação de cubo tátil sensorial',
      'Antecipação visual da próxima atividade em cartão de mesa'
    ],
    guardianContact: 'Mariana Mendonça (Mãe) - (83) 99876-1234',
    emergencyCarePlan: 'Em caso de sobrecarga/meltdown, conduzir com voz calma ao espaço com pouca luz, sem insistir em contato visual.',
    avatarColor: '#6366f1',
    createdAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-09-08T10:30:00.000Z'
  },
  {
    id: 'std-mariana-02',
    name: 'Mariana Lima dos Santos',
    birthDate: '2017-08-25',
    grade: '3º Ano A - Ensino Fundamental I',
    supportLevel: 'level_1',
    neurotypes: ['TDAH', 'Dislexia'],
    diagnosisStatus: 'under_evaluation',
    communicationType: 'verbal',
    specialInterests: ['Desenho e Ilustração', 'Animais marinhos', 'Contação oral de histórias'],
    strengths: ['Criatividade e imaginação efervescente', 'Empatia natural com colegas', 'Excelente oratória e expressividade teatral'],
    sensoryProfile: {
      auditory: 'typical',
      visual: 'typical',
      tactile: 'typical',
      vestibularMotor: 'seeker',
      notes: 'Necessidade contínua de movimento corporal enquanto processa informações cognitivas. Fica inquieta sentada por mais de 10 minutos.'
    },
    triggers: [
      'Leitura em voz alta solicitada de surpresa na frente da turma',
      'Listas longas de exercícios sem apoio visual ou ilustrações',
      'Instruções contendo mais de 3 comandos verbais simultâneos'
    ],
    calmingStrategies: [
      'Pausa motora ativa (ajudar a regar as plantas da sala ou apagar o quadro)',
      'Assento dinâmico com almofada inflável ou elástico de pé',
      'Permissão para desenhar esquemas mentais enquanto escuta explicações'
    ],
    guardianContact: 'Carlos Santos (Pai) - (83) 98765-4321',
    emergencyCarePlan: 'Quando frustrada com leitura, incentivar respiração com balão imaginário e permitir resposta verbal gravada.',
    avatarColor: '#ec4899',
    createdAt: '2026-02-15T09:00:00.000Z',
    updatedAt: '2026-09-09T14:15:00.000Z'
  },
  {
    id: 'std-enzo-03',
    name: 'Enzo Gabriel Ferreira',
    birthDate: '2015-11-03',
    grade: '5º Ano C - Ensino Fundamental I',
    supportLevel: 'level_2',
    neurotypes: ['TEA', 'TOD'],
    diagnosisStatus: 'diagnosed',
    communicationType: 'verbal',
    specialInterests: ['Dinossauros pré-históricos', 'Jogos de estratégia', 'Cálculos matemáticos rápidos'],
    strengths: ['Raciocínio lógico agudo', 'Capacidade de resolução rápida de problemas matemáticos', 'Liderança natural quando respeitado'],
    sensoryProfile: {
      auditory: 'hypersensitive',
      visual: 'hypersensitive',
      tactile: 'typical',
      vestibularMotor: 'typical',
      notes: 'Sensível a lâmpadas fluorescentes que piscam. Prefere mesa próxima à janela com luz natural.'
    },
    triggers: [
      'Ordens imperativas diretas e em tom ríspido',
      'Perda em jogos coletivos de competição',
      'Sentimento de injustiça ou de não ter sua voz escutada'
    ],
    calmingStrategies: [
      'Oferta de escolhas dirigidas ("Opção A ou B")',
      'Contrato de comportamento visual com pontos de conquista',
      'Pausa de descompressão com cronômetro visual de 3 minutos',
      'Validação de sua emoção antes de abordar a conduta'
    ],
    guardianContact: 'Cláudia Ferreira (Mãe) - (83) 99112-8877',
    emergencyCarePlan: 'Evitar confrontação verbal em público. Esperar desescalada da adrenalina antes de conversar sobre o ocorrido.',
    avatarColor: '#10b981',
    createdAt: '2026-03-01T08:30:00.000Z',
    updatedAt: '2026-09-10T11:00:00.000Z'
  }
];

export const INITIAL_DAILY_REPORTS: DailyReport[] = [
  {
    id: 'rep-arthur-01',
    studentId: 'std-arthur-01',
    date: '2026-09-10',
    period: 'morning',
    moodArrival: 'green',
    moodDeparture: 'green',
    academicEngagement: 5,
    triggersObserved: ['Alarme da troca de turno'],
    behaviorsObserved: ['Uso autônomo do fone de ouvido', 'Excelente concentração na aula de Ciências', 'Ajudou colega com a maquete'],
    pedagogicalManagementsUsed: ['Antecipação de rotina no quadro', 'Apoio com imagens do Sistema Solar'],
    sensorySupportsUsed: ['Fone abafador de ruído', 'Cantinho da calma no intervalo'],
    achievementsToday: 'Conseguiu concluir a tarefa de Ciências em dupla sem sinais de sobrecarga, explicando os anéis de Saturno com entusiasmo!',
    challengesEncountered: 'Leve desconforto com arrastar de cadeiras na volta do lanche.',
    familyFeedbackNotes: 'Arthur teve um excelente dia! Mostrou grande orgulho do desenho que produziu.',
    recordedBy: 'Prof. Dayana Dias',
    createdAt: '2026-09-10T12:30:00.000Z'
  },
  {
    id: 'rep-mariana-01',
    studentId: 'std-mariana-02',
    date: '2026-09-10',
    period: 'morning',
    moodArrival: 'yellow',
    moodDeparture: 'green',
    academicEngagement: 4,
    triggersObserved: ['Insegurança ao abrir o livro de Língua Portuguesa'],
    behaviorsObserved: ['Inquietação com as pernas', 'Desenhou peixes enquanto ouvia a história', 'Respondeu oralmente com riqueza de detalhes'],
    pedagogicalManagementsUsed: ['Leitura mediada compartilhada', 'Avaliação oral da compreensão de texto', 'Pausa motora de 3 minutos'],
    sensorySupportsUsed: ['Almofada de assento dinâmico'],
    achievementsToday: 'Com a adaptação do texto em fonte Lexend e imagens de apoio, compreendeu 100% da narrativa e participou do debate.',
    challengesEncountered: 'Fadiga ao tentar copiar enunciados longos do quadro para o caderno.',
    familyFeedbackNotes: 'Importante continuar incentivando a resposta oral em casa.',
    recordedBy: 'Prof. Dayana Dias',
    createdAt: '2026-09-10T12:45:00.000Z'
  }
];

export const INITIAL_GOALS: LearningGoal[] = [
  {
    id: 'goal-arthur-01',
    studentId: 'std-arthur-01',
    title: 'Autorregulação em Transições de Sala e Recreio',
    category: 'socioemotional',
    description: 'Desenvolver a autonomia de colocar o fone abafador ou sinalizar o cartão de apoio quando o ambiente estiver com ruído acima do seu limiar de conforto.',
    supportLevelRequired: 'minimal_prompt',
    status: 'in_progress',
    steps: [
      { id: 's1', text: 'Identificar no termômetro visual das emoções quando está na Zona Amarela', completed: true },
      { id: 's2', text: 'Pegar o fone de ouvido de forma autônoma na mochila antes do sino tocar', completed: true },
      { id: 's3', text: 'Permanecer 15 minutos no pátio com o grupo mantendo a regulação emocional', completed: false }
    ],
    targetDate: '2026-10-30',
    progressPercentage: 66,
    evidenceNotes: 'Arthur já pega o fone sozinho em 80% das vezes em que o sino se aproxima.',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-09-10T11:00:00.000Z'
  },
  {
    id: 'goal-mariana-01',
    studentId: 'std-mariana-02',
    title: 'Compreensão Leitora por meio de Recursos Multimodais (DUA)',
    category: 'academic',
    description: 'Aumentar a fluência e autonomia na decodificação de pequenos textos ilustrados utilizando cartões de palavras-chave e apoio em áudio.',
    supportLevelRequired: 'moderate_guidance',
    status: 'in_progress',
    steps: [
      { id: 'm1', text: 'Reconhecer 20 palavras de alta frequência sem hesitação', completed: true },
      { id: 'm2', text: 'Associar parágrafos curtos à imagem ilustrativa correspondente', completed: true },
      { id: 'm3', text: 'Ler uma história de 1 página com auxílio do leitor em áudio e recontar oralmente', completed: false }
    ],
    targetDate: '2026-11-15',
    progressPercentage: 66,
    evidenceNotes: 'Ótima evolução com uso de cores para destacar as sílabas complexas.',
    createdAt: '2026-08-05T09:00:00.000Z',
    updatedAt: '2026-09-08T15:00:00.000Z'
  },
  {
    id: 'goal-enzo-01',
    studentId: 'std-enzo-03',
    title: 'Manejo Colaborativo da Frustração em Tarefas Desafiadoras',
    category: 'socioemotional',
    description: 'Utilizar a pausa orientada ou escolher uma alternativa combinada ao se deparar com erros em avaliações escritas.',
    supportLevelRequired: 'moderate_guidance',
    status: 'in_progress',
    steps: [
      { id: 'e1', text: 'Sinalizar com o cartão verde/amarelo quando uma questão estiver muito difícil', completed: true },
      { id: 'e2', text: 'Fazer 3 respirações diafragmáticas antes de rasurar o papel', completed: false },
      { id: 'e3', text: 'Aceitar a sugestão de refazer a questão com apoio mediado', completed: false }
    ],
    targetDate: '2026-11-30',
    progressPercentage: 33,
    evidenceNotes: 'Enzo começou a usar o cartão visual de ajuda na aula de ontem.',
    createdAt: '2026-08-10T11:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z'
  }
];

class LocalDatabaseService {
  private memoryCache: {
    students: Student[];
    dailyReports: DailyReport[];
    goals: LearningGoal[];
    adaptations: ActivityAdaptationPlan[];
    screenings: StudentScreening[];
    settings: UserSettings;
  } | null = null;

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__inclui_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private initMemoryCache() {
    if (this.memoryCache) return;

    if (this.isLocalStorageAvailable()) {
      const studentsRaw = window.localStorage.getItem('inclui_students');
      const reportsRaw = window.localStorage.getItem('inclui_reports');
      const goalsRaw = window.localStorage.getItem('inclui_goals');
      const adaptationsRaw = window.localStorage.getItem('inclui_adaptations');
      const screeningsRaw = window.localStorage.getItem('inclui_screenings');
      const settingsRaw = window.localStorage.getItem('inclui_settings');

      this.memoryCache = {
        students: studentsRaw ? JSON.parse(studentsRaw) : INITIAL_STUDENTS,
        dailyReports: reportsRaw ? JSON.parse(reportsRaw) : INITIAL_DAILY_REPORTS,
        goals: goalsRaw ? JSON.parse(goalsRaw) : INITIAL_GOALS,
        adaptations: adaptationsRaw ? JSON.parse(adaptationsRaw) : [],
        screenings: screeningsRaw ? JSON.parse(screeningsRaw) : [],
        settings: settingsRaw ? JSON.parse(settingsRaw) : DEFAULT_SETTINGS
      };

      // Save initial seeds if first time
      if (!studentsRaw) {
        this.persistAll();
      }
    } else {
      this.memoryCache = {
        students: [...INITIAL_STUDENTS],
        dailyReports: [...INITIAL_DAILY_REPORTS],
        goals: [...INITIAL_GOALS],
        adaptations: [],
        screenings: [],
        settings: { ...DEFAULT_SETTINGS }
      };
    }
  }

  private persistAll() {
    if (!this.memoryCache || !this.isLocalStorageAvailable()) return;
    try {
      window.localStorage.setItem('inclui_students', JSON.stringify(this.memoryCache.students));
      window.localStorage.setItem('inclui_reports', JSON.stringify(this.memoryCache.dailyReports));
      window.localStorage.setItem('inclui_goals', JSON.stringify(this.memoryCache.goals));
      window.localStorage.setItem('inclui_adaptations', JSON.stringify(this.memoryCache.adaptations));
      window.localStorage.setItem('inclui_screenings', JSON.stringify(this.memoryCache.screenings));
      window.localStorage.setItem('inclui_settings', JSON.stringify(this.memoryCache.settings));
    } catch (e) {
      console.warn('Erro ao persistir dados localmente:', e);
    }
  }

  // STUDENTS
  async getStudents(): Promise<Student[]> {
    this.initMemoryCache();
    return [...(this.memoryCache?.students || [])];
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    this.initMemoryCache();
    return this.memoryCache?.students.find((s) => s.id === id);
  }

  async saveStudent(student: Student): Promise<Student> {
    this.initMemoryCache();
    if (!this.memoryCache) throw new Error('Database not ready');

    const index = this.memoryCache.students.findIndex((s) => s.id === student.id);
    const now = new Date().toISOString();
    const studentToSave = { ...student, updatedAt: now };

    if (index >= 0) {
      this.memoryCache.students[index] = studentToSave;
    } else {
      studentToSave.createdAt = now;
      this.memoryCache.students.unshift(studentToSave);
    }
    this.persistAll();
    return studentToSave;
  }

  async deleteStudent(id: string): Promise<void> {
    this.initMemoryCache();
    if (!this.memoryCache) return;
    this.memoryCache.students = this.memoryCache.students.filter((s) => s.id !== id);
    this.memoryCache.dailyReports = this.memoryCache.dailyReports.filter((r) => r.studentId !== id);
    this.memoryCache.goals = this.memoryCache.goals.filter((g) => g.studentId !== id);
    this.memoryCache.adaptations = this.memoryCache.adaptations.filter((a) => a.studentId !== id);
    this.persistAll();
  }

  // DAILY REPORTS
  async getDailyReports(studentId?: string): Promise<DailyReport[]> {
    this.initMemoryCache();
    const reports = this.memoryCache?.dailyReports || [];
    if (studentId) {
      return reports
        .filter((r) => r.studentId === studentId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async saveDailyReport(report: DailyReport): Promise<DailyReport> {
    this.initMemoryCache();
    if (!this.memoryCache) throw new Error('Database not ready');

    const index = this.memoryCache.dailyReports.findIndex((r) => r.id === report.id);
    if (index >= 0) {
      this.memoryCache.dailyReports[index] = report;
    } else {
      this.memoryCache.dailyReports.unshift(report);
    }
    this.persistAll();
    return report;
  }

  async deleteDailyReport(id: string): Promise<void> {
    this.initMemoryCache();
    if (!this.memoryCache) return;
    this.memoryCache.dailyReports = this.memoryCache.dailyReports.filter((r) => r.id !== id);
    this.persistAll();
  }

  // LEARNING GOALS
  async getGoals(studentId?: string): Promise<LearningGoal[]> {
    this.initMemoryCache();
    const goals = this.memoryCache?.goals || [];
    if (studentId) {
      return goals.filter((g) => g.studentId === studentId);
    }
    return [...goals];
  }

  async saveGoal(goal: LearningGoal): Promise<LearningGoal> {
    this.initMemoryCache();
    if (!this.memoryCache) throw new Error('Database not ready');

    const index = this.memoryCache.goals.findIndex((g) => g.id === goal.id);
    const now = new Date().toISOString();
    const goalToSave = { ...goal, updatedAt: now };

    if (index >= 0) {
      this.memoryCache.goals[index] = goalToSave;
    } else {
      goalToSave.createdAt = now;
      this.memoryCache.goals.unshift(goalToSave);
    }
    this.persistAll();
    return goalToSave;
  }

  async deleteGoal(id: string): Promise<void> {
    this.initMemoryCache();
    if (!this.memoryCache) return;
    this.memoryCache.goals = this.memoryCache.goals.filter((g) => g.id !== id);
    this.persistAll();
  }

  // ADAPTATION PLANS
  async getAdaptations(studentId?: string): Promise<ActivityAdaptationPlan[]> {
    this.initMemoryCache();
    const adaptations = this.memoryCache?.adaptations || [];
    if (studentId) {
      return adaptations.filter((a) => a.studentId === studentId);
    }
    return [...adaptations];
  }

  async saveAdaptation(plan: ActivityAdaptationPlan): Promise<ActivityAdaptationPlan> {
    this.initMemoryCache();
    if (!this.memoryCache) throw new Error('Database not ready');

    const index = this.memoryCache.adaptations.findIndex((a) => a.id === plan.id);
    if (index >= 0) {
      this.memoryCache.adaptations[index] = plan;
    } else {
      this.memoryCache.adaptations.unshift(plan);
    }
    this.persistAll();
    return plan;
  }

  async deleteAdaptation(id: string): Promise<void> {
    this.initMemoryCache();
    if (!this.memoryCache) return;
    this.memoryCache.adaptations = this.memoryCache.adaptations.filter((a) => a.id !== id);
    this.persistAll();
  }

  // SCREENINGS
  async getScreenings(): Promise<StudentScreening[]> {
    this.initMemoryCache();
    return [...(this.memoryCache?.screenings || [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async saveScreening(screening: StudentScreening): Promise<StudentScreening> {
    this.initMemoryCache();
    if (!this.memoryCache) throw new Error('Database not ready');

    const index = this.memoryCache.screenings.findIndex((s) => s.id === screening.id);
    if (index >= 0) {
      this.memoryCache.screenings[index] = screening;
    } else {
      this.memoryCache.screenings.unshift(screening);
    }
    this.persistAll();
    return screening;
  }

  async deleteScreening(id: string): Promise<void> {
    this.initMemoryCache();
    if (!this.memoryCache) return;
    this.memoryCache.screenings = this.memoryCache.screenings.filter((s) => s.id !== id);
    this.persistAll();
  }

  // SETTINGS
  async getSettings(): Promise<UserSettings> {
    this.initMemoryCache();
    return { ...(this.memoryCache?.settings || DEFAULT_SETTINGS) };
  }

  async saveSettings(settings: UserSettings): Promise<UserSettings> {
    this.initMemoryCache();
    if (!this.memoryCache) throw new Error('Database not ready');
    this.memoryCache.settings = { ...settings };
    this.persistAll();
    return this.memoryCache.settings;
  }

  // EXPORT & IMPORT FULL BACKUP
  exportBackup(): string {
    this.initMemoryCache();
    return JSON.stringify(
      {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        database: this.memoryCache
      },
      null,
      2
    );
  }

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.database || !Array.isArray(parsed.database.students)) {
        throw new Error('Formato de arquivo inválido');
      }
      this.memoryCache = {
        students: parsed.database.students || [],
        dailyReports: parsed.database.dailyReports || [],
        goals: parsed.database.goals || [],
        adaptations: parsed.database.adaptations || [],
        screenings: parsed.database.screenings || [],
        settings: parsed.database.settings || DEFAULT_SETTINGS
      };
      this.persistAll();
      return true;
    } catch (e) {
      console.error('Falha na importação de dados:', e);
      return false;
    }
  }

  resetToInitialData(): void {
    this.memoryCache = {
      students: [...INITIAL_STUDENTS],
      dailyReports: [...INITIAL_DAILY_REPORTS],
      goals: [...INITIAL_GOALS],
      adaptations: [],
      screenings: [],
      settings: { ...DEFAULT_SETTINGS }
    };
    this.persistAll();
  }
}

export const db = new LocalDatabaseService();
