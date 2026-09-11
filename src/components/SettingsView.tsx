import React, { useRef } from 'react';
import {
  Settings,
  User,
  Eye,
  Database,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { UserSettings } from '../types';
import { db } from '../services/db';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onReloadDatabase: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onReloadDatabase
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    const dataStr = db.exportBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inclui_plus_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = db.importBackup(content);
        if (success) {
          alert('Backup importado com sucesso!');
          onReloadDatabase();
        } else {
          alert('Erro ao importar backup. Verifique se o arquivo JSON é válido.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetSampleData = () => {
    if (confirm('Deseja recarregar os dados didáticos de exemplo (estudantes Arthur, Mariana e Enzo)?')) {
      db.resetToInitialData();
      onReloadDatabase();
      alert('Dados de exemplo recarregados com sucesso!');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
          <Settings className="w-4 h-4" />
          <span>Configurações & Acessibilidade</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Preferências do Sistema</h2>
        <p className="text-sm text-slate-600 mt-1">
          Ajustes de acessibilidade visual, identificação do profissional e gestão de cópias de segurança locais.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" />
          <span>Identificação do Educador / Instituição</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nome do Profissional
            </label>
            <input
              type="text"
              value={settings.teacherName}
              onChange={(e) => onUpdateSettings({ ...settings, teacherName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cargo / Função
            </label>
            <input
              type="text"
              value={settings.teacherRole}
              onChange={(e) => onUpdateSettings({ ...settings, teacherRole: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Escola / Sala de Recursos
            </label>
            <input
              type="text"
              value={settings.schoolName}
              onChange={(e) => onUpdateSettings({ ...settings, schoolName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Accessibility Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600" />
          <span>Acessibilidade Sensorial e Leitura</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dyslexia-friendly spacing */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Fonte Otimizada para Leitura (Dislexia)</span>
              <span className="text-xs text-slate-500">
                Aumenta o espaçamento entre caracteres e linhas para reduzir a fadiga visual.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, dyslexiaFont: !settings.dyslexiaFont })}
              className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition ${
                settings.dyslexiaFont ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Calm mode */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Modo Sensorial Suave (Calm Mode)</span>
              <span className="text-xs text-slate-500">
                Diminui animações contínuas e saturação visual para prevenir sobrecarga sensorial.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, calmMode: !settings.calmMode })}
              className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition ${
                settings.calmMode ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* High contrast */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Modo Alto Contraste</span>
              <span className="text-xs text-slate-500">Realça bordas e elementos textuais para maior nitidez.</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ ...settings, highContrast: !settings.highContrast })}
              className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition ${
                settings.highContrast ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Font Size */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Escala de Tamanho do Texto</span>
              <span className="text-xs text-slate-500">Amplia a visualização geral de fontes do app.</span>
            </div>
            <div className="flex gap-1">
              {(['normal', 'large', 'huge'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, fontSize: size })}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                    settings.fontSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Local Database & Backups */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <span>Banco de Dados Local & Suporte Offline</span>
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          Seus dados são armazenados localmente e de forma segura no navegador da sua máquina, permitindo funcionamento <strong>100% offline</strong> sem necessidade de internet. Recomendamos exportar cópias de segurança periodicamente.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar Backup Completo (.JSON)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs transition"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Importar Backup (.JSON)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            onClick={handleResetSampleData}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recarregar Alunos de Exemplo</span>
          </button>
        </div>
      </div>

      {/* Legislation & Pedagogical Standards */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-slate-50 p-6 rounded-2xl border border-indigo-200 text-xs text-slate-700 space-y-3">
        <h4 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Fundamentação Legal e Pedagógica</span>
        </h4>
        <ul className="space-y-1.5 list-disc list-inside text-slate-600">
          <li>
            <strong>Lei Brasileira de Inclusão (Lei nº 13.146/2015):</strong> Assegura sistema educacional inclusivo em todos os níveis e oferta de adaptações razoáveis e serviços de AEE.
          </li>
          <li>
            <strong>Lei Berenice Piana (Lei nº 12.764/2012):</strong> Reconhece a pessoa com TEA como pessoa com deficiência para todos os efeitos legais, garantindo acompanhante especializado em sala quando necessário.
          </li>
          <li>
            <strong>Desenho Universal para a Aprendizagem (DUA / CAST):</strong> Metodologia proativa que elimina barreiras no planejamento instrucional prévio, e não apenas na remediação posterior.
          </li>
          <li>
            <strong>Suporte Positivo do Comportamento (PBS):</strong> Estratégias proativas de mediação ambiental e emocional baseadas em respeito à neurodiversidade e dignidade do aluno.
          </li>
        </ul>
      </div>
    </div>
  );
};
