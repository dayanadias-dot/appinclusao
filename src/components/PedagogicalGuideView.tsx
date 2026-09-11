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
  Tag
} from 'lucide-react';
import { PEDAGOGICAL_GUIDE, NEUROTYPE_INFO } from '../data/expertKnowledge';
import { GuideStrategy } from '../types';

export const PedagogicalGuideView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedNeurotype, setSelectedNeurotype] = useState<string>('ALL');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs uppercase tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>Manual de Evidências & Práticas Inclusivas</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
          Guia de Manejos Pedagógicos, Psicológicos e Sociais
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Intervenções práticas baseadas em Desenho Universal (DUA), TEACCH, Suporte Positivo do Comportamento (PBS) e Neuroafirmação.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por situação (ex: meltdown, recusa, dislexia)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50 focus:bg-white transition"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50 font-medium text-slate-700"
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
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-slate-50 font-medium text-slate-700"
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
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-cyan-300 transition"
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
                <h3 className="text-xl font-bold text-slate-900 leading-snug">{strategy.title}</h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 mt-2">
                  <strong className="text-slate-900 block mb-1">Cenário Desafiador na Rotina Escolar:</strong>
                  <p className="italic">"{strategy.problemScenario}"</p>
                </div>
              </div>

              {/* What to do & What to avoid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* What to do */}
                <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-200">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
              <div className="p-4 bg-cyan-50/40 rounded-xl border border-cyan-100 text-xs text-slate-700">
                <strong className="text-cyan-900 block mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
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
  );
};
