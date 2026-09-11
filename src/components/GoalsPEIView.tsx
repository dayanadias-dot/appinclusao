import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Target,
  Plus,
  CheckCircle,
  Clock,
  Award,
  Sparkles,
  BookOpen,
  Heart,
  MessageSquare,
  Activity,
  Footprints,
  Calendar,
  Trash2,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { LearningGoal, Student, GoalStep } from '../types';

interface GoalsPEIViewProps {
  goals: LearningGoal[];
  students: Student[];
  selectedStudentId?: string;
  onSaveGoal: (goal: LearningGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onSelectStudentFilter: (studentId: string) => void;
}

const CATEGORY_MAP = {
  academic: { label: 'Acadêmico', icon: BookOpen, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  socioemotional: { label: 'Socioemocional', icon: Heart, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  communication: { label: 'Comunicação', icon: MessageSquare, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  autonomy: { label: 'Autonomia & Rotina', icon: Footprints, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  sensory_motor: { label: 'Sensorial & Motor', icon: Activity, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
};

const STATUS_MAP = {
  not_started: { label: 'Não Iniciada', badge: 'bg-slate-100 text-slate-700 border-slate-300' },
  in_progress: { label: 'Em Desenvolvimento', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  achieved_with_support: { label: 'Alcançada com Apoio', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  mastered: { label: 'Consolidada / Generalizada', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
};

const SAMPLE_GOAL_TEMPLATES = [
  {
    title: 'Autorregulação com Apoio Visual em Transições',
    category: 'socioemotional' as const,
    description: 'Utilizar o cartão de apoio visual para transitar entre a sala de aula e o pátio sem sobrecarga sensorial.',
    steps: [
      'Visualizar o cronômetro 3 minutos antes do término da aula',
      'Colocar o abafador de ruído autonomamente',
      'Caminhar até o próximo espaço acompanhado pelo colega-tutor'
    ]
  },
  {
    title: 'Compreensão de Texto com Suporte Multimodal (DUA)',
    category: 'academic' as const,
    description: 'Identificar a ideia central de histórias curtas utilizando esquemas ilustrados e leitura compartilhada.',
    steps: [
      'Identificar personagens principais em imagens',
      'Organizar 3 cartões na sequência início-meio-fim',
      'Responder oralmente ou apontar a alternativa correta'
    ]
  },
  {
    title: 'Expressão Assertiva de Desconforto Sensorial',
    category: 'communication' as const,
    description: 'Sinalizar com gesto, fala ou prancha de CAA quando o ambiente estiver excessivamente barulhento ou incômodo.',
    steps: [
      'Reconhecer o sinal de desconforto no corpo',
      'Entregar o cartão vermelho de pausa ao professor',
      'Ir ao cantinho da descompressão por 5 minutos'
    ]
  }
];

export const GoalsPEIView: React.FC<GoalsPEIViewProps> = ({
  goals,
  students,
  selectedStudentId,
  onSaveGoal,
  onDeleteGoal,
  onSelectStudentFilter
}) => {
  const [filterStudentId, setFilterStudentId] = useState<string>(selectedStudentId || 'ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formStudentId, setFormStudentId] = useState<string>(
    selectedStudentId || (students[0]?.id || '')
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LearningGoal['category']>('academic');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('2026-11-30');
  const [steps, setSteps] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: '1', text: 'Etapa 1: Apresentação e familiarização com o apoio', completed: false },
    { id: '2', text: 'Etapa 2: Execução prática com mediação do professor', completed: false },
    { id: '3', text: 'Etapa 3: Execução autônoma na rotina regular', completed: false }
  ]);
  const [evidenceNotes, setEvidenceNotes] = useState('');

  const filteredGoals = goals.filter((g) => {
    const matchStudent = filterStudentId === 'ALL' || g.studentId === filterStudentId;
    const matchCat = filterCategory === 'ALL' || g.category === filterCategory;
    return matchStudent && matchCat;
  });

  const toggleStep = (goal: LearningGoal, stepId: string) => {
    const updatedSteps = goal.steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s));
    const completedCount = updatedSteps.filter((s) => s.completed).length;
    const progressPercentage = Math.round((completedCount / updatedSteps.length) * 100);

    let status = goal.status;
    if (progressPercentage === 100) {
      status = 'mastered';
      // Fire confetti celebrating student progress!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    } else if (progressPercentage > 0) {
      status = 'in_progress';
    } else {
      status = 'not_started';
    }

    onSaveGoal({
      ...goal,
      steps: updatedSteps,
      progressPercentage,
      status,
      updatedAt: new Date().toISOString()
    });
  };

  const handleApplyTemplate = (tmpl: typeof SAMPLE_GOAL_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setDescription(tmpl.description);
    setSteps(
      tmpl.steps.map((st, i) => ({
        id: `s-${i + 1}`,
        text: st,
        completed: false
      }))
    );
  };

  const handleAddStepField = () => {
    setSteps([...steps, { id: `s-${Date.now()}`, text: '', completed: false }]);
  };

  const handleUpdateStepText = (index: number, text: string) => {
    const newSteps = [...steps];
    newSteps[index].text = text;
    setSteps(newSteps);
  };

  const handleRemoveStepField = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSaveNewGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId || !title.trim()) {
      alert('Preencha o estudante e o título da meta.');
      return;
    }

    const validSteps = steps.filter((s) => s.text.trim().length > 0);
    const newGoal: LearningGoal = {
      id: `goal-${Date.now()}`,
      studentId: formStudentId,
      title: title.trim(),
      category,
      description: description.trim(),
      supportLevelRequired: 'moderate_guidance',
      status: 'not_started',
      steps: validSteps,
      targetDate,
      progressPercentage: 0,
      evidenceNotes: evidenceNotes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveGoal(newGoal);
    setIsModalOpen(false);

    // Reset
    setTitle('');
    setDescription('');
    setEvidenceNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-semibold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Plano Educacional Individualizado (PEI)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Metas de Aprendizagem Personalizadas</h2>
          <p className="text-sm text-slate-600 mt-1">
            Planejamento estruturado por análise de tarefas (micro-passos) com critérios de êxito e suporte equitativo.
          </p>
        </div>

        <button
          id="btn-open-new-goal"
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold shadow-md shadow-amber-500/25 transition active:scale-95"
        >
          <Plus className="w-5 h-5 text-slate-950" />
          <span>Criar Nova Meta (PEI)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Filtrar por Estudante
          </label>
          <select
            value={filterStudentId}
            onChange={(e) => {
              setFilterStudentId(e.target.value);
              onSelectStudentFilter(e.target.value);
            }}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
          >
            <option value="ALL">Todos os Estudantes ({goals.length} metas)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.grade})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Filtrar por Área de Habilidade
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
          >
            <option value="ALL">Todas as Áreas</option>
            {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Nenhuma meta encontrada</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Crie a primeira meta individualizada do PEI com objetivos concretos e passos fragmentados.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-600 transition"
          >
            Adicionar Meta PEI
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const student = students.find((s) => s.id === goal.studentId);
            const catInfo = CATEGORY_MAP[goal.category] || CATEGORY_MAP.academic;
            const statusInfo = STATUS_MAP[goal.status] || STATUS_MAP.in_progress;
            const CatIcon = catInfo.icon;

            return (
              <div
                key={goal.id}
                id={`goal-card-${goal.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-amber-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${catInfo.color}`}>
                        <CatIcon className="w-3.5 h-3.5" />
                        <span>{catInfo.label}</span>
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusInfo.badge}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Deseja excluir a meta "${goal.title}"?`)) {
                          onDeleteGoal(goal.id);
                        }
                      }}
                      className="cursor-pointer p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Excluir Meta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">{goal.title}</h3>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                    Estudante: {student?.name || 'Não identificado'}
                  </p>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{goal.description}</p>

                  {/* Progress bar */}
                  <div className="my-4">
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-600">Progresso dos Passos:</span>
                      <span className="text-amber-700">{goal.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Micro-steps Checklist */}
                  <div className="space-y-2 my-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Análise de Tarefa (Passo a Passo):
                    </span>
                    {goal.steps.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => toggleStep(goal, step.id)}
                        className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-white transition cursor-pointer group"
                      >
                        {step.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 group-hover:text-amber-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-xs ${
                            step.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-700 font-medium'
                          }`}
                        >
                          {step.text}
                        </span>
                      </button>
                    ))}
                  </div>

