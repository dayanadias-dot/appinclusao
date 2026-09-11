import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Calendar,
  Smile,
  AlertTriangle,
  Frown,
  Flame,
  Star,
  Printer,
  Trash2,
  Filter,
  UserCheck,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { DailyReport, Student, EmotionZone } from '../types';

interface DailyReportsViewProps {
  reports: DailyReport[];
  students: Student[];
  selectedStudentId?: string;
  onSaveReport: (report: DailyReport) => void;
  onDeleteReport: (id: string) => void;
  onSelectStudentFilter: (studentId: string) => void;
}

const EMOTION_ZONES: Record<EmotionZone, { label: string; color: string; bg: string; icon: any; border: string }> = {
  green: {
    label: 'Zona Verde (Calmo / Focado / Regulado)',
    color: 'text-emerald-700',
    bg: 'bg-emerald-500',
    icon: Smile,
    border: 'border-emerald-300'
  },
  yellow: {
    label: 'Zona Amarela (Inquieto / Ansioso / Agitado)',
    color: 'text-amber-700',
    bg: 'bg-amber-500',
    icon: AlertTriangle,
    border: 'border-amber-300'
  },
  blue: {
    label: 'Zona Azul (Cansado / Triste / Desmotivado)',
    color: 'text-sky-700',
    bg: 'bg-sky-500',
    icon: Frown,
    border: 'border-sky-300'
  },
  red: {
    label: 'Zona Vermelha (Sobrecarga / Meltdown / Crise)',
    color: 'text-rose-700',
    bg: 'bg-rose-500',
    icon: Flame,
    border: 'border-rose-300'
  }
};

const COMMON_TRIGGERS = [
  'Barulho repentino / sirene',
  'Transição de atividade sem aviso',
  'Frustração com erro ou escrita',
  'Ambiente lotado / refeitório',
  'Fadiga cognitiva / fome',
  'Conflito social com colega'
];

const COMMON_MANAGEMENTS = [
  'Uso de fone antirruído',
  'Cantinho da calma / descompressão',
  'Pausa motora funcional (andar/beber água)',
  'Antecipação visual em cartão',
  'Flexibilização do tempo da tarefa',
  'Apoio individualizado com mediador',
  'Reforço positivo descritivo'
];

