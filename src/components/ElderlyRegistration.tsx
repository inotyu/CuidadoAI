import React, { useState } from 'react';
import { Save, Sparkles, User, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ElderlyHealthAnalysis } from '../types';

interface ElderlyRegistrationProps {
  healthAnalysis: ElderlyHealthAnalysis;
  profilePhoto?: string;
  onSave: (name: string) => void;
  isLoading?: boolean;
}

const ElderlyRegistration: React.FC<ElderlyRegistrationProps> = ({ 
  healthAnalysis, 
  profilePhoto, 
  onSave, 
  isLoading 
}) => {
  const [elderlyName, setElderlyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (elderlyName.trim()) {
      onSave(elderlyName.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="relative h-48 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Foto do perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          
          {/* Health indicators */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-blue-700 flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              Análise Concluída
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4"
            >
              <Sparkles className="w-6 h-6 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Quase Pronto!
            </h2>
            <p className="text-gray-600">
              Como gostaria de ser chamado(a) em nossas conversas?
            </p>
          </div>

          {/* Health Summary Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Resumo da Análise:</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/60 rounded-lg p-2">
                <span className="font-medium text-gray-700">Condições:</span>
                <span className="text-blue-600 ml-1">{healthAnalysis.conditions.length}</span>
              </div>
              <div className="bg-white/60 rounded-lg p-2">
                <span className="font-medium text-gray-700">Risco:</span>
                <span className={`ml-1 font-medium ${
                  healthAnalysis.overall_risk_score >= 70 ? 'text-red-600' :
                  healthAnalysis.overall_risk_score >= 40 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {healthAnalysis.overall_risk_score >= 70 ? 'Alto' :
                   healthAnalysis.overall_risk_score >= 40 ? 'Moderado' : 'Baixo'}
                </span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="elderlyName" className="block text-sm font-medium text-gray-700 mb-2">
                Nome de Preferência
              </label>
              <motion.input
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                type="text"
                id="elderlyName"
                value={elderlyName}
                onChange={(e) => setElderlyName(e.target.value)}
                placeholder="Como gostaria de ser chamado(a)..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Este será o nome usado em nossas conversas e relatórios
              </p>
            </div>

            {/* Priority Recommendations Preview */}
            {healthAnalysis.recommendations.slice(0, 2).map((rec, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  rec.priority === 'alta' ? 'bg-red-50 border-red-400' :
                  rec.priority === 'média' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-green-50 border-green-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    {rec.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    rec.priority === 'alta' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'média' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{rec.description}</p>
              </motion.div>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!elderlyName.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all text-lg"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Perfil de Cuidado
                </>
              )}
            </motion.button>
          </form>

          {/* Next Steps Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Próximos Passos:</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Questionário detalhado de saúde
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Plano alimentar personalizado
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                Avaliações de bem-estar interativas
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              <strong>Importante:</strong> Este sistema oferece suporte informativo. 
              Sempre consulte profissionais de saúde para orientações médicas específicas.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ElderlyRegistration;