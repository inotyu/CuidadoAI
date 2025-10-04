import React from 'react';
import { MessageCircle, Heart, Camera, LogOut, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ElderlyProfile } from '../types';

interface DashboardProps {
  profiles: ElderlyProfile[];
  onSelectProfile: (profile: ElderlyProfile) => void;
  onAddNewProfile: () => void;
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profiles, onSelectProfile, onAddNewProfile, onSignOut }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-8 h-8 text-blue-300 opacity-30"
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
          🧓
        </motion.div>
        <motion.div 
          animate={{ 
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 10 }}
          className="absolute bottom-20 left-1/4 w-6 h-6 text-teal-300 opacity-40"
        >
          💊
        </motion.div>
      </div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 p-4 relative z-10"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-500 rounded-full flex items-center justify-center mr-4 shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-7 h-7 text-white" />
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Painel CuidadoAI
              </h1>
              <p className="text-sm text-gray-600">Gerencie seus perfis de cuidado 🧓</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddNewProfile}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Perfil
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSignOut}
              className="p-3 hover:bg-red-50 rounded-full transition-colors group"
            >
              <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <div className="container mx-auto px-4 py-8">
        {profiles.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.h2 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4"
              >
                Seus Perfis de Cuidado
              </motion.h2>
              <div className="text-5xl mb-4 animate-bounce">🧓</div>
              <p className="text-gray-600 text-xl">
                Escolha um perfil para começar a conversar ou gerenciar cuidados
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {profiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden cursor-pointer group border border-white/20"
                  onClick={() => onSelectProfile(profile)}
                >
                  <div className="relative h-56 bg-gradient-to-br from-blue-400 via-green-400 to-teal-400 overflow-hidden">
                    {profile.photo_url ? (
                      <img
                        src={profile.photo_url}
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl text-white/80">
                        🧓
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-10">
                      <motion.span 
                        whileHover={{ scale: 1.1 }}
                        className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/30"
                      >
                        {profile.age} anos
                      </motion.span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        <Heart className="w-6 h-6 text-red-500" />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-blue-600 font-medium text-sm">
                        🏠 {profile.living_arrangement === 'sozinho' ? 'Mora sozinho' : 
                             profile.living_arrangement === 'familia' ? 'Mora com família' :
                             profile.living_arrangement === 'cuidador' ? 'Com cuidador' : 'Institucionalizado'}
                      </p>
                      <p className="text-green-600 font-medium text-sm">
                        🚶 {profile.mobility_level === 'independente' ? 'Independente' :
                             profile.mobility_level === 'assistencia-parcial' ? 'Assistência parcial' : 'Assistência total'}
                      </p>
                      {profile.chronic_conditions && profile.chronic_conditions.length > 0 && (
                        <p className="text-orange-600 font-medium text-sm">
                          💊 {profile.chronic_conditions.length} condição(ões) de saúde
                        </p>
                      )}
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center hover:shadow-lg transition-all duration-300 text-lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-3" />
                      Conversar com {profile.name.split(' ')[0]}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-20"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-8"
            >
              🧓
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6"
            >
              Bem-vindo ao CuidadoAI!
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-600 mb-12 text-xl max-w-md mx-auto"
            >
              Crie seu primeiro perfil para começar a conversar com seu companheiro AI
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddNewProfile}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-12 py-6 rounded-2xl font-bold flex items-center mx-auto hover:shadow-2xl transition-all duration-300 text-xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-8 h-8 text-white" />
              </motion.div>
              <span className="ml-4">Criar Primeiro Perfil</span>
            </motion.button>

            {/* Help section for elderly users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                  <Heart className="w-6 h-6 mr-2 text-blue-500" />
                  Como funciona?
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📋</div>
                    <p><strong>1. Responda</strong><br />algumas perguntas sobre saúde</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">💬</div>
                    <p><strong>2. Converse</strong><br />com seu companheiro AI</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏥</div>
                    <p><strong>3. Receba</strong><br />cuidados personalizados</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;