export const DailyReportsView: React.FC<DailyReportsViewProps> = ({
  reports,
  students,
  selectedStudentId,
  onSaveReport,
  onDeleteReport,
  onSelectStudentFilter
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStudentId, setFilterStudentId] = useState<string>(selectedStudentId || 'ALL');

  // Form states
  const [formStudentId, setFormStudentId] = useState<string>(
    selectedStudentId || (students[0]?.id || '')
  );
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState<'morning' | 'afternoon' | 'full_day'>('morning');
  const [moodArrival, setMoodArrival] = useState<EmotionZone>('green');
  const [moodDeparture, setMoodDeparture] = useState<EmotionZone>('green');
  const [academicEngagement, setAcademicEngagement] = useState<number>(4);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedManagements, setSelectedManagements] = useState<string[]>([]);
  const [achievementsToday, setAchievementsToday] = useState('');
  const [challengesEncountered, setChallengesEncountered] = useState('');
  const [familyFeedbackNotes, setFamilyFeedbackNotes] = useState('');
  const [recordedBy, setRecordedBy] = useState('Prof. Dayana Dias');

  const filteredReports = reports.filter((r) => {
    if (filterStudentId === 'ALL') return true;
    return r.studentId === filterStudentId;
  });

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter((t) => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const toggleManagement = (mgmt: string) => {
    if (selectedManagements.includes(mgmt)) {
      setSelectedManagements(selectedManagements.filter((m) => m !== mgmt));
    } else {
      setSelectedManagements([...selectedManagements, mgmt]);
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId) {
      alert('Selecione um aluno para o registro.');
      return;
    }

    const newReport: DailyReport = {
      id: `rep-${Date.now()}`,
      studentId: formStudentId,
      date,
      period,
      moodArrival,
      moodDeparture,
      academicEngagement,
      triggersObserved: selectedTriggers,
      behaviorsObserved: [],
      pedagogicalManagementsUsed: selectedManagements,
      sensorySupportsUsed: [],
      achievementsToday: achievementsToday.trim(),
      challengesEncountered: challengesEncountered.trim(),
      familyFeedbackNotes: familyFeedbackNotes.trim(),
      recordedBy: recordedBy.trim(),
      createdAt: new Date().toISOString()
    };

    onSaveReport(newReport);
    setIsModalOpen(false);
    // Reset form
    setAchievementsToday('');
    setChallengesEncountered('');
    setFamilyFeedbackNotes('');
    setSelectedTriggers([]);
    setSelectedManagements([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider">
            <ClipboardList className="w-4 h-4" />
            <span>Acompanhamento Diário & Comportamento</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Diário de Bordo Inclusivo</h2>
          <p className="text-sm text-slate-600 mt-1">
            Registro das zonas de regulação emocional, fatores desencadeantes e respostas pedagógicas aplicadas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Fichas</span>
          </button>

          <button
            id="btn-open-new-report"
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-md shadow-emerald-500/25 transition active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Registro Diário</span>
          </button>
        </div>
      </div>

      {/* Filter by Student */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filtrar por Estudante:</span>
        </div>
        <div className="w-full md:w-72">
          <select
            value={filterStudentId}
            onChange={(e) => {
              setFilterStudentId(e.target.value);
              onSelectStudentFilter(e.target.value);
            }}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
          >
            <option value="ALL">Todos os Estudantes ({reports.length} relatórios)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Nenhum relatório encontrado</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Gere o primeiro registro diário de comportamento e regulação emocional para começar o histórico do aluno.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
          >
            Criar Registro Agora
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const student = students.find((s) => s.id === report.studentId);
            const arrivalZone = EMOTION_ZONES[report.moodArrival];
            const departureZone = EMOTION_ZONES[report.moodDeparture];

            return (
              <div
                key={report.id}
                id={`report-item-${report.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-emerald-300 transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs"
                      style={{ backgroundColor: student?.avatarColor || '#10b981' }}
                    >
                      {student?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{student?.name || 'Estudante'}</h3>
                      <p className="text-xs text-slate-500">
                        {new Date(report.date + 'T12:00:00Z').toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}{' '}
                        • Turno: {report.period === 'morning' ? 'Manhã' : report.period === 'afternoon' ? 'Tarde' : 'Integral'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Academic engagement stars */}
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      <span className="text-xs font-bold text-amber-900 mr-1">Engajamento:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= report.academicEngagement ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Deseja excluir este relatório diário?')) {
                          onDeleteReport(report.id);
                        }
                      }}
                      className="cursor-pointer p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition no-print"
                      title="Excluir Relatório"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Emotional Regulation Flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${arrivalZone.bg}`} />
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 block">Chegada:</span>
                      <span className={`text-xs font-semibold ${arrivalZone.color}`}>{arrivalZone.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${departureZone.bg}`} />
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 block">Saída:</span>
                      <span className={`text-xs font-semibold ${departureZone.color}`}>{departureZone.label}</span>
                    </div>
                  </div>
                </div>

                {/* Triggers & Managements Pills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 text-xs">
                  {report.triggersObserved.length > 0 && (
                    <div>
                      <span className="font-bold text-rose-800 uppercase tracking-wider block mb-1.5">
                        Gatilhos Identificados:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {report.triggersObserved.map((trig, idx) => (
                          <span
                            key={idx}
                            className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-md"
                          >
                            ⚠️ {trig}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.pedagogicalManagementsUsed.length > 0 && (
                    <div>
                      <span className="font-bold text-emerald-800 uppercase tracking-wider block mb-1.5">
                        Manejos & Acomodações Aplicadas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {report.pedagogicalManagementsUsed.map((mgmt, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md"
                          >
                            ✓ {mgmt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes & Achievements */}
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  {report.achievementsToday && (
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
                      <strong className="text-indigo-900 block mb-0.5">🌟 Conquista / Progresso Acadêmico do Dia:</strong>
                      <p className="text-slate-700">{report.achievementsToday}</p>
                    </div>
                  )}

                  {report.challengesEncountered && (
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs">
                      <strong className="text-amber-900 block mb-0.5">🔍 Desafio Observado:</strong>
                      <p className="text-slate-700">{report.challengesEncountered}</p>
                    </div>
                  )}

                  {report.familyFeedbackNotes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <strong className="text-slate-800 block mb-0.5">💬 Devolutiva para Família / AEE:</strong>
                      <p className="text-slate-600">{report.familyFeedbackNotes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Registrado por: <strong>{report.recordedBy}</strong></span>
                  <span>ID: {report.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEW REPORT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex items-center justify-between">
              <div>
                <div className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                  Diário Pedagógico & Emocional
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Registrar Comportamento e Desenvolvimento</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-2 rounded-full hover:bg-white/20 text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport}>
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      Data
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Turno
                    </label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    >
                      <option value="morning">Manhã</option>
                      <option value="afternoon">Tarde</option>
                      <option value="full_day">Integral</option>
                    </select>
                  </div>
                </div>

                {/* Termômetro das Zonas de Regulação (Chegada e Saída) */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Estado Emocional na Chegada (Zonas de Regulação):
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(EMOTION_ZONES).map(([key, zone]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setMoodArrival(key as EmotionZone)}
                          className={`cursor-pointer p-2.5 rounded-xl border-2 text-xs font-bold text-left transition flex items-center gap-2 ${
                            moodArrival === key
                              ? `${zone.border} bg-white shadow-xs ${zone.color}`
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${zone.bg} flex-shrink-0`} />
                          <span className="truncate">{zone.label.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Estado Emocional na Saída:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(EMOTION_ZONES).map(([key, zone]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setMoodDeparture(key as EmotionZone)}
                          className={`cursor-pointer p-2.5 rounded-xl border-2 text-xs font-bold text-left transition flex items-center gap-2 ${
                            moodDeparture === key
                              ? `${zone.border} bg-white shadow-xs ${zone.color}`
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${zone.bg} flex-shrink-0`} />
                          <span className="truncate">{zone.label.split(' ')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Academic engagement */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nível de Engajamento Acadêmico (1 a 5 estrelas):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAcademicEngagement(num)}
                        className={`cursor-pointer p-2 rounded-xl border transition flex items-center gap-1 ${
                          academicEngagement === num
                            ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${academicEngagement >= num ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                        <span className="text-xs">{num}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Triggers observed */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Gatilhos Sensoriais / Emocionais Observados:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TRIGGERS.map((trig) => (
                      <button
                        key={trig}
                        type="button"
                        onClick={() => toggleTrigger(trig)}
                        className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          selectedTriggers.includes(trig)
                            ? 'bg-rose-100 text-rose-800 border-rose-300 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {selectedTriggers.includes(trig) ? '✓ ' : '+ '}
                        {trig}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pedagogical managements used */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Manejos Pedagógicos e Acomodações Utilizadas:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_MANAGEMENTS.map((mgmt) => (
                      <button
                        key={mgmt}
                        type="button"
                        onClick={() => toggleManagement(mgmt)}
                        className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          selectedManagements.includes(mgmt)
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {selectedManagements.includes(mgmt) ? '✓ ' : '+ '}
                        {mgmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Achievements & Notes */}
                <div>
                  <label className="block text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
                    Conquistas & Pontos Fortes do Dia
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Concluiu a atividade de história usando o mapa mental e manteve a regulação no intervalo."
                    value={achievementsToday}
                    onChange={(e) => setAchievementsToday(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Desafios ou Situações de Atenção
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Demonstrou cansaço na última aula após o recreio; precisou de pausa sensorial."
                    value={challengesEncountered}
                    onChange={(e) => setChallengesEncountered(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Orientações para Família / AEE
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Reforçar em casa a respiração profunda antes das lições."
                    value={familyFeedbackNotes}
                    onChange={(e) => setFamilyFeedbackNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
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
                  id="btn-submit-daily-report"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-500/25 transition active:scale-95 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Registro Diário</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
