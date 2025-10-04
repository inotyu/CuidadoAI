import React, { useState } from 'react';
import { User, Heart, Calendar, Activity, Brain, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ElderlyProfile } from '../types';

interface QuestionnaireProps {
  onComplete: (profile: ElderlyProfile) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const ElderlyHealthQuestionnaire: React.FC<QuestionnaireProps> = ({ 
  onComplete, 
  onBack, 
  isLoading 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showValidationError, setShowValidationError] = useState(false);
  const [profile, setProfile] = useState<Partial<ElderlyProfile>>({
    chronic_conditions: [],
    medications: [],
    health_goals: [],
    special_concerns: [],
    emergency_contact: { name: '', phone: '', relationship: '' }
  });

  const totalSteps = 8;

  const chronic_conditionsOptions = [
    'Hipertensão',
    'Diabetes',
    'Doença Cardíaca',
    'Artrite',
    'Osteoporose',
    'Depressão/Ansiedade',
    'Demência/Alzheimer',
    'Doença Pulmonar',
    'Doença Renal',
    'Nenhuma condição crônica'
  ];

  const health_goalsOptions = [
    'Manter independência',
    'Melhorar mobilidade',
    'Controlar dor',
    'Manter memória',
    'Melhorar sono',
    'Manter peso saudável',
    'Socializar mais',
    'Reduzir medicamentos'
  ];

  const special_concernsOptions = [
    'Risco de quedas',
    'Isolamento social',
    'Problemas de memória',
    'Dificuldade para dormir',
    'Perda de apetite',
    'Dor crônica',
    'Mudanças de humor',
    'Dificuldade com medicamentos'
  ];

  // Validação específica para cada etapa
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Informações básicas
        return !!(profile.name && profile.age && profile.gender);
      case 1: // Condições de saúde
        return !!(profile.chronic_conditions && profile.chronic_conditions.length > 0);
      case 2: // Nível de mobilidade
        return !!profile.mobility_level;
      case 3: // Estado cognitivo
        return !!profile.cognitive_status;
      case 4: // Arranjo de moradia
        return !!profile.living_arrangement;
      case 5: // Contato de emergência
        return !!(profile.emergency_contact?.name && 
                 profile.emergency_contact?.phone && 
                 profile.emergency_contact?.relationship);
      case 6: // Objetivos de saúde
        return !!(profile.health_goals && profile.health_goals.length > 0);
      case 7: // Preocupações especiais (opcional)
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(currentStep + 1);
      setShowValidationError(false); // Reset error when moving to next step
    } else {
      setShowValidationError(true); // Show error only when user tries to advance
      // Scroll to top to show validation message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowValidationError(false); // Reset error when going back
    }
  };

  const handleComplete = () => {
    if (isValidProfile()) {
      onComplete(profile as ElderlyProfile);
    }
  };

  const isValidProfile = () => {
    return profile.name && 
           profile.age && 
           profile.gender && 
           profile.mobility_level && 
           profile.cognitive_status && 
           profile.living_arrangement;
  };

  const updateProfile = (key: keyof ElderlyProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: keyof ElderlyProfile, item: string) => {
    const currentArray = (profile[key] as string[]) || [];
    if (currentArray.includes(item)) {
      updateProfile(key, currentArray.filter(i => i !== item));
    } else {
      updateProfile(key, [...currentArray, item]);
    }
  };

  const getStepValidationMessage = () => {
    if (isStepValid()) return null;
    
    switch (currentStep) {
      case 0:
        return "Por favor, preencha todos os campos obrigatórios";
      case 1:
        return "Selecione pelo menos uma condição de saúde (ou 'Nenhuma condição crônica')";
      case 2:
        return "Selecione o nível de mobilidade";
      case 3:
        return "Selecione o estado cognitivo";
      case 4:
        return "Selecione o arranjo de moradia";
      case 5:
        return "Preencha todas as informações do contato de emergência";
      case 6:
        return "Selecione pelo menos um objetivo de saúde";
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Informações Básicas</h2>
              <p className="text-gray-600">Vamos começar com algumas informações pessoais</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    profile.name ? 'border-gray-200 focus:border-blue-500' : 'border-red-300 focus:border-red-500'
                  }`}
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade *
                </label>
                <input
                  type="number"
                  min="60"
                  max="120"
                  value={profile.age || ''}
                  onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    profile.age ? 'border-gray-200 focus:border-blue-500' : 'border-red-300 focus:border-red-500'
                  }`}
                  placeholder="Digite a idade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['masculino', 'feminino', 'outro'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => updateProfile('gender', gender)}
                      className={`p-3 rounded-xl border-2 transition-all capitalize ${
                        profile.gender === gender
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Condições de Saúde</h2>
              <p className="text-gray-600">Selecione todas as condições que se aplicam *</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {chronic_conditionsOptions.map((condition) => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => toggleArrayItem('chronic_conditions', condition)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    profile.chronic_conditions?.includes(condition)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center">
                    {profile.chronic_conditions?.includes(condition) && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm">{condition}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Nível de Mobilidade</h2>
              <p className="text-gray-600">Como você descreveria a capacidade de movimento *</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'independente', label: 'Independente', desc: 'Move-se sem ajuda' },
                { value: 'assistencia-parcial', label: 'Assistência Parcial', desc: 'Precisa de ajuda ocasional' },
                { value: 'assistencia-total', label: 'Assistência Total', desc: 'Precisa de ajuda constante' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateProfile('mobility_level', option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    profile.mobility_level === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Estado Cognitivo</h2>
              <p className="text-gray-600">Como está a memória e capacidade mental *</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'normal', label: 'Normal', desc: 'Memória e raciocínio normais' },
                { value: 'leve-declinio', label: 'Declínio Leve', desc: 'Pequenos lapsos de memória' },
                { value: 'moderado-declinio', label: 'Declínio Moderado', desc: 'Dificuldades mais evidentes' },
                { value: 'severo-declinio', label: 'Declínio Severo', desc: 'Necessita supervisão constante' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateProfile('cognitive_status', option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    profile.cognitive_status === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Arranjo de Moradia</h2>
              <p className="text-gray-600">Com quem você mora atualmente *</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'sozinho', label: 'Mora Sozinho', desc: 'Vive independentemente' },
                { value: 'familia', label: 'Com a Família', desc: 'Mora com familiares' },
                { value: 'cuidador', label: 'Com Cuidador', desc: 'Tem cuidador domiciliar' },
                { value: 'instituicao', label: 'Instituição', desc: 'Casa de repouso ou similar' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateProfile('living_arrangement', option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    profile.living_arrangement === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Contato de Emergência</h2>
              <p className="text-gray-600">Informações de uma pessoa para contato *</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do contato *
                </label>
                <input
                  type="text"
                  value={profile.emergency_contact?.name || ''}
                  onChange={(e) => updateProfile('emergency_contact', { 
                    ...profile.emergency_contact, 
                    name: e.target.value 
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    profile.emergency_contact?.name ? 'border-gray-200 focus:border-blue-500' : 'border-red-300 focus:border-red-500'
                  }`}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={profile.emergency_contact?.phone || ''}
                  onChange={(e) => updateProfile('emergency_contact', { 
                    ...profile.emergency_contact, 
                    phone: e.target.value 
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    profile.emergency_contact?.phone ? 'border-gray-200 focus:border-blue-500' : 'border-red-300 focus:border-red-500'
                  }`}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relacionamento *
                </label>
                <select
                  value={profile.emergency_contact?.relationship || ''}
                  onChange={(e) => updateProfile('emergency_contact', { 
                    ...profile.emergency_contact, 
                    relationship: e.target.value 
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    profile.emergency_contact?.relationship ? 'border-gray-200 focus:border-blue-500' : 'border-red-300 focus:border-red-500'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="filho">Filho(a)</option>
                  <option value="conjuge">Cônjuge</option>
                  <option value="irmao">Irmão(ã)</option>
                  <option value="sobrinho">Sobrinho(a)</option>
                  <option value="amigo">Amigo(a)</option>
                  <option value="cuidador">Cuidador</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Objetivos de Saúde</h2>
              <p className="text-gray-600">O que você gostaria de melhorar ou manter *</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {health_goalsOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleArrayItem('health_goals', goal)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    profile.health_goals?.includes(goal)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center">
                    {profile.health_goals?.includes(goal) && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm">{goal}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Preocupações Especiais</h2>
              <p className="text-gray-600">Áreas que requerem atenção especial (opcional)</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {special_concernsOptions.map((concern) => (
                <button
                  key={concern}
                  type="button"
                  onClick={() => toggleArrayItem('special_concerns', concern)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    profile.special_concerns?.includes(concern)
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  <div className="flex items-center">
                    {profile.special_concerns?.includes(concern) && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm">{concern}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {onBack && currentStep === 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="mb-8 flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </motion.button>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Etapa {currentStep + 1} de {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Content */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        layout
      >
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </motion.div>

      {/* Validation Message */}
      {showValidationError && !isStepValid() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center"
        >
          {getStepValidationMessage()}
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: currentStep > 0 ? 1.05 : 1 }}
          whileTap={{ scale: currentStep > 0 ? 0.95 : 1 }}
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center transition-all ${
            currentStep > 0
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Anterior
        </motion.button>

        {currentStep < totalSteps - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold flex items-center hover:shadow-lg transition-all"
          >
            Próximo
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: isValidProfile() ? 1.05 : 1 }}
            whileTap={{ scale: isValidProfile() ? 0.95 : 1 }}
            onClick={handleComplete}
            disabled={!isValidProfile() || isLoading}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center transition-all ${
              isValidProfile() && !isLoading
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2" />
            )}
            {isLoading ? 'Processando...' : 'Finalizar'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ElderlyHealthQuestionnaire;