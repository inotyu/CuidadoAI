import React from 'react';
import { CheckCircle, Sparkles, Heart, User, Shield, Brain, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ElderlyHealthAnalysis } from '../types';

interface ElderlyIdentificationProps {
  healthAnalysis: ElderlyHealthAnalysis;
  profilePhoto?: string;
  onContinue: () => void;
}

const ElderlyIdentification: React.FC<ElderlyIdentificationProps> = ({ 
  healthAnalysis, 
  profilePhoto, 
  onContinue 
}) => {
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'baixo':
        return 'text-green-600 bg-green-100';
      case 'moderado':
        return 'text-yellow-600 bg-yellow-100';
      case 'alto':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'média':
        return <Heart className="w-4 h-4 text-yellow-500" />;
      case 'baixa':
        return <Activity className="w-4 h-4 text-green-500" />;
      default:
        return <Brain className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="relative h-32 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Foto do perfil"
              className="absolute bottom-4 left-6 w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="absolute bottom-4 left-6 w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          )}
          
          <div className="absolute top-4 right-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-full p-2 shadow-lg"
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
          </div>
        </div>
        
        <div className="p-6 pt-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                Análise de Saúde Concluída!
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Condições Identificadas</h3>
                  <div className="space-y-2">
                    {healthAnalysis.conditions.map((condition, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-800">{condition.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(condition.severity)}`}>
                          {condition.severity}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Fatores de Risco</h3>
                  <div className="space-y-2">
                    {healthAnalysis.risk_factors.map((risk, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + 0.1 * index }}
                        className="flex items-center bg-orange-50 p-2 rounded-lg"
                      >
                        <Shield className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{risk}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Recomendações Prioritárias</h3>
                  <div className="space-y-2">
                    {healthAnalysis.recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + 0.1 * index }}
                        className="flex items-start bg-green-50 p-3 rounded-lg"
                      >
                        <div className="mr-2 mt-0.5">
                          {getPriorityIcon(recommendation.priority)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-800">{recommendation.category}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              recommendation.priority === 'alta' ? 'bg-red-100 text-red-700' :
                              recommendation.priority === 'média' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {recommendation.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{recommendation.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Capacidades Funcionais</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(healthAnalysis.functional_capacity).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + 0.05 * index }}
                        className="bg-indigo-50 p-2 rounded-lg text-center"
                      >
                        <div className="text-xs font-medium text-gray-600 capitalize">
                          {key.replace('_', ' ')}
                        </div>
                        <div className={`text-sm font-bold ${
                          value === 'independente' ? 'text-green-600' :
                          value === 'parcial' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {value as React.ReactNode}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Health Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-500" />
                Resumo da Análise
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {healthAnalysis.summary}
              </p>
            </div>

            {/* Key Insights */}
            {healthAnalysis.key_insights && healthAnalysis.key_insights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  Insights Importantes
                </h3>
                <div className="grid gap-3">
                  {healthAnalysis.key_insights.map((insight: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start bg-purple-50 border border-purple-200 rounded-lg p-3"
                    >
                      <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-purple-700">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Care Plan Preview */}
            {healthAnalysis.care_plan_preview && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-green-500" />
                  Prévia do Plano de Cuidados
                </h3>
                <div className="space-y-2">
                  {healthAnalysis.care_plan_preview.map((item: string, index: number) => (
                    <div key={index} className="flex items-start text-sm">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Messages */}
            {healthAnalysis.urgent_alerts && healthAnalysis.urgent_alerts.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Alertas Importantes
                </h3>
                <div className="space-y-2">
                  {healthAnalysis.urgent_alerts.map((alert: string, index: number) => (
                    <div key={index} className="flex items-start text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-red-800 font-medium">{alert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-3">Próximos Passos</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Completar questionário detalhado de saúde</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Gerar plano alimentar personalizado</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Iniciar avaliações de bem-estar</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Configurar lembretes e acompanhamentos</span>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:shadow-lg transition-all"
            >
              <Heart className="w-6 h-6 mr-2" />
              Continuar para Questionário Completo
            </motion.button>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                <strong>Importante:</strong> Esta análise é apenas informativa e não substitui 
                consulta médica profissional. Sempre consulte um médico para avaliação 
                completa e orientações específicas sobre saúde.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ElderlyIdentification;