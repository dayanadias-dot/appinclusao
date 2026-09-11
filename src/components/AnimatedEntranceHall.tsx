import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  HeartHandshake,
  Users,
  ClipboardList,
  Target,
  FileCheck2,
  Compass,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  BookOpen,
  CalendarDays,
  SmilePlus
} from 'lucide-react';
import { Student, DailyReport, LearningGoal, StudentScreening } from '../types';
import { INSPIRING_QUOTES } from '../data/expertKnowledge';

interface AnimatedEntranceHallProps {
  students: Student[];
  reports: DailyReport[];
  goals: LearningGoal[];
  screenings: StudentScreening[];
  onNavigate: (tab: string) => void;
  onNewReport: () => void;
  onNewStudent: () => void;
}

export const AnimatedEntranceHall: React.FC<AnimatedEntranceHallProps> = ({
  students,
  reports,
  goals,
  screenings,
  onNavigate,
  onNewReport,
  onNewStudent
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % INSPIRING_QUOTES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const activeGoalsCount = goals.filter(
    (g) => g.status === 'in_progress' || g.status === 'not_started'
  ).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayReportsCount = reports.filter((r) => r.date === todayStr).length;

  return (
    <div id="entrance-hall-container" className="space-y-8 pb-12">
      {/* Animated Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-8 md:p-12 shadow-xl border border-indigo-500/20"
      >
        {/* Background decorative animated glow elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-pink-500/20 via-amber-400/20 to-teal-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 via-emerald-400/20 to-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Espaço do Educador Inclusivo & Neuropsicopedagogo</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Acolher, compreender e <br />
              <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                potencializar cada mente
              </span>
            </h1>

            <p className="text-slate-200 text-base md:text-lg max-w-xl leading-relaxed">
              Bem-vindo ao <strong>Inclui+</strong>. Seu ambiente integrado para monitoramento do desenvolvimento acadêmico, regulação socioemocional, elaboração do PEI, adaptação curricular com DUA e observação pedagógica qualificada.
            </p>

            {/* Quick launch action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                id="hall-btn-open-workspace"
                onClick={() => onNavigate('students')}
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
              >
                <Users className="w-5 h-5 text-slate-950" />
                <span>Explorar Alunos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hall-btn-new-report"
                onClick={onNewReport}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/20 transition"
              >
                <ClipboardList className="w-5 h-5 text-cyan-300" />
                <span>Novo Relatório Diário</span>
              </button>

              <button
                id="hall-btn-new-adaptation"
                onClick={() => onNavigate('adapter')}
                className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/20 transition"
              >
                <FileCheck2 className="w-5 h-5 text-pink-300" />
                <span>Adaptar Atividade</span>
              </button>
            </div>
          </div>

          {/* Interactive Animated Neurodiversity Infinity Emblem */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center"
            >
              {/* Animated rainbow spectrum ring */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: '25s' }} />
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
              <div className="absolute inset-6 rounded-full border-2 border-pink-400/30" />

              {/* Central Glowing Infinity Canvas representation */}
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-500 p-1 shadow-2xl shadow-purple-500/50">
                <div className="w-full h-full rounded-full bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center">
                  {/* Neurodiversity Infinity Rainbow SVG */}
                  <svg className="w-20 h-20 text-white" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="25%" stopColor="#ec4899" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="75%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 30 10 C 15 10 5 20 5 30 C 5 40 15 50 30 50 C 42 50 50 35 50 30 C 50 25 58 10 70 10 C 85 10 95 20 95 30 C 95 40 85 50 70 50 C 58 50 50 35 50 30 C 50 25 42 10 30 10 Z"
                      stroke="url(#rainbowGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[11px] font-bold text-amber-300 mt-1 uppercase tracking-wider">
                    Neurodiversidade
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Rotating Inspirational Quote */}
            <div className="mt-4 text-center max-w-sm">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs text-slate-200"
              >
                <p className="italic text-slate-100">
                  "{INSPIRING_QUOTES[quoteIndex].quote}"
                </p>
                <p className="font-semibold text-amber-300 mt-1.5 text-[11px]">
                  — {INSPIRING_QUOTES[quoteIndex].author}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Real-time Status Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          id="stat-card-students"
          onClick={() => onNavigate('students')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alunos Mapeados</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">{students.length}</div>
          <div className="text-xs text-indigo-600 font-medium mt-1">Perfis com PEI & sensorial</div>
        </div>

        <div
          id="stat-card-reports"
          onClick={() => onNavigate('reports')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Relatórios Diários</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">{reports.length}</div>
          <div className="text-xs text-teal-600 font-medium mt-1">{todayReportsCount} hoje registrados</div>
        </div>

        <div
          id="stat-card-goals"
          onClick={() => onNavigate('goals')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Metas PEI Ativas</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">{activeGoalsCount}</div>
          <div className="text-xs text-amber-600 font-medium mt-1">Em desenvolvimento contínuo</div>
        </div>

        <div
          id="stat-card-screenings"
          onClick={() => onNavigate('screening')}
          className="cursor-pointer bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Observações / Rastreio</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">{screenings.length}</div>
          <div className="text-xs text-purple-600 font-medium mt-1">Triagens pedagógicas salvas</div>
        </div>
      </div>

      {/* Main Module Gateway Cards (Vibrant, accessible neurodiversity colors) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Módulos Pedagógicos Inclusivos</h2>
            <p className="text-sm text-slate-600">Selecione uma área para agir ou acompanhar os estudantes</p>
          </div>
          <button
            onClick={onNewStudent}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition"
          >
            <SmilePlus className="w-4 h-4" />
            <span>Cadastrar Aluno</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Diário de Bordo & Emoções */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate('reports')}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 p-6 border-2 border-emerald-200 hover:border-emerald-400 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-4">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Diário de Comportamento & Emoções</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Monitore a chegada e saída com o <strong>Termômetro das Zonas de Regulação</strong> (Verde, Amarelo, Azul, Vermelho), anote gatilhos sensoriais, acomodações aplicadas e evoluções diárias.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between text-emerald-800 font-semibold text-sm">
              <span>Acessar Diário</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 2: Metas do PEI */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate('goals')}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-orange-500/5 p-6 border-2 border-amber-200 hover:border-amber-400 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Plano Educacional Individualizado (PEI)</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Crie metas de aprendizagem personalizadas com <strong>critérios SMART</strong> divididas em micro-passos acessíveis: acadêmico, socioemocional, comunicação, motricidade e autonomia.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-100 flex items-center justify-between text-amber-800 font-semibold text-sm">
              <span>Gerenciar Metas</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 3: Adaptador de Atividades (DUA) */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate('adapter')}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-indigo-500/10 via-white to-purple-500/5 p-6 border-2 border-indigo-200 hover:border-indigo-400 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Adaptador de Atividades & DUA</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Transforme qualquer conteúdo comum em uma proposta acessível, baseando-se no <strong>nível de suporte (1, 2 ou 3)</strong>, perfil sensorial, modo de comunicação e hiperfocos de cada aluno.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-100 flex items-center justify-between text-indigo-800 font-semibold text-sm">
              <span>Gerar Adaptação</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 4: Rastreio & Observação */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate('screening')}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-purple-500/10 via-white to-pink-500/5 p-6 border-2 border-purple-200 hover:border-purple-400 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Rastreio Pedagógico & Sinais de Alerta</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Protocolo observacional não-diagnóstico para identificar traços de TEA, TDAH, Dislexia, TOD e Altas Habilidades, gerando relatório detalhado para encaminhamento multidisciplinar.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between text-purple-800 font-semibold text-sm">
              <span>Iniciar Protocolo</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 5: Guia de Manejos Pedagógicos, Psicológicos e Sociais */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate('guide')}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-cyan-500/10 via-white to-blue-500/5 p-6 border-2 border-cyan-200 hover:border-cyan-400 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 mb-4">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Guia de Manejos Práticos</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Biblioteca de intervenções com base em evidências: manejo de crises (meltdown vs birra), estruturação TEACCH, redução de conflitos (TOD), descompressão sensorial e mediação de pares.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-cyan-100 flex items-center justify-between text-cyan-800 font-semibold text-sm">
              <span>Consultar Manejos</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 6: Alunos & Perfis Sensoriais */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => onNavigate('students')}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-rose-500/10 via-white to-amber-500/5 p-6 border-2 border-rose-200 hover:border-rose-400 shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-500/20 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Perfis & Histórico dos Alunos</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Cadastro integral de cada estudante: mapeamento de hipersensibilidades (sons, luzes, texturas), interesses profundos (hiperfocos), gatilhos e plano de ação em crises.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between text-rose-800 font-semibold text-sm">
              <span>Ver Estudantes</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Inclusion & Legal Standards Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-100 via-indigo-50/50 to-slate-100 p-6 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white shadow-sm text-indigo-600 border border-slate-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Compromisso com a Educação Inclusiva & DUA</h4>
            <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Desenvolvido segundo as diretrizes da <strong>Lei Brasileira de Inclusão (Lei nº 13.146/15)</strong>, da <strong>Política Nacional de Proteção dos Direitos da Pessoa com TEA (Lei nº 12.764/12)</strong> e dos princípios do <strong>Desenho Universal para a Aprendizagem (DUA)</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="cursor-pointer whitespace-nowrap px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition shadow-sm"
        >
          Configurações & Acessibilidade
        </button>
      </div>
    </div>
  );
};
