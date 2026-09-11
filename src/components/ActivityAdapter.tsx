import React, { useState, useRef } from 'react';
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
  Wand2,
  AlertCircle,
  Paperclip,
  Upload,
  FileText,
  Image as ImageIcon,
  FileCode,
  Trash2,
  Eye,
  Check,
  Zap
} from 'lucide-react';
import { Student, SupportLevel, ActivityAdaptationPlan, AttachedDocument } from '../types';
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
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Attached Document State
  const [attachedFile, setAttachedFile] = useState<AttachedDocument | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generated Plan
  const [currentPlan, setCurrentPlan] = useState<ActivityAdaptationPlan | null>(null);

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];

  // Handle file selection
  const processUploadedFile = (file: File) => {
    const isText = file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md');
    const isImage = file.type.startsWith('image/');

    if (isText) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || '';
        const previewText = text.slice(0, 500);
        setAttachedFile({
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          extractedText: previewText
        });
        if (text.length > 20 && originalObjective.length < 50) {
          setOriginalObjective(previewText);
        }
      };
      reader.readAsText(file);
    } else if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: e.target?.result as string,
          extractedText: 'Atividade em formato de imagem/foto escaneada. Estruturada para suporte visual e transcrição.'
        });
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or DOCX or generic
      setAttachedFile({
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        extractedText: `Documento "${file.name}" anexado com sucesso para flexibilização curricular DUA.`
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const loadSampleDocument = (type: 'math' | 'reading' | 'science') => {
    if (type === 'math') {
      setActivityTitle('Atividade Avaliativa: Divisão e Frações');
      setSubject('Matemática');
      setOriginalObjective('Resolver 10 operações de divisão com resto e calcular fração de quantidade em 50 minutos.');
      setAttachedFile({
        name: 'Avaliacao_Matematica_Operacoes_5Ano.pdf',
        size: 345000,
        type: 'application/pdf',
        extractedText: 'Questões 1 a 10: Cálculos de divisão com números de 3 dígitos e problemas contextualizados de frações.'
      });
    } else if (type === 'reading') {
      setActivityTitle('Interpretação da Fábula: A Cigarra e a Formiga');
      setSubject('Língua Portuguesa');
      setOriginalObjective('Ler o texto de 4 parágrafos e responder 6 perguntas dissertativas à caneta.');
      setAttachedFile({
        name: 'Folha_Fabula_Interpretacao_3Ano.docx',
        size: 184000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extractedText: 'Fábula com perguntas sobre personagens, tempo e espaço, requerendo resposta em parágrafos completos.'
      });
    } else {
      setActivityTitle('Ciclo da Água e Estados Físicos');
      setSubject('Ciências Naturais');
      setOriginalObjective('Esquematizar as etapas de evaporação, condensação e precipitação.');
      setAttachedFile({
        name: 'Atividade_Ciclo_Agua_Foto.jpg',
        size: 512000,
        type: 'image/jpeg',
        extractedText: 'Diagrama esquemático do ciclo hidrológico com espaço para preenchimento de legendas.'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
      'Fracionamento do conteúdo: dividir a leitura ou exercícios em blocos curtos com pausas intermediárias.',
      'Destaque tipográfico: utilizar fonte sem serifa (Lexend), tamanho 14-16pt, com negrito nas palavras-chave.'
    ];

    if (attachedFile) {
      representation.unshift(
        `Adaptação direta do documento anexado ("${attachedFile.name}"): conversão do layout em blocos visuais despoluídos, com ampliação de entrelinhas e eliminação de poluição gráfica.`
      );
    }

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
      `Contextualização com o hiperfoco: adaptar a temática da atividade trazendo analogias e personagens relacionados a "${hyperfoco}".`,
      'Gamificação leve: sistema de micro-conquistas a cada bloco concluído com reforço positivo descritivo.',
      'Possibilidade de trabalho cooperativo com colega-tutor com divisão clara de funções.'
    ];

    if (isAhSd) {
      engagement.push('Desafio de enriquecimento curricular: propor que o aluno elabore uma continuação crítica ou questão reflexiva avançada.');
    }

    // Sensory & Time
    const sensory: string[] = [
      'Permitir o uso de fones antirruído durante toda a etapa de leitura individual ou realização de exercícios.',
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
      attachedFile: attachedFile || undefined,
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
${attachedFile ? `Documento anexado: "${attachedFile.name}" (Trecho: ${attachedFile.extractedText || 'Conteúdo do anexo'})` : ''}
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
          activityContext: `Atividade escolar: ${activityTitle} (${subject})${attachedFile ? ` - Anexo: ${attachedFile.name}` : ''}`
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Não foi possível conectar ao assistente de IA. Gerando com base offline.');
      }

      handleGenerateOfflineAdaptation();
      if (data.text) {
        setCurrentPlan((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            duaEngagement: [
              ...prev.duaEngagement,
              `💡 Sugestão Especial do Assistente Pedagógico para este Documento: ${data.text.slice(0, 320)}...`
            ]
          };
        });
      }
    } catch (err: any) {
      setAiError(err.message);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-sky-50 via-indigo-50 to-pink-50 p-6 rounded-3xl border-2 border-indigo-100 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <span className="text-base">🎨</span>
            <span>Desenho Universal para a Aprendizagem (DUA)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>Adaptador de Atividades & Anexo de Documentos</span>
            <span className="text-xl">📎</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Anexe PDFs, fotos de apostilas ou documentos da turma para criar uma versão flexibilizada, acessível e inclusiva com DUA.
          </p>
        </div>

        {currentPlan && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-xs transition"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>Imprimir Ficha DUA</span>
            </button>

            <button
              onClick={handleSave}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-500/25 transition active:scale-95 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Plano</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm no-print space-y-6">
        {/* Student and Subject Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>🧸</span>
              <span>Aluno Beneficiado *</span>
            </label>
            <select
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                const s = students.find((item) => item.id === e.target.value);
                if (s) setSupportLevelOverride(s.supportLevel);
              }}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>📚</span>
              <span>Matéria / Componente</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Língua Portuguesa, Matemática, História"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>⭐</span>
              <span>Nível de Suporte na Tarefa</span>
            </label>
            <select
              value={supportLevelOverride}
              onChange={(e) => setSupportLevelOverride(e.target.value as SupportLevel)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            >
              {Object.entries(SUPPORT_LEVEL_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activity Name & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Título da Atividade Regular
            </label>
            <input
              type="text"
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              placeholder="Ex: Leitura da Crônica e Redação Individual"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Demanda Original da Turma (Texto/Objetivo)
            </label>
            <input
              type="text"
              value={originalObjective}
              onChange={(e) => setOriginalObjective(e.target.value)}
              placeholder="Ex: Ler texto de 2 páginas e resolver 10 questões dissertativas"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-700"
            />
          </div>
        </div>

        {/* DOCUMENT ATTACHMENT SECTION (User requested feature!) */}
        <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-pink-50/40 p-5 rounded-3xl border-2 border-dashed border-indigo-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                <Paperclip className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Anexar Documento da Atividade Original
                </h4>
                <p className="text-xs text-slate-500">
                  Faça o upload do arquivo que o professor regente preparou para que o AcolheMente faça a adaptação.
                </p>
              </div>
            </div>

            {/* Quick Demo Templates */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500">Exemplos rápidos:</span>
              <button
                type="button"
                onClick={() => loadSampleDocument('math')}
                className="cursor-pointer text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition"
              >
                + Matemática (PDF)
              </button>
              <button
                type="button"
                onClick={() => loadSampleDocument('reading')}
                className="cursor-pointer text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 transition"
              >
                + Fábula (DOCX)
              </button>
              <button
                type="button"
                onClick={() => loadSampleDocument('science')}
                className="cursor-pointer text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
              >
                + Ciências (Foto)
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          {!attachedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer p-6 rounded-2xl border-2 border-dashed text-center transition flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-100/50 scale-[0.99]'
                  : 'border-indigo-300 bg-white/80 hover:bg-white hover:border-indigo-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-indigo-700 hover:underline">
                  Clique para selecionar o arquivo
                </span>{' '}
                <span className="text-slate-500">ou arraste e solte o documento aqui</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Suporta PDF, Word (.docx), Imagens de apostilas (.png, .jpg) e Textos (.txt)
              </p>
            </div>
          ) : (
            /* File Attached Card Preview */
            <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 font-bold">
                  {attachedFile.type.includes('image') ? (
                    <ImageIcon className="w-6 h-6 text-pink-500" />
                  ) : attachedFile.name.endsWith('.pdf') ? (
                    <FileText className="w-6 h-6 text-rose-500" />
                  ) : (
                    <FileCode className="w-6 h-6 text-indigo-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{attachedFile.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold">
                      ✓ Anexado
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tamanho: {formatFileSize(attachedFile.size)} • Pronto para extração e adaptação curricular
                  </p>
                  {attachedFile.extractedText && (
                    <p className="text-[11px] text-slate-600 italic mt-1 line-clamp-1">
                      Trecho: "{attachedFile.extractedText}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="cursor-pointer p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition"
                  title="Remover anexo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Student Context Pill */}
        {selectedStudent && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Perfil Selecionado:</span>
              <span className="font-extrabold text-indigo-700">{selectedStudent.name}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">
                Neurotipo: {selectedStudent.neurotypes.map((n) => NEUROTYPE_INFO[n]?.label || n).join(', ')}
              </span>
            </div>

            {selectedStudent.specialInterests.length > 0 && (
              <div className="flex items-center gap-1.5 text-amber-900">
                <span className="font-bold">Hiperfoco para Conexão:</span>
                <span className="bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg font-bold">
                  {selectedStudent.specialInterests.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {aiError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            id="btn-generate-offline-adaptation"
            type="button"
            onClick={() => handleGenerateOfflineAdaptation()}
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold shadow-md shadow-indigo-500/25 transition active:scale-95 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Gerar Atividade Adaptada com DUA (Offline)</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateWithAI}
            disabled={isLoadingAI}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition"
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
          className="bg-white rounded-3xl border-2 border-indigo-200 shadow-xl p-6 md:p-8 space-y-6"
        >
          {/* Sheet Header */}
          <div className="border-b border-indigo-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-700 font-extrabold text-xs border border-indigo-200 mb-2">
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
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Nível de Suporte DUA
              </span>
              <span className="text-sm font-black text-indigo-900">
                {SUPPORT_LEVEL_INFO[currentPlan.supportLevel].label}
              </span>
            </div>
          </div>

          {/* Attached File Banner in Plan if present */}
          {currentPlan.attachedFile && (
            <div className="bg-gradient-to-r from-indigo-50 to-sky-50 rounded-2xl p-4 border border-indigo-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-indigo-950 block">
                    Documento Original da Turma Flexibilizado:
                  </span>
                  <span className="text-slate-700 font-semibold">{currentPlan.attachedFile.name}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white text-indigo-700 font-bold border border-indigo-200 shadow-2xs">
                {formatFileSize(currentPlan.attachedFile.size)}
              </span>
            </div>
          )}

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
              <p className="text-slate-900 font-semibold">{currentPlan.adaptedEvaluationCriteria}</p>
            </div>
          </div>

          {/* 3 Pillars of Universal Design for Learning (DUA) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1: Representation */}
            <div className="bg-blue-50/70 rounded-3xl p-5 border border-blue-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs">DUA 1</div>
                  <h4 className="font-extrabold text-blue-950 text-sm">Múltiplas Formas de Representação</h4>
                </div>
                <p className="text-[11px] text-blue-800 mb-3">Como o conteúdo é apresentado ao aluno:</p>
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
            <div className="bg-emerald-50/70 rounded-3xl p-5 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs">DUA 2</div>
                  <h4 className="font-extrabold text-emerald-950 text-sm">Ação & Expressão Flexibilizada</h4>
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
            <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs">DUA 3</div>
                  <h4 className="font-extrabold text-amber-950 text-sm">Engajamento & Hiperfoco</h4>
                </div>
                <p className="text-[11px] text-amber-800 mb-3">Conexões afetivas e motivacionais:</p>
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
              Documento elaborado no <strong>AcolheMente 🎈</strong> para a equipe escolar e professor regente.
            </span>
            <span>Data de emissão: {new Date(currentPlan.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
