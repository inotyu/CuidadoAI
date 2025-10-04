import React, { useState } from 'react';
import { Mail, Lock, User, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSignIn, onSignUp, isLoading }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      // Tentando autenticação silenciosamente
      
      if (isSignUp) {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
      
      // Autenticação realizada com sucesso
    } catch (err: any) {
      // Erro na autenticação
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Falha na autenticação. Tente novamente.';
      
      if (err.message) {
        if (err.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (err.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = 'Verifique seu email e clique no link de confirmação.';
        } else if (err.message.includes('timeout') || err.message.includes('network')) {
          errorMessage = 'Problema de conexão. Verifique sua internet e tente novamente.';
        } else if (err.message.includes('Auth timeout')) {
          errorMessage = 'Tempo limite excedido. Verifique sua conexão e tente novamente.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements - healthcare themed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">🏥</div>
        <div className="absolute top-40 right-20 text-5xl opacity-15 animate-bounce" style={{ animationDelay: '1s' }}>👨‍⚕️</div>
        <div className="absolute bottom-32 left-1/4 text-4xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}>💊</div>
        <div className="absolute bottom-20 right-1/3 text-5xl opacity-15 animate-bounce" style={{ animationDelay: '0.5s' }}>🩺</div>
        <div className="absolute top-60 left-1/3 text-4xl opacity-10 animate-pulse" style={{ animationDelay: '3s' }}>👥</div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-6 shadow-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3"
          >
            Bem-vindo ao CuidadoAI! 
          </motion.h1>
          <div className="text-4xl mb-4 animate-bounce">🧓</div>
          <p className="text-gray-600">
            {isSignUp ? 'Crie sua conta para começar os cuidados personalizados' : 'Entre para acessar sua plataforma de cuidados inteligentes'}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Endereço de Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:scale-105"
                  placeholder="Digite seu email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 focus:shadow-lg focus:scale-105"
                  placeholder="Digite sua senha"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                  <span>
                    {isSignUp ? 'Criando conta...' : 'Entrando...'}
                  </span>
                </div>
              ) : (
                <>
                  <User className="w-6 h-6 mr-3" />
                  {isSignUp ? 'Criar Conta' : 'Entrar'}
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
              disabled={isLoading}
            >
              {isSignUp 
                ? 'Já tem uma conta? Entre aqui' 
                : "Não tem uma conta? Cadastre-se"
              }
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthForm;