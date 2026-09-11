import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  BookOpen,
  Brain,
  Printer,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Wand2,
  AlertCircle
} from 'lucide-react';
import { Student, SupportLevel, ActivityAdaptationPlan } from '../types';
import { SUPPORT_LEVEL_INFO, NEUROTYPE_INFO } from '../data/expertKnowledge';

interface ActivityAdapterProps {
  students: Student[];
  selectedStudentId?: string;
  onSaveAdaptation: (plan: ActivityAdaptationPlan) => void;
}

export const ActivityAdapter: React.FC<ActivityAdapterProps> = ({
  students,
  selectedStudentId,
  onSaveAdaptation
}) => {
  const [studentId, setStudentId] = useState<string>(
    selectedStudentId || (students[0]?.id || '')
  );

  const [activityTitle, setActivityTitle] = useState('Interpretação e Produção de Texto');
  const [subject, setSubject] = useState('Língua Portuguesa');
  const [originalObjective, setOriginalObjective] = useState(
    'Ler uma crônica de 2 páginas, identificar a moral da história e produzir uma redação dissertativa de 15 linhas.'
  );

  const [supportLevelOverride, setSupportLevelOverride] = useState<SupportLevel>('level_1');
  const [useAI, setUseAI] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Generated Plan
  const [currentPlan, setCurrentPlan] = useState<ActivityAdaptationPlan | null>(null);

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];

  const handleGenerateOfflineAdaptation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedStudent) return;

    const level = supportLevelOverride || selectedStudent.supportLevel;
    const hyperfoco = selectedStudent.specialInterests[0] || 'seus temas de interesse';
    const isTea = selectedStudent.neurotypes.includes('TEA');
    const isTdah = selectedStudent.neurotypes.includes('TDAH');
    const isDislexia = selectedStudent.neurotypes.includes('Dislexia');
    const isAhSd = selectedStudent.neurotypes.includes('AH_SD');

    // DUA Representation adaptations
    const representation: string[] = [
      'Apresentação multimodal: combinar texto com imagens ilustrativas e esquemas visuais conceituais.',
      'Fracionamento do conteúdo: dividir a leitura em 3 blocos curtos com pausas intermediárias.',
      'Destaque tipográfico: utilizar fonte sem serifa (Lexend), tamanho 14-16pt, com negrito nas palavras-chave.'
    ];

    if (isDislexia) {
      representation.push('Disponibilizar leitor de tela / áudio do texto para que a decodificação mecânica não impeça a compreensão.');
      representation.push('Evitar exigir leitura em voz alta diante da classe.');
    }
    if (isTea) {
      representation.push('Roteiro visual prévio: explicar antes o início, o meio e o que se espera na conclusão da tarefa.');
      representation.push('Eliminar ambiguidades e expressões metafóricas com explicações concretas e literais.');
    }
    if (isTdah) {
      representation.push('Instruções apresentadas um comando de cada vez (análise de tarefa) com checklist de verificação.');
    }

    // DUA Action & Expression adaptations
    const actionExpression: string[] = [
      'Flexibilização do formato de resposta: permitir entrega por meio de mapa mental ilustrado, áudio gravado ou prova oral.',
      'Opção de resposta em tópicos essenciais em vez de redação em bloco contínuo.'
    ];

    if (level === 'level_2' || level === 'level_3') {
      actionExpression.push('Uso de prancha de comunicação alternativa (CAA) ou seleção de cartões com opções ilustradas.');
      actionExpression.push('Apoio de escriba / mediador pedagógico para registrar o raciocínio oral expressado pelo aluno.');
    }
    if (isDislexia) {
      actionExpression.push('Não penalizar pontuação de ortografia em avaliações de conteúdo conceitual.');
    }

    // DUA Engagement hooks
    const engagement: string[] = [
      `Contextualização com o hiperfoco: adaptar a temática do texto trazendo analogias e personagens relacionados a "${hyperfoco}".`,
      'Gamificação leve: sistema de micro-conquistas a cada parágrafo concluído com reforço positivo descritivo.',
      'Possibilidade de trabalho cooperativo com colega-tutor com divisão clara de funções.'
    ];

    if (isAhSd) {
      engagement.push('Desafio de enriquecimento curricular: propor que o aluno elabore uma continuação crítica ou questão reflexiva avançada.');
    }

    // Sensory & Time
    const sensory: string[] = [
      'Permitir o uso de fones antirruído durante toda a etapa de leitura individual.',
      'Posicionar a carteira longe de janelas com trânsito de pessoas ou portas para reduzir sobrecarga de estímulos.',
      'Disponibilizar objeto tátil de autorregulação (fidget toy/massinha) enquanto escuta.'
    ];

    let pacing = 'Tempo ampliado em 50% em relação aos demais alunos, com pausa ativa de 3 minutos a cada 15 minutos de atividade.';
    if (level === 'level_2' || level === 'level_3') {
      pacing = 'Tempo flexível com divisão em duas sessões distintas no turno e suporte passo a passo do mediador.';
    }

    const evaluation =
      'Avaliar a apreensão dos conceitos essenciais e a capacidade de interpretação, desconsiderando a velocidade de execução física ou rigor caligráfico.';

    const plan: ActivityAdaptationPlan = {
      id: `adapt-${Date.now()}`,
      studentId: selectedStudent.id,
      activityTitle: activityTitle.trim(),
      subject: subject.trim(),
      originalObjective: originalObjective.trim(),
      supportLevel: level,
      duaRepresentation: representation,
      duaActionExpression: actionExpression,
      duaEngagement: engagement,
      sensoryAccommodations: sensory,
      timeAndPacing: pacing,
      adaptedEvaluationCriteria: evaluation,
      createdAt: new Date().toISOString()
    };

    setCurrentPlan(plan);
  };

  const handleGenerateWithAI = async () => {
    if (!selectedStudent) return;
    setIsLoadingAI(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai/pedagogy-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Gere uma proposta de adaptação pedagógica DUA para a atividade "${activityTitle}" na matéria "${subject}".
Objetivo original: "${originalObjective}".
Respeite o nível de suporte do aluno, seu perfil sensorial e conecte com seus hiperfocos.`,
          studentProfile: {
            nome: selectedStudent.name,
            ano: selectedStudent.grade,
            neurotipos: selectedStudent.neurotypes,
            nivelSuporte: supportLevelOverride || selectedStudent.supportLevel,
            hiperfocos: selectedStudent.specialInterests,
            perfilSensorial: selectedStudent.sensoryProfile,
            comunicacao: selectedStudent.communicationType,
            gatilhos: selectedStudent.triggers
          },
          activityContext: `Atividade escolar: ${activityTitle} (${subject})`
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Não foi possível conectar ao assistente de IA. Gerando com base offline.');
      }

      // If AI returns text, generate the structure and append AI suggestions to representation/engagement
      handleGenerateOfflineAdaptation();
      // Also format the AI text into engagement
      if (data.text) {
        setCurrentPlan((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            duaEngagement: [
              ...prev.duaEngagement,
              `💡 Proposta Adicional do Assistente Pedagógico: ${data.text.slice(0, 300)}...`
            ]
          };
        });
      }
    } catch (err: any) {
      setAiError(err.message);
      // Fallback to offline immediately
      handleGenerateOfflineAdaptation();
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSave = () => {
    if (!currentPlan) return;
    onSaveAdaptation(currentPlan);
    alert('Adaptação pedagógica salva com sucesso no banco de dados local!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            <span>Desenho Universal para a Aprendizagem (DUA)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Adaptador de Atividades Pedagógicas</h2>
          <p className="text-sm text-slate-600 mt-1">
            Flexibilização curricular sob medida com base no neurotipo, nível de suporte e perfil sensorial do estudante.
          </p>
        </div>

        {currentPlan && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ficha DUA</span>
            </button>

            <button
              onClick={handleSave}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/25 transition active:scale-95 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Plano</span>
            </button>
          </div>
        )}
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm no-print space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>Configuração da Atividade a ser Adaptada</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Aluno Destinatário
            </label>
            <select
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                const s = students.find((item) => item.id === e.target.value);
                if (s) setSupportLevelOverride(s.supportLevel);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
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
              Componente Curricular / Matéria
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Matemática, História, Ciências"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nível de Suporte para a Atividade
            </label>
            <select
              value={supportLevelOverride}
              onChange={(e) => setSupportLevelOverride(e.target.value as SupportLevel)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(SUPPORT_LEVEL_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nome da Atividade Regular
            </label>
            <input
              type="text"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              placeholder="Ex: Leitura da Crônica e Redação Individual"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Objetivo e Formato Original da Turma
            </label>
            <input
              type="text"
              value={originalObjective}
              onChange={(e) => setOriginalObjective(e.target.value)}
              placeholder="Ex: Ler texto de 2 páginas e responder 5 perguntas dissertativas em 40 minutos"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Student Context Pill */}
        {selectedStudent && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Perfil Carregado:</span>
              <span className="font-semibold text-indigo-700">{selectedStudent.name}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">
                Neurotipo: {selectedStudent.neurotypes.map((n) => NEUROTYPE_INFO[n]?.label || n).join(', ')}
              </span>
            </div>

            {selectedStudent.specialInterests.length > 0 && (
              <div className="flex items-center gap-1.5 text-amber-800">
                <span className="font-semibold">Hiperfoco para Conexão DUA:</span>
                <span className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                  {selectedStudent.specialInterests.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {aiError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            id="btn-generate-offline-adaptation"
            type="button"
            onClick={() => handleGenerateOfflineAdaptation()}
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-500/25 transition active:scale-95 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerar Adaptação com Catálogo DUA (Offline)</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateWithAI}
            disabled={isLoadingAI}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-xs transition"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isLoadingAI ? 'Consultando IA Pedagógica...' : 'Enriquecer com IA Pedagógica (Online)'}</span>
          </button>
        </div>
      </div>

      {/* RESULTING ADAPTATION PLAN (Printable & Interactive) */}
      {currentPlan && (
        <div
          id="adaptation-plan-sheet"
          className="bg-white rounded-3xl border-2 border-indigo-200 shadow-lg p-8 space-y-6"
        >
          {/* Sheet Header */}
          <div className="border-b border-indigo-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200 mb-2">
                <Brain className="w-3.5 h-3.5" />
                <span>Plano de Adaptação Curricular Individualizada</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">{currentPlan.activityTitle}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Disciplina: <strong>{currentPlan.subject}</strong> • Estudante:{' '}
                <strong>{selectedStudent?.name}</strong> ({selectedStudent?.grade})
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Nível de Suporte DUA
              </span>
              <span className="text-sm font-extrabold text-indigo-900">
                {SUPPORT_LEVEL_INFO[currentPlan.supportLevel].label}
              </span>
            </div>
          </div>

          {/* Original vs Adapted Summary Banner */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Objetivo e Demanda Original da Sala:
              </span>
              <p className="text-slate-700 italic">"{currentPlan.originalObjective}"</p>
            </div>
            <div>
              <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Critério de Avaliação Equitativo:
              </span>
              <p className="text-slate-900 font-medium">{currentPlan.adaptedEvaluationCriteria}</p>
            </div>
          </div>

          {/* 3 Pillars of Universal Design for Learning (DUA) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1: Representation */}
            <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white font-bold text-xs">DUA 1</div>
                  <h4 className="font-bold text-blue-950 text-sm">Múltiplas Formas de Representação</h4>
                </div>
                <p className="text-[11px] text-blue-800 mb-3">Como o conteúdo será entregue ao estudante:</p>
                <ul className="space-y-2 text-xs text-slate-800">
                  {currentPlan.duaRepresentation.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pillar 2: Action & Expression */}
            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">DUA 2</div>
                  <h4 className="font-bold text-emerald-950 text-sm">Ação & Expressão Flexibilizada</h4>
                </div>
                <p className="text-[11px] text-emerald-800 mb-3">Como o aluno demonstra o aprendizado:</p>
                <ul className="space-y-2 text-xs text-slate-800">
                  {currentPlan.duaActionExpression.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pillar 3: Engagement */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-amber-600 text-white font-bold text-xs">DUA 3</div>
                  <h4 className="font-bold text-amber-950 text-sm">Engajamento & Hiperfoco</h4>
                </div>
                <p className="text-[11px] text-amber-800 mb-3">Conexões motivacionais e afetivas:</p>
                <ul className="space-y-2 text-xs text-slate-800">
                  {currentPlan.duaEngagement.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sensory Accommodations & Time Structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Gestão do Tempo e Ritmo (Pacing)</span>
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed">{currentPlan.timeAndPacing}</p>
            </div>

            <div>
              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Acomodações Sensoriais de Ambiente</span>
              </h5>
              <ul className="space-y-1 text-xs text-slate-700">
                {currentPlan.sensoryAccommodations.map((acc, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Teacher Signature & Print Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              Documento elaborado no <strong>Inclui+</strong> pelo profissional de Educação Inclusiva.
            </span>
            <span>Data: {new Date(currentPlan.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
