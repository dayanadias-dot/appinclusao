import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  ClipboardList,
  Target,
  FileCheck2,
  Compass,
  Lightbulb,
  Settings,
  HeartHandshake,
  Database,
  Plus,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { Student, DailyReport, LearningGoal, StudentScreening, ActivityAdaptationPlan, UserSettings } from './types';
import { db } from './services/db';

// Subcomponents
import { AnimatedEntranceHall } from './components/AnimatedEntranceHall';
import { StudentList } from './components/StudentList';
import { StudentFormModal } from './components/StudentFormModal';
import { DailyReportsView } from './components/DailyReportsView';
import { GoalsPEIView } from './components/GoalsPEIView';
import { ActivityAdapter } from './components/ActivityAdapter';
import { ScreeningHelper } from './components/ScreeningHelper';
import { PedagogicalGuideView } from './components/PedagogicalGuideView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('entrance');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Database Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [screenings, setScreenings] = useState<StudentScreening[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    teacherName: 'Prof. Dayana Dias',
    teacherRole: 'Pedagoga Especialista em AEE',
    schoolName: 'Escola Municipal Viva a Diversidade',
    dyslexiaFont: false,
    highContrast: false,
    calmMode: false,
    fontSize: 'normal',
    themeColor: 'emerald'
  });

  // Modal & Selection States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [targetStudentId, setTargetStudentId] = useState<string | undefined>(undefined);

  // Load from local database
  const loadAllData = async () => {
    try {
      const [sList, rList, gList, scList, currentSettings] = await Promise.all([
        db.getStudents(),
        db.getDailyReports(),
        db.getGoals(),
        db.getScreenings(),
        db.getSettings()
      ]);
      setStudents(sList);
      setReports(rList);
      setGoals(gList);
      setScreenings(scList);
      setSettings(currentSettings);
    } catch (e) {
      console.error('Erro ao carregar banco local:', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // CRUD Handlers for Students
  const handleSaveStudent = async (student: Student) => {
    await db.saveStudent(student);
    const updated = await db.getStudents();
    setStudents(updated);
    setIsStudentModalOpen(false);
    setStudentToEdit(null);
  };

  const handleDeleteStudent = async (studentId: string) => {
    await db.deleteStudent(studentId);
    await loadAllData();
  };

  const handleOpenNewStudentModal = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudentModal = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  // Handlers for Reports
  const handleSaveReport = async (report: DailyReport) => {
    await db.saveDailyReport(report);
    const updated = await db.getDailyReports();
    setReports(updated);
  };

  const handleDeleteReport = async (reportId: string) => {
    await db.deleteDailyReport(reportId);
    const updated = await db.getDailyReports();
    setReports(updated);
  };

  // Handlers for Goals
  const handleSaveGoal = async (goal: LearningGoal) => {
    await db.saveGoal(goal);
    const updated = await db.getGoals();
    setGoals(updated);
  };

  const handleDeleteGoal = async (goalId: string) => {
    await db.deleteGoal(goalId);
    const updated = await db.getGoals();
    setGoals(updated);
  };

  // Handlers for Adaptations
  const handleSaveAdaptation = async (plan: ActivityAdaptationPlan) => {
    await db.saveAdaptation(plan);
  };

  // Handlers for Screenings
  const handleSaveScreening = async (screening: StudentScreening) => {
    await db.saveScreening(screening);
    const updated = await db.getScreenings();
    setScreenings(updated);
  };

  const handleDeleteScreening = async (id: string) => {
    await db.deleteScreening(id);
    const updated = await db.getScreenings();
    setScreenings(updated);
  };

  // Handlers for Settings
  const handleUpdateSettings = async (newSettings: UserSettings) => {
    await db.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Contextual Navigation Helpers
  const handleNavigateToReportsForStudent = (studentId: string) => {
    setTargetStudentId(studentId);
    setActiveTab('reports');
  };

  const handleNavigateToGoalsForStudent = (studentId: string) => {
    setTargetStudentId(studentId);
    setActiveTab('goals');
  };

  const handleNavigateToAdapterForStudent = (studentId: string) => {
    setTargetStudentId(studentId);
    setActiveTab('adapter');
  };

  const navItems = [
    { id: 'entrance', label: 'Hall de Entrada', icon: Sparkles, color: 'text-amber-500' },
    { id: 'students', label: 'Estudantes & Perfis', icon: Users, color: 'text-indigo-500' },
    { id: 'reports', label: 'Diário de Bordo', icon: ClipboardList, color: 'text-emerald-500' },
    { id: 'goals', label: 'Metas (PEI)', icon: Target, color: 'text-orange-500' },
    { id: 'adapter', label: 'Adaptador DUA', icon: FileCheck2, color: 'text-sky-500' },
    { id: 'screening', label: 'Rastreio NEE', icon: Compass, color: 'text-purple-500' },
    { id: 'guide', label: 'Guia de Manejos', icon: Lightbulb, color: 'text-cyan-500' },
    { id: 'settings', label: 'Configurações', icon: Settings, color: 'text-slate-500' }
  ];

  // Dynamic accessibility classes
  const accessibilityClasses = [
    settings.dyslexiaFont ? 'font-dyslexic' : '',
    settings.highContrast ? 'high-contrast' : '',
    settings.fontSize === 'large' ? 'text-lg' : settings.fontSize === 'huge' ? 'text-xl' : ''
  ].join(' ');

  return (
    <div className={`min-h-screen bg-slate-100/70 text-slate-900 flex flex-col ${accessibilityClasses}`}>
      {/* Top Banner & Inclusion Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
        {/* Colorful Neurodiversity Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 to-indigo-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div
              onClick={() => setActiveTab('entrance')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition">
                <span className="text-2xl font-black">🎈</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                    AcolheMente
                  </span>
                  <span className="text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                    🌈 Inclusão com Afeto
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  Cantinho da Pedagogia Inclusiva, PEI, DUA e Manejo
                </p>
              </div>
            </div>

            {/* Offline Status & Quick Action */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Base Local Offline Ativa</span>
              </div>

              <button
                id="header-btn-new-student"
                onClick={handleOpenNewStudentModal}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-500/20 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Aluno</span>
              </button>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  handleOpenNewStudentModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Estudante</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'entrance' && (
          <AnimatedEntranceHall
            students={students}
            reports={reports}
            goals={goals}
            screenings={screenings}
            onNavigate={(tab) => setActiveTab(tab)}
            onNewReport={() => setActiveTab('reports')}
            onNewStudent={handleOpenNewStudentModal}
          />
        )}

        {activeTab === 'students' && (
          <StudentList
            students={students}
            onSelectStudent={(student) => handleNavigateToReportsForStudent(student.id)}
            onEditStudent={handleOpenEditStudentModal}
            onDeleteStudent={handleDeleteStudent}
            onNewStudent={handleOpenNewStudentModal}
            onNavigateToReports={handleNavigateToReportsForStudent}
            onNavigateToGoals={handleNavigateToGoalsForStudent}
            onNavigateToAdapter={handleNavigateToAdapterForStudent}
          />
        )}

        {activeTab === 'reports' && (
          <DailyReportsView
            reports={reports}
            students={students}
            selectedStudentId={targetStudentId}
            onSaveReport={handleSaveReport}
            onDeleteReport={handleDeleteReport}
            onSelectStudentFilter={(studentId) => setTargetStudentId(studentId === 'ALL' ? undefined : studentId)}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsPEIView
            goals={goals}
            students={students}
            selectedStudentId={targetStudentId}
            onSaveGoal={handleSaveGoal}
            onDeleteGoal={handleDeleteGoal}
            onSelectStudentFilter={(studentId) => setTargetStudentId(studentId === 'ALL' ? undefined : studentId)}
          />
        )}

        {activeTab === 'adapter' && (
          <ActivityAdapter
            students={students}
            selectedStudentId={targetStudentId}
            onSaveAdaptation={handleSaveAdaptation}
          />
        )}

        {activeTab === 'screening' && (
          <ScreeningHelper
            students={students}
            savedScreenings={screenings}
            onSaveScreening={handleSaveScreening}
            onDeleteScreening={handleDeleteScreening}
          />
        )}

        {activeTab === 'guide' && <PedagogicalGuideView students={students} />}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onReloadDatabase={loadAllData}
          />
        )}
      </main>

      {/* Student Form Modal */}
      {isStudentModalOpen && (
        <StudentFormModal
          studentToEdit={studentToEdit}
          onSave={handleSaveStudent}
          onClose={() => {
            setIsStudentModalOpen(false);
            setStudentToEdit(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Inclui+</span>
            <span>• Plataforma Pedagógica Especializada em Neurodiversidade e Inclusão Escolar</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Desenho Universal para a Aprendizagem (DUA)</span>
            <span>•</span>
            <span>Suporte Offline Seguro</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