                  {goal.evidenceNotes && (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs text-slate-700">
                      <strong className="text-amber-900 block mb-0.5">Evidências de Aprendizagem:</strong>
                      {goal.evidenceNotes}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Meta para: {new Date(goal.targetDate + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                  </span>
                  {goal.status === 'mastered' && (
                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                      <Award className="w-4 h-4 text-emerald-600" />
                      Consolidada!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEW GOAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 p-6 flex items-center justify-between">
              <div>
                <div className="text-amber-950 text-xs font-extrabold uppercase tracking-wider">
                  Plano Educacional Individualizado
                </div>
                <h3 className="text-xl font-black text-slate-950 mt-1">Definir Nova Meta de Aprendizagem</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-2 rounded-full hover:bg-black/10 text-slate-950 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewGoal}>
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
                {/* Templates Quick Pick */}
                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Modelos Rápidos com Metodologia DUA:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_GOAL_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="cursor-pointer text-xs bg-white hover:bg-amber-100 text-amber-950 font-medium px-2.5 py-1.5 rounded-lg border border-amber-300 transition"
                      >
                        + {tmpl.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Estudante *
                    </label>
                    <select
                      value={formStudentId}
                      onChange={(e) => setFormStudentId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.grade})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Área da Habilidade
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800"
                    >
                      {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
                        <option key={key} value={key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Título da Meta *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Autorregulação com Timer Visual em Tarefas Individuais"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Descrição Detalhada do Objetivo
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Descreva o que o aluno fará, sob quais condições e qual nível de autonomia é esperado."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Steps decomposition */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Etapas da Meta (Análise de Tarefas / Micro-passos)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddStepField}
                      className="cursor-pointer text-xs font-bold text-amber-700 hover:text-amber-800"
                    >
                      + Adicionar Etapa
                    </button>
                  </div>

                  <div className="space-y-2">
                    {steps.map((step, idx) => (
                      <div key={step.id} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                        <input
                          type="text"
                          required
                          placeholder={`Passo ${idx + 1}`}
                          value={step.text}
                          onChange={(e) => handleUpdateStepText(idx, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                        />
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStepField(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Data Alvo para Reavaliação
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Critérios de Evidência / Notas Iniciais
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Registro em 4 de 5 dias na semana"
                      value={evidenceNotes}
                      onChange={(e) => setEvidenceNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  id="btn-submit-goal"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/25 transition active:scale-95 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Salvar Meta no PEI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
