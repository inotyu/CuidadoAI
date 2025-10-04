import React from 'react';
import { Heart, MessageCircle, ClipboardList, Brain, ArrowRight, Shield, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ElderlyLandingPageProps {
  onGetStarted: () => void;
}

const ElderlyLandingPage: React.FC<ElderlyLandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Floating background elements - healthcare themed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-8 h-8 text-blue-300 opacity-30"
        >
          🏥
        </motion.div>
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute top-32 right-20 w-8 h-8 text-green-300 opacity-30"
        >
          👨‍⚕️
        </motion.div>
        <motion.div 
          animate={{ 
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 10 }}
          className="absolute bottom-20 left-1/4 w-6 h-6 text-purple-300 opacity-40"
        >
          💊
        </motion.div>
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 7 }}
          className="absolute bottom-40 right-1/3 w-5 h-5 text-red-300 opacity-35"
        >
          🩺
        </motion.div>
        
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute top-60 left-1/3 w-6 h-6 text-orange-300 opacity-40"
        >
          👥
        </motion.div>
        <motion.div 
          animate={{ 
            x: [0, -60, 0],
            y: [0, 40, 0],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 8 }}
          className="absolute top-80 right-1/4 w-7 h-7 text-emerald-300 opacity-35"
        >
          🏠
        </motion.div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="flex items-center"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CuidadoAI
            </span>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
          >
            Começar
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Cuidado Inteligente
                </span>
                <br />
                <span className="text-gray-800">Para Toda Vida</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
              >
                Plataforma completa de cuidados para idosos com IA personalizada. 
                Avaliação de saúde, planos nutricionais, conversas inteligentes e monitoramento de bem-estar.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <ClipboardList className="w-6 h-6 mr-3" />
                  Começar Avaliação
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Saiba Mais
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500"
              >
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-500" />
                  <span>Dados Seguros</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-blue-500" />
                  <span>Profissionais Qualificados</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  <span>Cuidado Personalizado</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              {/* Main Phone Mockup */}
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", bounce: 0.4 }}
                className="relative mx-auto w-80 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Phone Screen Content */}
                <div className="absolute inset-4 bg-white rounded-2xl overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-400 rounded-full mr-3 flex items-center justify-center text-white text-sm">
                        👤
                      </div>
                      <div>
                        <div className="h-2 bg-gray-300 rounded w-20 mb-1"></div>
                        <div className="h-1 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl px-3 py-2 max-w-48 shadow-sm">
                          <div className="flex items-center mb-1">
                            <span className="text-xs mr-1">🏥</span>
                            <div className="h-2 bg-gray-300 rounded w-28"></div>
                          </div>
                          <div className="h-1 bg-gray-200 rounded w-24"></div>
                          <div className="h-1 bg-gray-200 rounded w-20 mt-1"></div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl px-3 py-2 max-w-32 shadow-sm">
                          <div className="h-2 bg-white/80 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl px-3 py-2 max-w-40 shadow-sm">
                          <div className="flex items-center mb-1">
                            <span className="text-xs mr-1">💊</span>
                            <div className="h-2 bg-gray-300 rounded w-24"></div>
                          </div>
                          <div className="h-1 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl px-3 py-2 max-w-28 shadow-sm">
                          <div className="h-2 bg-white/80 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Health Dashboard Preview */}
                    <div className="mt-4 bg-white/60 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-1 bg-green-300 rounded w-12"></div>
                        <div className="h-1 bg-blue-300 rounded w-8"></div>
                        <div className="h-1 bg-purple-300 rounded w-10"></div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="h-8 bg-green-200 rounded flex-1"></div>
                        <div className="h-8 bg-blue-200 rounded flex-1"></div>
                        <div className="h-8 bg-purple-200 rounded flex-1"></div>
                      </div>
                    </div>
                    
                    {/* Health icon in corner */}
                    <div className="absolute bottom-4 right-4 text-2xl opacity-60">
                      🩺
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements - Healthcare themed */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg text-2xl"
              >
                🏥
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-lg text-xl"
              >
                👥
              </motion.div>

              <motion.div
                animate={{ 
                  x: [0, 15, 0],
                  y: [0, -8, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-8 left-1/2 w-10 h-10 bg-red-400 rounded-full flex items-center justify-center shadow-lg text-lg"
              >
                💊
              </motion.div>

              <motion.div
                animate={{ 
                  x: [0, -12, 0],
                  y: [0, 6, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-8 right-1/3 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center shadow-lg text-sm"
              >
                🩺
              </motion.div>

              <motion.div
                animate={{ 
                  x: [0, 8, 0],
                  y: [0, -12, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{ duration: 2.8, repeat: Infinity, delay: 2 }}
                className="absolute top-1/2 -left-6 w-9 h-9 bg-orange-400 rounded-full flex items-center justify-center shadow-lg text-sm"
              >
                🏠
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="relative z-10 py-16 px-6"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Por Que Famílias Confiam no CuidadoAI
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tecnologia avançada para cuidados personalizados e bem-estar integral
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ClipboardList,
                emoji: "📋",
                title: "Avaliação Completa",
                description: "Complete um questionário detalhado e nossa IA criará um perfil de saúde personalizado com recomendações específicas."
              },
              {
                icon: MessageCircle,
                emoji: "💬",
                title: "Companheiro Inteligente",
                description: "Converse com seu assistente AI que compreende suas necessidades e oferece suporte empático 24/7."
              },
              {
                icon: Brain,
                emoji: "🧠",
                title: "Cuidado Personalizado",
                description: "Receba planos nutricionais, avaliações de bem-estar e orientações adaptadas às suas condições de saúde."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Healthcare icon in corner */}
                <div className="absolute top-4 right-4 text-2xl opacity-20">
                  {index === 0 ? "🏥" : index === 1 ? "👨‍⚕️" : "💊"}
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                  <div className="absolute -top-1 -right-1 text-lg">
                    {feature.emoji}
                  </div>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="relative z-10 py-12 px-6"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "98%", label: "Satisfação dos Usuários", icon: "❤️" },
                { number: "24/7", label: "Suporte Disponível", icon: "🏥" },
                { number: "50+", label: "Condições Monitoradas", icon: "📊" },
                { number: "100%", label: "Privacidade Garantida", icon: "🔒" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="relative z-10 py-16 px-6"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6 }}
            className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl shadow-2xl p-12 text-white relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 text-4xl">🏥</div>
              <div className="absolute top-8 right-8 text-3xl">💊</div>
              <div className="absolute bottom-4 left-8 text-3xl">👥</div>
              <div className="absolute bottom-8 right-4 text-4xl">🩺</div>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 relative z-10">
              Pronto para Começar sua Jornada de Cuidados?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto relative z-10">
              Junte-se a milhares de famílias que já confiam no CuidadoAI para cuidados personalizados e inteligentes.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="bg-white text-blue-600 px-12 py-4 rounded-2xl font-bold text-xl hover:shadow-xl transition-all duration-300 inline-flex items-center relative z-10"
            >
              <Activity className="w-6 h-6 mr-3" />
              Iniciar Avaliação Gratuita
            </motion.button>
            
            <p className="text-sm opacity-75 mt-4 relative z-10">
              Sem compromisso • Dados 100% seguros • Suporte especializado
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="relative z-10 bg-white/50 backdrop-blur-sm border-t border-white/20 py-8 px-6"
      >
        <div className="container mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center mb-4"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CuidadoAI
            </span>
          </motion.div>
          <p className="text-gray-600 text-sm mb-2">
            © 2025 CuidadoAI. Todos os direitos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Desenvolvido com cuidado para cuidadores, famílias e profissionais de saúde.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default ElderlyLandingPage;