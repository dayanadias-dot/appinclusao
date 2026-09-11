import React, { useState } from 'react';
import { X, Save, Sparkles, User, Ear, HeartHandshake, AlertCircle } from 'lucide-react';
import { Student, SupportLevel, NeurotypeCategory } from '../types';
import { NEUROTYPE_INFO, SUPPORT_LEVEL_INFO } from '../data/expertKnowledge';

interface StudentFormModalProps {
  studentToEdit?: Student | null;
  onSave: (student: Student) => void;
  onClose: () => void;
}

const AVATAR_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f43f5e', '#3b82f6'];

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  studentToEdit,
  onSave,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'sensory' | 'interests' | 'care'>('basic');

  const [name, setName] = useState(studentToEdit?.name || '');
  const [birthDate, setBirthDate] = useState(studentToEdit?.birthDate || '2017-01-01');
  const [grade, setGrade] = useState(studentToEdit?.grade || '3º Ano - Fundamental I');
  const [supportLevel, setSupportLevel] = useState<SupportLevel>(studentToEdit?.supportLevel || 'level_1');
  const [diagnosisStatus, setDiagnosisStatus] = useState(studentToEdit?.diagnosisStatus || 'pedagogical_observation');
  const [selectedNeurotypes, setSelectedNeurotypes] = useState<NeurotypeCategory[]>(
    studentToEdit?.neurotypes || ['TEA']
  );
  const [communicationType, setCommunicationType] = useState(studentToEdit?.communicationType || 'verbal');
  const [avatarColor, setAvatarColor] = useState(studentToEdit?.avatarColor || AVATAR_COLORS[0]);

  // Sensory
  const [auditory, setAuditory] = useState(studentToEdit?.sensoryProfile.auditory || 'hypersensitive');
  const [visual, setVisual] = useState(studentToEdit?.sensoryProfile.visual || 'typical');
  const [tactile, setTactile] = useState(studentToEdit?.sensoryProfile.tactile || 'typical');
  const [vestibularMotor, setVestibularMotor] = useState(studentToEdit?.sensoryProfile.vestibularMotor || 'typical');
  const [sensoryNotes, setSensoryNotes] = useState(studentToEdit?.sensoryProfile.notes || '');

  // Interests, Strengths, Triggers, Calming
  const [specialInterestsStr, setSpecialInterestsStr] = useState(
    studentToEdit?.specialInterests.join(', ') || 'Robótica, Desenho, Dinossauros'
  );
  const [strengthsStr, setStrengthsStr] = useState(
    studentToEdit?.strengths.join(', ') || 'Memória visual, Empatia, Criatividade'
  );
  const [triggersStr, setTriggersStr] = useState(
    studentToEdit?.triggers.join(', ') || 'Barulho forte e súbito, Mudança inesperada de rotina'
  );
  const [calmingStrategiesStr, setCalmingStrategiesStr] = useState(
    studentToEdit?.calmingStrategies.join(', ') || 'Fone antirruído, Cantinho da calma, Pausa motora'
  );

  // Care
  const [guardianContact, setGuardianContact] = useState(studentToEdit?.guardianContact || '');
  const [emergencyCarePlan, setEmergencyCarePlan] = useState(
    studentToEdit?.emergencyCarePlan || 'Em caso de sobrecarga sensorial, acolher em local tranquilo com fala suave e sem cobrança verbal imediata.'
  );

  const toggleNeurotype = (nt: NeurotypeCategory) => {
    if (selectedNeurotypes.includes(nt)) {
      setSelectedNeurotypes(selectedNeurotypes.filter((item) => item !== nt));
    } else {
      setSelectedNeurotypes([...selectedNeurotypes, nt]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, informe o nome do estudante.');
      return;
    }

    const parseList = (str: string) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const updatedStudent: Student = {
      id: studentToEdit?.id || `std-${Date.now()}`,
      name: name.trim(),
      birthDate,
      grade: grade.trim(),
      supportLevel,
      neurotypes: selectedNeurotypes.length > 0 ? selectedNeurotypes : ['Outro'],
      diagnosisStatus,
      communicationType,
      avatarColor,
      specialInterests: parseList(specialInterestsStr),
      strengths: parseList(strengthsStr),
      triggers: parseList(triggersStr),
      calmingStrategies: parseList(calmingStrategiesStr),
      sensoryProfile: {
        auditory,
        visual,
        tactile,
        vestibularMotor,
        notes: sensoryNotes
      },
      guardianContact: guardianContact.trim(),
      emergencyCarePlan: emergencyCarePlan.trim(),
      createdAt: studentToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(updatedStudent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Plano de Desenvolvimento do Aluno</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              {studentToEdit ? `Editar Perfil: ${studentToEdit.name}` : 'Cadastrar Novo Estudante'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`cursor-pointer pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Dados Gerais</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sensory')}
            className={`cursor-pointer pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sensory'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Ear className="w-4 h-4" />
            <span>Perfil Sensorial</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('interests')}
            className={`cursor-pointer pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'interests'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hiperfocos & Potencialidades</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('care')}
            className={`cursor-pointer pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'care'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Acolhimento & Contatos</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
            {/* TAB 1: BASIC */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome Completo do Aluno *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Arthur Mendonça Vieira"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Ano Escolar / Turma
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 4º Ano B"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                {/* Support Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nível de Suporte Requerido
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(SUPPORT_LEVEL_INFO).map(([key, info]) => (
                      <div
                        key={key}
                        onClick={() => setSupportLevel(key as SupportLevel)}
                        className={`cursor-pointer p-3 rounded-xl border-2 text-xs transition ${
                          supportLevel === key
                            ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-950'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-sm">{info.label}</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{info.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neurotypes Checkbox Pills */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Neurotipos e Condições (Selecione um ou mais)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(NEUROTYPE_INFO).map(([key, info]) => {
                      const isSelected = selectedNeurotypes.includes(key as NeurotypeCategory);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleNeurotype(key as NeurotypeCategory)}
                          className={`cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {info.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Status do Diagnóstico / Laudo
                    </label>
                    <select
                      value={diagnosisStatus}
                      onChange={(e) => setDiagnosisStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="diagnosed">Laudo Clínico Confirmado</option>
                      <option value="under_evaluation">Em Investigação Multiprofissional</option>
                      <option value="pedagogical_observation">Observação Pedagógica / Rastreio AEE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Modalidade de Comunicação
                    </label>
                    <select
                      value={communicationType}
                      onChange={(e) => setCommunicationType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="verbal">Verbal Oral Fluente</option>
                      <option value="caa_alternative">Comunicação Alternativa (CAA / PECS / Pranchas)</option>
                      <option value="gestural_mixed">Gestual e Sonora Mista</option>
                      <option value="in_development">Em Desenvolvimento de Fala</option>
                    </select>
                  </div>
                </div>

                {/* Avatar Color */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cor do Perfil
                  </label>
                  <div className="flex gap-2">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAvatarColor(color)}
                        className={`w-7 h-7 rounded-full transition transform ${
                          avatarColor === color ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'opacity-80'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SENSORY */}
            {activeTab === 'sensory' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    O mapeamento sensorial evita crises neurológicas (meltdowns/shutdowns) e orienta a escolha correta de acomodações na sala de aula.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Audição (Sensibilidade Sonora)
                    </label>
                    <select
                      value={auditory}
                      onChange={(e) => setAuditory(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="hypersensitive">Hipersensível (incômodo com ruídos/sino)</option>
                      <option value="hyposensitive">Hipossensível (busca sons altos)</option>
                      <option value="typical">Típica</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Visão (Sensibilidade Luminosa)
                    </label>
                    <select
                      value={visual}
                      onChange={(e) => setVisual(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="hypersensitive">Hipersensível (incômodo com luz forte/telas)</option>
                      <option value="hyposensitive">Hipossensível (atração por luzes piscantes)</option>
                      <option value="typical">Típica</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Tato (Sensibilidade Tátil)
                    </label>
                    <select
                      value={tactile}
                      onChange={(e) => setTactile(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="hypersensitive">Hipersensível (rejeita certas texturas/tintas)</option>
                      <option value="hyposensitive">Hipossensível (aprecia toques firmes/peso)</option>
                      <option value="typical">Típica</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Motor / Vestibular (Movimento)
                    </label>
                    <select
                      value={vestibularMotor}
                      onChange={(e) => setVestibularMotor(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                    >
                      <option value="seeker">Buscador Sensorial (precisa se mover constantemente)</option>
                      <option value="avoider">Evitador (insegurança em balanços/alturas)</option>
                      <option value="typical">Típica</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Anotações e Acomodações Sensoriais Específicas
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Usa abafador auricular em transições. Senta próximo à janela. Não gosta de tinta guache nas mãos."
                    value={sensoryNotes}
                    onChange={(e) => setSensoryNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: INTERESTS & POTENTIALS */}
            {activeTab === 'interests' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hiperfocos & Interesses Especiais (Separados por vírgula)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Esses temas serão usados pelo <strong>Adaptador DUA</strong> para criar conexões motivadoras nas atividades escolares.
                  </p>
                  <input
                    type="text"
                    placeholder="Ex: Dinossauros, Carros de corrida, Minecraft, Robótica, Astronomia"
                    value={specialInterestsStr}
                    onChange={(e) => setSpecialInterestsStr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pontos Fortes & Talentos do Aluno (Separados por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Memória fotográfica, Excelente senso de humor, Habilidade para desenhar, Honestidade"
                    value={strengthsStr}
                    onChange={(e) => setStrengthsStr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                    Gatilhos de Desconforto / Desregulação (Separados por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mudança abrupta de horário, Prova com tempo rígido, Sala muito quente, Barulho de sino"
                    value={triggersStr}
                    onChange={(e) => setTriggersStr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-rose-200 text-sm focus:ring-2 focus:ring-rose-500 bg-rose-50/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                    Estratégias Eficazes de Acalento / Autorregulação (Separados por vírgula)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Fone de ouvido, Cantinho da leitura, Segurar massinha, Beber água gelada, Desenhar"
                    value={calmingStrategiesStr}
                    onChange={(e) => setCalmingStrategiesStr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 text-sm focus:ring-2 focus:ring-emerald-500 bg-emerald-50/30"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: CARE & CONTACTS */}
            {activeTab === 'care' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contato dos Responsáveis
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mariana Mendonça (Mãe) - (83) 99876-1234"
                    value={guardianContact}
                    onChange={(e) => setGuardianContact(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Plano de Acolhimento em Crises / Meltdowns
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Orientações imediatas para professores e mediadores caso ocorra sobrecarga neurológica.
                  </p>
                  <textarea
                    rows={4}
                    placeholder="Ex: Falar com voz suave, não tentar abraçar sem permissão, diminuir luzes, levar para o cantinho da calma e aguardar descompressão antes de conversar."
                    value={emergencyCarePlan}
                    onChange={(e) => setEmergencyCarePlan(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              id="btn-save-student"
              className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/25 transition active:scale-95 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Estudante</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
