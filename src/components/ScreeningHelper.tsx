import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Printer,
  Save,
  Brain,
  FileText,
  UserCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Student, StudentScreening, NeurotypeCategory } from '../types';
import { SCREENING_QUESTIONS, NEUROTYPE_INFO } from '../data/expertKnowledge';

interface ScreeningHelperProps {
  students: Student[];
  savedScreenings: StudentScreening[];
  onSaveScreening: (screening: StudentScreening) => void;
  onDeleteScreening: (id: string) => void;
}

export const ScreeningHelper: React.FC<ScreeningHelperProps> = ({
  students,
  savedScreenings,
  onSaveScreening,
  onDeleteScreening
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  // New screening form
  const [studentMode, setStudentMode] = useState<'existing' | 'new'>('existing');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [customStudentName, setCustomStudentName] = useState('');
  const [studentAge, setStudentAge] = useState<number>(8);
  const [grade, setGrade] = useState('3º Ano Fundamental I');
  const [observerName, setObserverName] = useState('Prof. Dayana Dias');
  const [role, setRole] = useState('Pedagoga Especialista em AEE');

  const [responses, setResponses] = useState<Record<string, number>>({});
  const [qualitativeNotes, setQualitativeNotes] = useState('');

  // Result view
  const [currentResult, setCurrentResult] = useState<StudentScreening | null>(null);

  const handleScoreChange = (questionId: string, score: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: score
    }));
  };

  const handleCalculateReport = (e: React.FormEvent) => {
    e.preventDefault();

    const name =
      studentMode === 'existing'
        ? students.find((s) => s.id === selectedStudentId)?.name || 'Aluno'
        : customStudentName.trim();

    if (!name) {
      alert('Por favor, informe o nome do estudante.');
      return;
    }

    // Score tally by neurotype indicator
    const tally: Record<NeurotypeCategory, { count: number; totalScore: number }> = {
      TEA: { count: 0, totalScore: 0 },
      TDAH: { count: 0, totalScore: 0 },
      Dislexia: { count: 0, totalScore: 0 },
      Discalculia: { count: 0, totalScore: 0 },
      Dispraxia: { count: 0, totalScore: 0 },
      AH_SD: { count: 0, totalScore: 0 },
      TOD: { count: 0, totalScore: 0 },
      TPS: { count: 0, totalScore: 0 },
      Deficiencia_Intelectual: { count: 0, totalScore: 0 },
      Outro: { count: 0, totalScore: 0 }
    };

    SCREENING_QUESTIONS.forEach((q) => {
      const score = responses[q.id] || 0;
      tally[q.neurotypeIndicator].count += 1;
      tally[q.neurotypeIndicator].totalScore += score;
    });

    // Detect primary indicators (where score is >= 50% of maximum possible)
    const primaryIndicators: NeurotypeCategory[] = [];
    const suggestedAccommodations: string[] = [];
    const suggestedReferrals: string[] = [];

    Object.entries(tally).forEach(([nt, data]) => {
      const maxPossible = data.count * 2;
      if (maxPossible > 0 && data.totalScore >= maxPossible * 0.5) {
        primaryIndicators.push(nt as NeurotypeCategory);
      }
    });

    if (primaryIndicators.includes('TEA') || primaryIndicators.includes('TPS')) {
      suggestedAccommodations.push('Estruturação de rotina visual com antecipação prévia (método TEACCH).');
      suggestedAccommodations.push('Permissão para uso de abafador de som em ambientes de alto ruído.');
      suggestedAccommodations.push('Criação do Cantinho da Calma para descompressão sensorial sem cobrança verbal imediata.');
      suggestedReferrals.push('Neuropediatra / Psiquiatra Infantil');
      suggestedReferrals.push('Terapeuta Ocupacional com certificação em Integração Sensorial de Ayres');
    }

    if (primaryIndicators.includes('TDAH')) {
      suggestedAccommodations.push('Fracionamento de tarefas extensas em blocos de 10 a 15 minutos (análise de tarefas).');
      suggestedAccommodations.push('Pausas motoras ativas estruturadas e autorização para assento dinâmico.');
      suggestedAccommodations.push('Assento próximo à lousa e distante de portas ou janelas.');
      suggestedReferrals.push('Neuropediatra');
      suggestedReferrals.push('Neuropsicólogo (para avaliação das Funções Executivas e Atenção)');
    }

    if (primaryIndicators.includes('Dislexia') || primaryIndicators.includes('Discalculia')) {
      suggestedAccommodations.push('Utilização de fontes amigáveis (Lexend), tamanho ampliado e textos contrastados.');
      suggestedAccommodations.push('Avaliações orais ou mediadas por áudio, sem penalização por ortografia em matérias conceituais.');
      suggestedAccommodations.push('Uso permitido de calculadora e material manipulável concreto (Material Dourado).');
      suggestedReferrals.push('Fonoaudiólogo especialista em Linguagem e Leitura');
      suggestedReferrals.push('Psicopedagogo / Neuropsicopedagogo');
    }

    if (primaryIndicators.includes('TOD')) {
      suggestedAccommodations.push('Oferta de escolhas dirigidas ("Opção A ou B") evitando ordens imperativas em público.');
      suggestedAccommodations.push('Contratos de convivência combinados previamente em momentos de calma.');
      suggestedReferrals.push('Psicólogo Infantil (Terapia Cognitivo-Comportamental ou Análise do Comportamento)');
    }

    if (suggestedAccommodations.length === 0) {
      suggestedAccommodations.push('Acompanhamento regular no AEE com registro contínuo no Diário de Bordo.');
    }

    const screening: StudentScreening = {
      id: `scr-${Date.now()}`,
      studentId: studentMode === 'existing' ? selectedStudentId : undefined,
      studentName: name,
      studentAge,
      grade,
      observationDate: new Date().toISOString().split('T')[0],
      observerName,
      role,
      responses,
      categoryScores: {},
      primaryIndicators,
      qualitativeNotes: qualitativeNotes.trim(),
      suggestedSchoolAccommodations: suggestedAccommodations,
      suggestedSpecialistReferrals: Array.from(new Set(suggestedReferrals)),
      createdAt: new Date().toISOString()
    };

    setCurrentResult(screening);
  };

  const handleSaveResult = () => {
    if (!currentResult) return;
    onSaveScreening(currentResult);
    alert('Relatório de observação pedagógica salvo com sucesso no banco de dados local!');
    setActiveTab('history');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Observação Pedagógica Qualificada</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Rastreio de Traços de Neurodivergência & NEE
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Protocolo escolar estruturado para identificar sinais observáveis e emitir relatório de encaminhamento multiprofissional.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('new')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'new'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Novo Rastreio
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`cursor-pointer px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Histórico ({savedScreenings.length})
          </button>
        </div>
      </div>

      {/* Ethical Pedagogical Disclaimer */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 flex items-start gap-3 no-print">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block text-amber-900 mb-0.5">Nota Ético-Pedagógica Fundamental:</strong>
          Este instrumento é um protocolo de observação escolar e rastreio educacional destinado a mapear barreiras pedagógicas e apoiar a elaboração do PEI. Ele <strong>NÃO</strong> constitui diagnóstico médico, psicológico ou laudo clínico, servindo como documento técnico para fundamentar o encaminhamento a profissionais de saúde.
        </div>
      </div>

      {activeTab === 'new' ? (
        <div className="space-y-6">
          {/* Screening Form */}
          <form onSubmit={handleCalculateReport} className="space-y-6 no-print">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <span>Identificação do Aluno e do Observador</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Origem do Estudante
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentMode('existing')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                        studentMode === 'existing'
                          ? 'bg-purple-50 border-purple-400 text-purple-800'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Aluno Cadastrado
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentMode('new')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                        studentMode === 'new'
                          ? 'bg-purple-50 border-purple-400 text-purple-800'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Aluno Novo
                    </button>
                  </div>
                </div>

                {studentMode === 'existing' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Selecionar Estudante
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.grade})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nome do Estudante *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Gabriel Alves"
                      value={customStudentName}
                      onChange={(e) => setCustomStudentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Idade (anos)
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={20}
                      value={studentAge}
                      onChange={(e) => setStudentAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Turma / Ano
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Checklist */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Questionário Observacional de Indicadores Comportamentais
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pontue cada item com base na observação sistemática na sala de aula, intervalo e tarefas:
                  <br />
                  <strong>0: Não observado / Raro</strong> •{' '}
                  <strong>1: Ocasional / Moderado</strong> •{' '}
                  <strong>2: Frequente / Muito Intenso</strong>
                </p>
              </div>

              <div className="space-y-3">
                {SCREENING_QUESTIONS.map((q, idx) => {
                  const currentScore = responses[q.id] || 0;
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-purple-700 w-6 mt-0.5">{idx + 1}.</span>
                        <p className="text-xs md:text-sm text-slate-800 font-medium leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 self-end md:self-auto flex-shrink-0">
                        {[0, 1, 2].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleScoreChange(q.id, val)}
                            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                              currentScore === val
                                ? val === 2
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                                  : val === 1
                                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                                  : 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {val === 0 ? '0 (Não)' : val === 1 ? '1 (Às vezes)' : '2 (Frequente)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Observações Qualitativas Adicionais do Pedagogo
                </label>
                <textarea
                  rows={3}
                  placeholder="Relate episódios específicos, reações em situações sociais, padrão de contato visual, brincadeira simbólica ou hiperfocos observados..."
                  value={qualitativeNotes}
                  onChange={(e) => setQualitativeNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2">
                <button
                  id="btn-calculate-screening"
                  type="submit"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-purple-500/25 transition active:scale-95 text-sm"
                >
                  <Compass className="w-5 h-5" />
                  <span>Processar Rastreio & Gerar Relatório</span>
                </button>
              </div>
            </div>
          </form>

          {/* Generated Screening Report Preview */}
          {currentResult && (
            <div
              id="screening-report-document"
              className="bg-white rounded-3xl border-2 border-purple-300 shadow-xl p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-purple-100 pb-5 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Relatório de Observação Pedagógica & Rastreio Escolar</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Estudante: {currentResult.studentName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Idade: <strong>{currentResult.studentAge} anos</strong> • Turma:{' '}
                    <strong>{currentResult.grade}</strong> • Data:{' '}
                    <strong>{new Date(currentResult.observationDate + 'T12:00:00Z').toLocaleDateString('pt-BR')}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="cursor-pointer px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Relatório</span>
                  </button>

                  <button
                    onClick={handleSaveResult}
                    className="cursor-pointer px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar no Banco Local</span>
                  </button>
                </div>
              </div>

              {/* Primary Indicators Badges */}
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Indicadores Observacionais Significativos Identificados:
                </span>
                {currentResult.primaryIndicators.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentResult.primaryIndicators.map((nt) => {
                      const ntInfo = NEUROTYPE_INFO[nt] || { label: nt, badgeColor: 'bg-slate-100 text-slate-800 border-slate-300' };
                      return (
                        <div
                          key={nt}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${ntInfo.badgeColor} flex items-center gap-1.5`}
                        >
                          <Brain className="w-4 h-4" />
                          <span>{ntInfo.label}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                    Nenhum indicador atingiu o limiar de alta frequência. Recomenda-se acompanhamento preventivo regular no AEE.
                  </div>
                )}
              </div>

              {/* Recommended School Accommodations */}
              <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-200">
                <h4 className="font-bold text-purple-950 text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-700" />
                  <span>Acomodações Pedagógicas Imediatas Recomendadas para a Escola</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-purple-900">
                  {currentResult.suggestedSchoolAccommodations.map((acc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Multidisciplinary Referrals */}
              {currentResult.suggestedSpecialistReferrals.length > 0 && (
                <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-200">
                  <h4 className="font-bold text-indigo-950 text-sm mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-indigo-700" />
                    <span>Sugestão de Encaminhamento Clínico Multiprofissional</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 mb-2">
                    Sugere-se à família levar este relatório aos seguintes especialistas para avaliação diagnóstica compreensiva:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentResult.suggestedSpecialistReferrals.map((ref, idx) => (
                      <span
                        key={idx}
                        className="bg-white text-indigo-900 border border-indigo-200 px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs"
                      >
                        👨‍⚕️ {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualitative Notes */}
              {currentResult.qualitativeNotes && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <strong className="text-slate-800 block mb-1">Parecer Descritivo do Educador:</strong>
                  <p className="text-slate-700 leading-relaxed">{currentResult.qualitativeNotes}</p>
                </div>
              )}

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                <div>
                  Responsável pelo registro: <strong>{currentResult.observerName}</strong> ({currentResult.role})
                </div>
                <div>Inclui+ • Plataforma de Pedagogia Inclusiva</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* HISTORY TAB */
        <div className="space-y-4">
          {savedScreenings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
              <Compass className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h4 className="font-bold text-slate-800 text-base">Nenhum rastreio salvo no histórico</h4>
              <p className="text-xs text-slate-500 mt-1">Preencha um novo questionário para arquivar relatórios de observação.</p>
              <button
                onClick={() => setActiveTab('new')}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Criar Rastreio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedScreenings.map((sc) => (
                <div
                  key={sc.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-purple-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{sc.studentName}</h4>
                      <p className="text-xs text-slate-500">
                        {sc.grade} • {sc.studentAge} anos • Data:{' '}
                        {new Date(sc.observationDate + 'T12:00:00Z').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Deseja excluir o relatório de ${sc.studentName}?`)) {
                          onDeleteScreening(sc.id);
                        }
                      }}
                      className="cursor-pointer text-slate-400 hover:text-rose-600 p-1 text-xs"
                    >
                      Excluir
                    </button>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Indicadores Observados:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sc.primaryIndicators.map((nt) => (
                        <span
                          key={nt}
                          className="text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md"
                        >
                          {NEUROTYPE_INFO[nt]?.label || nt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentResult(sc);
                      setActiveTab('new');
                    }}
                    className="cursor-pointer w-full text-center py-2 bg-slate-50 hover:bg-purple-50 text-purple-700 font-bold text-xs rounded-xl border border-slate-200 hover:border-purple-300 transition"
                  >
                    Ver Relatório Completo & Imprimir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
