import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Heart, Utensils, AlertCircle, Sparkles, MessageCircle, Brain, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateElderlyDietPlan } from '../services/openai';
import { saveElderlyDietPlan, getElderlyDietPlan } from '../services/supabase';
import type { ElderlyProfile, ElderlyDietPlan } from '../types';

interface DietPlanProps {
  profile: ElderlyProfile;
  onBack: () => void;
  onDietPlanUpdated?: (dietPlan: ElderlyDietPlan) => void;
  onShowChat?: () => void;
  onShowWellnessMood?: () => void;
}

const ElderlyDietPlanComponent: React.FC<DietPlanProps> = ({ 
  profile, 
  onBack, 
  onDietPlanUpdated, 
  onShowChat, 
  onShowWellnessMood 
}) => {
  const [dietPlan, setDietPlan] = useState<ElderlyDietPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Segunda-feira');
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  useEffect(() => {
    loadExistingDietPlan();
  }, [profile.id]);

  const loadExistingDietPlan = async () => {
    setIsLoading(true);
    try {
      // Use the proper UUID identifier for the profile
      const existingPlan = await getElderlyDietPlan(profile.id);
      setDietPlan(existingPlan);
      if (existingPlan && onDietPlanUpdated) {
        onDietPlanUpdated(existingPlan);
      }
    } catch (error) {
      console.error('Error loading diet plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDietPlan = async () => {
    setIsGenerating(true);
    try {
      const planData = await generateElderlyDietPlan(
        profile.name,
        profile.age,
        profile.chronic_conditions,
        profile.medications || [],
        profile.mobility_level,
        profile.health_goals,
        profile.special_concerns || []
      );

      if (planData) {
        const newDietPlan = await saveElderlyDietPlan({
          elderly_profile_id: profile.id, // Use proper UUID
          plan_data: planData
        });

        if (newDietPlan) {
          setDietPlan(newDietPlan);
          if (onDietPlanUpdated) {
            onDietPlanUpdated(newDietPlan);
          }
        }
      } else {
        alert('Falha ao gerar plano alimentar. Tente novamente.');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      alert('Erro ao gerar plano alimentar. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Carregando plano alimentar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200 p-4"
      >
        <div className="container mx-auto flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </motion.button>
          
          <div className="flex items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 mr-4 ring-2 ring-blue-200 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Plano Alimentar - {profile.name}</h2>
              <p className="text-sm text-gray-600">{profile.age} anos • Nutrição saudável</p>
            </div>
          </div>
          
          <Utensils className="w-6 h-6 text-blue-500" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl">
          {!dietPlan ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Utensils className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Gerar Plano Alimentar para {profile.name}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Criar um plano alimentar personalizado considerando as condições de saúde, medicamentos e objetivos de {profile.name}.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateDietPlan}
                disabled={isGenerating}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                ) : (
                  <Sparkles className="w-5 h-5 mr-2" />
                )}
                {isGenerating ? 'Gerando Plano...' : 'Gerar Plano Alimentar'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Day Selector */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-blue-500" />
                  Cronograma Semanal
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDay(day)}
                      className={`p-3 rounded-lg text-xs font-medium transition-all ${
                        selectedDay === day
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Daily Plan */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDay}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Refeições - {selectedDay}
                  </h3>
                  
                  {dietPlan.plan_data?.weekly_plan?.[selectedDay] && (
                    <div className="space-y-4">
                      {['cafe_da_manha', 'lanche_matinal', 'almoco', 'lanche_vespertino', 'jantar', 'ceia'].map((meal, index) => {
                        const mealNames = {
                          cafe_da_manha: 'Café da Manhã',
                          lanche_matinal: 'Lanche Matinal', 
                          almoco: 'Almoço',
                          lanche_vespertino: 'Lanche Vespertino',
                          jantar: 'Jantar',
                          ceia: 'Ceia'
                        };
                        
                        const mealData = dietPlan.plan_data.weekly_plan[selectedDay][meal as keyof typeof mealNames];
                        if (!mealData) return null;
                        
                        return (
                          <div key={meal} className="border-l-4 border-blue-200 pl-4 bg-blue-50 rounded-r-lg p-3">
                            <h4 className="font-semibold text-gray-700 mb-1 flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-blue-500" />
                              {mealNames[meal as keyof typeof mealNames]}
                            </h4>
                            <p className="text-gray-600 text-sm mb-2">
                              {mealData}
                            </p>
                            {index < 2 && (
                              <p className="text-xs text-blue-600 font-medium">
                                💡 Horário recomendado: {index === 0 ? '7h-8h' : '10h-10h30'}
                              </p>
                            )}
                          </div>
                        );
                      })}
                      
                      {dietPlan.plan_data?.weekly_plan?.[selectedDay]?.observacoes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Observações do Dia</p>
                              <p className="text-sm text-yellow-700">
                                {dietPlan.plan_data?.weekly_plan?.[selectedDay]?.observacoes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Guidelines */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Diretrizes Nutricionais
                  </h3>
                  <ul className="space-y-2">
                    {dietPlan.plan_data?.diretrizes_nutricionais?.map((diretriz: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        {diretriz}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
                    Cuidados Especiais
                  </h3>
                  <ul className="space-y-2">
                    {dietPlan.plan_data?.cuidados_especiais?.map((cuidado: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        {cuidado}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Horários das Refeições</h3>
                  <p className="text-gray-600 text-sm">{dietPlan.plan_data?.horarios_refeicoes || 'Não especificado'}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Hidratação Diária</h3>
                  <p className="text-gray-600 text-sm">{dietPlan.plan_data?.hidratacao_diaria || 'Não especificado'}</p>
                </div>
              </div>

              {/* Medications Interactions */}
              {dietPlan.plan_data?.interacoes_medicamentos && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                    Interações com Medicamentos
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-800">{dietPlan.plan_data.interacoes_medicamentos}</p>
                  </div>
                </div>
              )}

              {/* Regenerate Button */}
              <div className="text-center pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerateDietPlan}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Novo Plano'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg relative z-10">
        <div className="flex justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-white/20 max-w-sm w-full">
            <div className="grid grid-cols-3 gap-2">
              {/* Chat Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowChat}
                className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-600 rounded-2xl px-4 py-3 flex flex-col items-center justify-center hover:bg-purple-50 transition-all shadow-md relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-1"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold text-xs">Chat</span>
                
                <motion.div
                  animate={{ 
                    y: [0, -1, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -top-1 -right-1 text-sm opacity-70"
                >
                  💬
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  className="absolute inset-0 bg-purple-400 rounded-2xl"
                />
              </motion.button>

              {/* Diet Plan Button - Active */}
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl px-4 py-3 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                  />
                  
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <Utensils className="w-5 h-5 mb-1" />
                  </motion.div>
                  <span className="font-semibold text-xs relative z-10">Nutrição</span>
                  
                  <motion.div
                    animate={{ 
                      y: [0, -2, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute -top-1 -right-1 text-lg"
                  >
                    🍽️
                  </motion.div>
                </div>
              </motion.div>

              {/* Wellness Mood Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShowWellnessMood}
                className="bg-white/80 backdrop-blur-sm border-2 border-green-200 text-green-600 rounded-2xl px-4 py-3 flex flex-col items-center justify-center hover:bg-green-50 transition-all shadow-md relative overflow-hidden group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  animate={{ 
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-1"
                >
                  <Brain className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold text-xs">Bem-estar</span>
                
                <motion.div
                  animate={{ 
                    y: [0, -2, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                  className="absolute -top-1 -right-1 text-sm opacity-70"
                >
                  🧠
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 0.1 }}
                  className="absolute inset-0 bg-green-400 rounded-2xl"
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElderlyDietPlanComponent;