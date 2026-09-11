import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Sparkles,
  Volume2,
  Ear,
  Eye,
  Activity,
  Heart,
  Target,
  FileCheck2,
  ClipboardList,
  Edit,
  Trash2
} from 'lucide-react';
import { Student, SupportLevel, NeurotypeCategory } from '../types';
import { NEUROTYPE_INFO, SUPPORT_LEVEL_INFO } from '../data/expertKnowledge';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onNewStudent: () => void;
  onNavigateToReports: (studentId: string) => void;
  onNavigateToGoals: (studentId: string) => void;
  onNavigateToAdapter: (studentId: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onNewStudent,
  onNavigateToReports,
  onNavigateToGoals,
  onNavigateToAdapter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNeurotype, setFilterNeurotype] = useState<string>('ALL');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.specialInterests.some((i) => i.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesNeurotype =
      filterNeurotype === 'ALL' || student.neurotypes.includes(filterNeurotype as NeurotypeCategory);

    const matchesLevel = filterLevel === 'ALL' || student.supportLevel === filterLevel;

    return matchesSearch && matchesNeurotype && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Gestão Pedagógica Inclusiva</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Estudantes Acompanhados</h2>
          <p className="text-sm text-slate-600 mt-1">
            Fichas individuais, perfis sensoriais, mapeamento de hiperfocos e estratégias de autorregulação.
          </p>
        </div>

        <button
          id="btn-add-student"
          onClick={onNewStudent}
          className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-500/25 transition active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Estudante</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome, turma ou hiperfoco..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition"
          />
        </div>

        <div>
          <select
            value={filterNeurotype}
            onChange={(e) => setFilterNeurotype(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition text-slate-700 font-medium"
          >
            <option value="ALL">Todos os Neurotipos / Diagnósticos</option>
            {Object.entries(NEUROTYPE_INFO).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition text-slate-700 font-medium"
          >
            <option value="ALL">Todos os Níveis de Suporte</option>
            {Object.entries(SUPPORT_LEVEL_INFO).map(([key, info]) => (
              <option key={key} value={key}>
                {info.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Nenhum aluno encontrado</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
            Tente ajustar os filtros de busca ou cadastre um novo estudante para começar o acompanhamento.
          </p>
          <button
            onClick={onNewStudent}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
          >
            Cadastrar Estudante
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const levelInfo = SUPPORT_LEVEL_INFO[student.supportLevel] || SUPPORT_LEVEL_INFO.monitoring;

            return (
              <div
                key={student.id}
                id={`student-card-${student.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between overflow-hidden group"
              >
                {/* Top header with avatar & badges */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl text-white font-extrabold text-lg flex items-center justify-center shadow-md flex-shrink-0"
                        style={{ backgroundColor: student.avatarColor || '#6366f1' }}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition leading-snug">
                          {student.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{student.grade}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        title="Editar Ficha do Aluno"
                        onClick={() => onEditStudent(student)}
                        className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Excluir Aluno"
                        onClick={() => {
                          if (confirm(`Deseja excluir o registro de ${student.name}? Todos os relatórios e metas deste aluno serão excluídos.`)) {
                            onDeleteStudent(student.id);
                          }
                        }}
                        className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Neurotypes & Support Level Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${levelInfo.badge}`}>
                      {levelInfo.label}
                    </span>
                    {student.neurotypes.map((nt) => {
                      const ntInfo = NEUROTYPE_INFO[nt] || { label: nt, badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' };
                      return (
                        <span
                          key={nt}
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${ntInfo.badgeColor}`}
                        >
                          {ntInfo.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Hiperfocos / Interesses Especiais */}
                  {student.specialInterests.length > 0 && (
                    <div className="mb-3">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Hiperfocos & Interesses:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {student.specialInterests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md"
                          >
                            🌟 {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sensory Summary pill */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1 mt-3">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Ear className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        Audição:{' '}
                        <strong className="text-slate-900">
                          {student.sensoryProfile.auditory === 'hypersensitive'
                            ? 'Hipersensível (usa abafador)'
                            : student.sensoryProfile.auditory === 'hyposensitive'
                            ? 'Hipossensível'
                            : 'Típica'}
                        </strong>
                      </span>
                    </div>
                    {student.triggers.length > 0 && (
                      <p className="text-[11px] text-slate-500 truncate" title={student.triggers.join(', ')}>
                        <span className="font-semibold text-rose-600">Gatilhos:</span> {student.triggers[0]}
                        {student.triggers.length > 1 && ` (+${student.triggers.length - 1})`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Ribbons */}
                <div className="bg-slate-50/80 px-5 py-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onNavigateToReports(student.id)}
                    className="cursor-pointer text-xs font-semibold py-1.5 px-2 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-300 flex items-center justify-center gap-1 transition shadow-2xs"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Diário</span>
                  </button>

                  <button
                    onClick={() => onNavigateToGoals(student.id)}
                    className="cursor-pointer text-xs font-semibold py-1.5 px-2 rounded-lg bg-white hover:bg-amber-50 text-amber-700 border border-slate-200 hover:border-amber-300 flex items-center justify-center gap-1 transition shadow-2xs"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>PEI</span>
                  </button>

                  <button
                    onClick={() => onNavigateToAdapter(student.id)}
                    className="cursor-pointer text-xs font-semibold py-1.5 px-2 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-300 flex items-center justify-center gap-1 transition shadow-2xs"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Adaptar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
