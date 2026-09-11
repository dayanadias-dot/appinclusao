import React, { useState } from 'react';
import {
  Lightbulb,
  Search,
  BookOpen,
  Heart,
  Users,
  Ear,
  CheckCircle2,
  XCircle,
  Sparkles,
  Tag,
  Zap,
  Printer,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Brain,
  Wand2,
  AlertTriangle,
  Smile,
  Save
} from 'lucide-react';
import { PEDAGOGICAL_GUIDE, NEUROTYPE_INFO, SUPPORT_LEVEL_INFO } from '../data/expertKnowledge';
import { GuideStrategy, Student, IndividualizedBehaviorConsultation, NeurotypeCategory } from '../types';

interface PedagogicalGuideViewProps {
  students?: Student[];
}

const FREQUENT_BEHAVIORS = [
  'Tapou os ouvidos, jogou os cadernos e se recusou a permanecer na sala',
  'Crise de choro e recusa imediata ao receber a folha de prova de matemática',
  'Comportamento de fuga: saiu correndo para o pátio durante a transição de aula',
  'Ficou excessivamente agressivo/irritado quando outro colega tocou em seu estojo',
  'Agitação motora intensa: não consegue parar sentado e interrompe constantemente',
  'Crise de birra / meltdown com a sirene do recreio e o barulho do corredor',
  'Recusa passiva: deitou a cabeça na mesa e não responde a nenhum comando',
  'Frustração extrema e desregulação ao perder uma brincadeira ou jogo em grupo'
];

export const PedagogicalGuideView: React.FC<PedagogicalGuideViewProps> = ({ students = [] }) => {
  const [activeSubTab, setActiveSubTab] = useState<'individual' | 'catalog'>('individual');

  // Search & Filters for General Catalog
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedNeurotype, setSelectedNeurotype] = useState<string>('ALL');

  // Individualized Behavior Generator State
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'custom');
  const [customStudentName, setCustomStudentName] = useState('');
  const [customNeurotypes, setCustomNeurotypes] = useState<NeurotypeCategory[]>(['TEA']);
  const [specificBehavior, setSpecificBehavior] = useState(
    'Tapou os ouvidos, jogou os cadernos e se recusou a permanecer na sala'
  );
  const [context, setContext] = useState('Em sala de aula durante transição ou atividade com ruído');
  const [intensity, setIntensity] = useState<'mild' | 'moderate' | 'severe'>('moderate');

  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Resulting Individualized Plan
  const [currentConsultation, setCurrentConsultation] =
    useState<IndividualizedBehaviorConsultation | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Filter for the catalog tab
  const filteredStrategies = PEDAGOGICAL_GUIDE.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.problemScenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.classroomExample.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesNeurotype =
      selectedNeurotype === 'ALL' || (item.targetNeurotypes as string[]).includes(selectedNeurotype);

    return matchesSearch && matchesCategory && matchesNeurotype;
  });

  const getCategoryBadge = (cat: GuideStrategy['category']) => {
    switch (cat) {
      case 'pedagogical':
        return { label: 'Manejo Pedagógico', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', icon: BookOpen };
      case 'psychological':
        return { label: 'Manejo Psicológico / Emocional', color: 'text-rose-700 bg-rose-50 border-rose-200', icon: Heart };
      case 'social':
        return { label: 'Manejo Social & Inclusão', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: Users };
      case 'sensory':
        return { label: 'Manejo Sensorial', color: 'text-purple-700 bg-purple-50 border-purple-200', icon: Ear };
    }
  };

  // Generate Individualized Behavior Plan (Offline algorithm)
  const handleGenerateIndividualizedPlan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const studentName = selectedStudent ? selectedStudent.name : customStudentName || 'Estudante em Acolhimento';
    const neurotypes = selectedStudent ? selectedStudent.neurotypes : customNeurotypes;
    const supportLevel = selectedStudent ? selectedStudent.supportLevel : 'level_1';
    const knownCalming = selectedStudent?.calmingStrategies || [];
    const knownTriggers = selectedStudent?.triggers || [];

    const isTea = neurotypes.includes('TEA');
    const isTdah = neurotypes.includes('TDAH');
    const isTod = neurotypes.includes('TOD');
    const isDislexia = neurotypes.includes('Dislexia');
    const isSensory = neurotypes.includes('TPS') || isTea;

    // Phase 1: Immediate De-escalation (First 3 minutes)
    const immediateSteps: string[] = [
      'Garantir segurança física e abaixar-se ao nível dos olhos da criança sem encurralá-la ou tocar sem permissão.',
      'Reduzir imediatamente a carga sensorial ao redor (diminuir luminosidade, afastar o fluxo de alunos, falar em tom baixo e calmo).',
      'Suspender qualquer cobrança verbal imediata ("Por que você fez isso?"). Substituir por acolhimento: "Eu vejo que está difícil para você agora, você está seguro aqui comigo".'
    ];

    if (isSensory) {
      immediateSteps.unshift(
        'Oferecer imediatamente o fone antirruído ou conduzir calmamente para o Cantinho do Acolhimento/Descompressão.'
      );
    }
    if (knownCalming.length > 0) {
      immediateSteps.push(`Recurso individualizado de autorregulação: ${knownCalming[0]}`);
    }

    // Phase 2: Pedagogical accommodation
    const pedagogical: string[] = [
      'Remover a barreira da tarefa que deflagrou o estresse (fracionar o exercício em apenas 1 comando simples por vez).',
      'Permitir resposta oral, em desenho ou por meio de mediador, sem insistência em escrita mecânica durante a desregulação.',
      'Flexibilizar o prazo de entrega sem penalizar a nota ou expor a dificuldade do aluno.'
    ];

    if (isDislexia) {
      pedagogical.push('Ler o enunciado para a criança ou substituir a folha densa por cartões visuais ilustrados com letra ampliada.');
    }
    if (isTdah) {
      pedagogical.push('Permitir pausa motora funcional de 3 minutos (beber água, caminhar até o filtro) para liberação de dopamina.');
    }

    // Phase 3: Psychoemotional handling
    const psychoemotional: string[] = [
      'Validar a emoção sem julgar o comportamento: "Sentir raiva ou frustração é normal, mas jogar o material machuca. Vamos respirar juntos."',
      'Utilizar a técnica do balão imaginário ou contagem regressiva sensorial de 5 dedos para desacelerar os batimentos cardíacos.',
      'Após a recuperação, utilizar o Termômetro das Emoções (Zonas de Regulação) para que o próprio aluno aponte em qual cor se encontra.'
    ];

    if (isTod) {
      psychoemotional.push(
        'Dar escolhas dirigidas ("Prefere fazer na sua mesa ou no cantinho da calma?") para evitar embates de poder em público.'
      );
    }

    // Phase 4: Social peer mediation
    const social: string[] = [
      'Proteger a dignidade do estudante: orientar gentilmente os colegas a continuarem sua atividade regular.',
      'Explicar à turma de forma afetuosa: "Nosso colega precisou de uma pausa para o cérebro descansar, logo ele volta a participar conosco."',
      'Evitar que os colegas façam comentários capacitistas ou risadinhas, fortalecendo a cultura do acolhimento mútuo.'
    ];

    // What NEVER to do
    const whatNever: string[] = [
      'NUNCA gritar, usar sarcasmo ou fazer ameaças ("se não fizer vai para a diretoria").',
      'NUNCA forçar contato físico ou puxar a criança durante um meltdown sensorial (pode intensificar a crise).',
      'NUNCA retirar o recreio ou a aula de artes/educação física como forma de castigo (são momentos vitais de regulação).',
      'NUNCA fazer sermão enquanto a criança estiver em pico de adrenalina (o cérebro racional está desligado).'
    ];

    // Preventive routine adjustment
    const preventive: string[] = [
      'Inserir no PEI um cartão visual de antecipação 5 minutos antes de qualquer transição ou prova.',
      'Mapear a atividade no Diário de Bordo para verificar se o gatilho se repete em horários específicos de fadiga cognitiva.'
    ];

    const plan: IndividualizedBehaviorConsultation = {
      id: `ibc-${Date.now()}`,
      studentId: selectedStudent?.id,
      studentName,
      neurotypes,
      supportLevel,
      specificBehavior: specificBehavior.trim(),
      context: context.trim(),
      intensity,
      immediateDeescalationSteps: immediateSteps,
      pedagogicalAccommodation: pedagogical,
      psychoemotionalHandling: psychoemotional,
      socialPeerMediation: social,
      whatNeverToDo: whatNever,
      preventiveRoutineAdjustments: preventive,
      createdAt: new Date().toISOString()
    };

    setCurrentConsultation(plan);
  };

  const handleConsultAI = async () => {
    setIsLoadingAI(true);
    setAiError(null);

    try {
      const studentName = selectedStudent ? selectedStudent.name : customStudentName || 'Estudante';
      const neurotypes = selectedStudent ? selectedStudent.neurotypes : customNeurotypes;

      const response = await fetch('/api/ai/pedagogy-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Gere uma estratégia de manejo pedagógico, psicológico e social individualizada para a seguinte situação comportamental:
Comportamento observado: "${specificBehavior}".
Contexto escolar: "${context}".
Intensidade: ${intensity}.
O aluno possui neurotipos: ${neurotypes.join(', ')}.
Forneça passos imediatos de desescalada, acomodações na tarefa e como mediar com a turma com respeito e acolhimento neuroafirmativo.`,
          studentProfile: selectedStudent
            ? {
                nome: selectedStudent.name,
                neurotipos: selectedStudent.neurotypes,
                nivelSuporte: selectedStudent.supportLevel,
                gatilhos: selectedStudent.triggers,
                calmantes: selectedStudent.calmingStrategies
              }
            : {
                nome: studentName,
                neurotipos: neurotypes
              },
          activityContext: context
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Não foi possível consultar a IA. Gerando com base heurística.');
      }

      handleGenerateIndividualizedPlan();

      if (data.text) {
        setCurrentConsultation((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            immediateDeescalationSteps: [
              ...prev.immediateDeescalationSteps,
              `💡 Intervenção Sugerida pelo Assistente: ${data.text.slice(0, 280)}...`
            ]
          };
        });
      }
    } catch (err: any) {
      setAiError(err.message);
      handleGenerateIndividualizedPlan();
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-amber-50 via-pink-50 to-purple-50 p-6 rounded-3xl border-2 border-amber-200/80 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xs uppercase tracking-wider">
            <span className="text-base">🎈</span>
            <span>Manejos Pedagógicos, Psicológicos & Sociais</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>Guia & Consultor de Manejo Individualizado</span>
            <span className="text-xl">💛</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Registre o comportamento específico do seu aluno para receber um plano passo a passo de acolhimento, desescalada e adaptação.
          </p>
        </div>

        {/* Sub-tabs switch */}
        <div className="flex p-1 rounded-2xl bg-white border border-slate-200 shadow-xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('individual')}
            className={`cursor-pointer px-4 py-2 text-xs font-black rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'individual'
                ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Manejo Individualizado</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('catalog')}
            className={`cursor-pointer px-4 py-2 text-xs font-black rounded-xl transition flex items-center gap-1.5 ${
              activeSubTab === 'catalog'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manual por Evidência</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'individual' ? (
        /* INDIVIDUALIZED BEHAVIOR CONSULTATION FORM */
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm no-print space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="text-lg">🧸</span>
              <h3 className="font-black text-slate-900 text-base">
                Registrar Comportamento Específico Observado
              </h3>
            </div>

            {/* Student selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Aluno em Observação
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade})
                    </option>
                  ))}
                  <option value="custom">+ Outro Aluno / Não Cadastrado</option>
                </select>
              </div>

              {selectedStudentId === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nome da Criança
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Pedro Lucas"
                    value={customStudentName}
                    onChange={(e) => setCustomStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contexto / Momento da Ocorrência
                </label>
                <select
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                >
                  <option value="Em sala de aula durante explicação / tarefa">Sala de aula durante tarefa</option>
                  <option value="Em transição de matéria ou troca de professor">Transição de matéria / ambiente</option>
                  <option value="No recreio / pátio / refeitório com alto ruído">Recreio / pátio / refeitório</option>
                  <option value="Durante avaliação individual escrita">Em avaliação / prova escrita</option>
                  <option value="Em trabalho em grupo ou atividade coletiva">Em trabalho em equipe</option>
                  <option value="Na chegada ou saída da escola">Na chegada ou saída</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Intensidade da Desregulação
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'mild', label: 'Leve (Início)', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
                    { id: 'moderate', label: 'Moderada', color: 'bg-amber-50 text-amber-700 border-amber-300' },
                    { id: 'severe', label: 'Severa (Meltdown)', color: 'bg-rose-50 text-rose-700 border-rose-300' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setIntensity(lvl.id as any)}
                      className={`cursor-pointer py-2 text-[11px] font-black rounded-xl border transition ${
                        intensity === lvl.id
                          ? `${lvl.color} shadow-xs font-black`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Frequent Behaviors Pills */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Situações Frequentes no Dia a Dia Escolar (Clique para preencher rápido):
              </span>
              <div className="flex flex-wrap gap-2">
                {FREQUENT_BEHAVIORS.map((beh, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSpecificBehavior(beh)}
                    className={`cursor-pointer text-left text-xs px-3 py-1.5 rounded-xl border transition ${
                      specificBehavior === beh
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50/60'
                    }`}
                  >
                    ⚡ {beh}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Behavior Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Descrição Detalhada do Comportamento Específico *
              </label>
              <textarea
                rows={3}
                required
                value={specificBehavior}
                onChange={(e) => setSpecificBehavior(e.target.value)}
                placeholder="Descreva exatamente o que a criança fez, o que foi dito, quais foram os sinais corporais e a reação dos colegas..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            {/* Student Known Context Card */}
            {selectedStudent && (
              <div className="bg-gradient-to-r from-amber-50/50 to-pink-50/50 p-4 rounded-2xl border border-amber-200 text-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <strong className="text-slate-800 mr-2">Perfil Atrelado:</strong>
                  <span className="font-extrabold text-amber-800">{selectedStudent.name}</span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span className="text-slate-600 font-semibold">
                    Neurotipos: {selectedStudent.neurotypes.join(', ')}
                  </span>
                </div>

                {selectedStudent.calmingStrategies.length > 0 && (
                  <div className="text-emerald-800">
                    <span className="font-bold">Estratégia Calmante Conhecida:</span>{' '}
                    <span>{selectedStudent.calmingStrategies[0]}</span>
                  </div>
                )}
              </div>
            )}

            {aiError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                id="btn-generate-individualized-management"
                type="button"
                onClick={() => handleGenerateIndividualizedPlan()}
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-extrabold shadow-md shadow-amber-500/25 transition active:scale-95 text-sm"
              >
                <Zap className="w-4 h-4" />
                <span>Gerar Plano de Manejo Individualizado (Offline)</span>
              </button>

              <button
                type="button"
                onClick={handleConsultAI}
                disabled={isLoadingAI}
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isLoadingAI ? 'Consultando IA Pedagógica...' : 'Aprofundar com IA Pedagógica (Online)'}</span>
              </button>
            </div>
          </div>

          {/* RESULTING INDIVIDUALIZED INTERVENTION CARD */}
          {currentConsultation && (
            <div
              id="individualized-management-sheet"
              className="bg-white rounded-3xl border-2 border-amber-300 shadow-xl p-6 md:p-8 space-y-6"
            >
              {/* Card Header */}
              <div className="border-b border-amber-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-200 mb-2">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Plano de Manejo Individualizado de Comportamento</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Estudante: {currentConsultation.studentName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Contexto: <strong>{currentConsultation.context}</strong> • Nível de Intensidade:{' '}
                    <strong className="text-amber-800">
                      {currentConsultation.intensity === 'mild'
                        ? 'Leve'
                        : currentConsultation.intensity === 'moderate'
                        ? 'Moderada'
                        : 'Severa (Meltdown)'}
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="cursor-pointer px-4 py-2 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-4 h-4 text-amber-600" />
                    <span>Imprimir Ficha de Manejo</span>
                  </button>
                </div>
              </div>

              {/* Observed Behavior Highlight Box */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs">
                <span className="font-extrabold text-amber-950 uppercase tracking-wider block mb-1">
                  Comportamento Específico Registrado pelo Educador:
                </span>
                <p className="text-slate-800 font-semibold italic text-sm">
                  "{currentConsultation.specificBehavior}"
                </p>
              </div>

              {/* 4 Pillars of Individualized Intervention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pillar 1: Immediate Action */}
                <div className="bg-rose-50/60 rounded-3xl p-5 border border-rose-200 space-y-3">
                  <h4 className="text-sm font-black text-rose-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>Ação Imediata & Desescalada (Primeiros 3 Minutos)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-800">
                    {currentConsultation.immediateDeescalationSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pillar 2: Pedagogical Accommodation */}
                <div className="bg-indigo-50/60 rounded-3xl p-5 border border-indigo-200 space-y-3">
                  <h4 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                      2
                    </span>
                    <span>Manejo Pedagógico / Flexibilização da Tarefa</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-800">
                    {currentConsultation.pedagogicalAccommodation.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pillar 3: Psychoemotional */}
                <div className="bg-emerald-50/60 rounded-3xl p-5 border border-emerald-200 space-y-3">
                  <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      3
                    </span>
                    <span>Manejo Psicoemocional & Autorregulação</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-800">
                    {currentConsultation.psychoemotionalHandling.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pillar 4: Social Peer Mediation */}
                <div className="bg-purple-50/60 rounded-3xl p-5 border border-purple-200 space-y-3">
                  <h4 className="text-sm font-black text-purple-950 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                      4
                    </span>
                    <span>Manejo Social com os Colegas de Turma</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-800">
                    {currentConsultation.socialPeerMediation.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-purple-600 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What NEVER To Do (Critical Warning Box) */}
              <div className="bg-rose-50 rounded-2xl p-5 border border-rose-300">
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>O que NUNCA fazer nessa situação (Evitar agravamento):</span>
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-rose-950">
                  {currentConsultation.whatNeverToDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preventive adjustments */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <strong className="text-slate-800 block mb-1">
                  Ajuste Preventivo de Rotina para o PEI (Evitar reincidência):
                </strong>
                <ul className="space-y-1 text-slate-700">
                  {currentConsultation.preventiveRoutineAdjustments.map((prev, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer notes */}
              <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <span>
                  Ficha de orientação gerada no <strong>AcolheMente 🎈</strong> para uso do mediador, professor de apoio e equipe escolar.
                </span>
                <span>Data: {new Date(currentConsultation.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* GENERAL EVIDENCE-BASED CATALOG TAB */
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por situação (ex: meltdown, recusa, dislexia)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white transition"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 font-semibold text-slate-700"
              >
                <option value="ALL">Todas as Categorias de Manejo</option>
                <option value="pedagogical">🎓 Manejo Pedagógico (DUA / Aulas)</option>
                <option value="psychological">🧠 Manejo Psicológico / Emocional</option>
                <option value="social">🤝 Manejo Social & Pares</option>
                <option value="sensory">🎧 Manejo Sensorial</option>
              </select>
            </div>

            <div>
              <select
                value={selectedNeurotype}
                onChange={(e) => setSelectedNeurotype(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 font-semibold text-slate-700"
              >
                <option value="ALL">Todos os Neurotipos</option>
                {Object.entries(NEUROTYPE_INFO).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Strategies List */}
          <div className="space-y-6">
            {filteredStrategies.map((strategy) => {
              const cat = getCategoryBadge(strategy.category);
              const CatIcon = cat.icon;

              return (
                <div
                  key={strategy.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-amber-300 transition"
                >
                  {/* Category & Neurotype Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cat.color}`}>
                      <CatIcon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </span>

                    <div className="flex flex-wrap gap-1">
                      {strategy.targetNeurotypes.map((nt) => {
                        const ntInfo = NEUROTYPE_INFO[nt] || { label: nt, badgeColor: 'bg-slate-100 text-slate-700' };
                        return (
                          <span
                            key={nt}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${ntInfo.badgeColor}`}
                          >
                            {ntInfo.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title & Scenario */}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-snug">{strategy.title}</h3>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 mt-2">
                      <strong className="text-slate-900 block mb-1">Cenário Desafiador na Rotina Escolar:</strong>
                      <p className="italic">"{strategy.problemScenario}"</p>
                    </div>
                  </div>

                  {/* What to do & What to avoid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* What to do */}
                    <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200">
                      <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Manejo Recomendado (O que Fazer):</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-800">
                        {strategy.whatToDo.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What to avoid */}
                    <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-200">
                      <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Condutas Ineficazes (O que Evitar):</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-800">
                        {strategy.whatToAvoid.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-600 font-bold">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Classroom Example */}
                  <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100 text-xs text-slate-700">
                    <strong className="text-amber-950 block mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Exemplo Prático na Sala de Aula:</span>
                    </strong>
                    <p className="text-slate-800">{strategy.classroomExample}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {strategy.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
