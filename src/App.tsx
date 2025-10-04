import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import ElderlyLandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import ElderlyHealthQuestionnaire from './components/HealthQuestionnaire';
import ElderlyIdentification from './components/ElderlyIdentification';
import ElderlyRegistration from './components/ElderlyRegistration';
import ChatInterface from './components/ChatInterface';
import ElderlyDietPlanComponent from './components/DietPlan';
import Dashboard from './components/Dashboard';
import ElderlyWellnessMood from './components/ElderlyWellness';

// Services
import { createElderlyCompanionPersona, chatWithElderlyCompanion } from './services/openai';
import { 
  saveElderlyProfile, 
  getElderlyProfiles, 
  saveChatMessage, 
  getChatMessages, 
  getElderlyDietPlan,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  supabase
} from './services/supabase';

// Types
import type { 
  ElderlyProfile, 
  ElderlyHealthAnalysis, 
  ChatMessage, 
  ElderlyDietPlan 
} from './types';

// App flow steps for elderly care system
type AppStep = 'landing' | 'auth' | 'dashboard' | 'questionnaire' | 'identify' | 'register' | 'chat' | 'diet' | 'wellness';

interface ChatHistory {
  role: string;
  content: string;
}

function App() {
  // Main app state
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false); // COMEÇA COMO FALSE!
  
  // Health analysis flow
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [healthAnalysis, setHealthAnalysis] = useState<ElderlyHealthAnalysis | null>(null);
  
  // Profile data
  const [elderlyProfiles, setElderlyProfiles] = useState<ElderlyProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<ElderlyProfile | null>(null);
  
  // Chat functionality
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentDietPlan, setCurrentDietPlan] = useState<ElderlyDietPlan | null>(null);

  // Persist current step so users don't lose their place on refresh
  useEffect(() => {
    if (currentStep !== 'landing' && currentStep !== 'auth') {
      localStorage.setItem('cuidadoai-current-step', currentStep);
    }
  }, [currentStep]);

  // Keep track of which profile the user is currently interacting with
  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('cuidadoai-current-profile', JSON.stringify(currentProfile));
    } else {
      localStorage.removeItem('cuidadoai-current-profile');
    }
  }, [currentProfile]);

  // Inicialização simples - sem fallbacks desnecessários
  useEffect(() => {
    console.log('🚀 App inicializado - authLoading já é false por padrão');
  }, []);

  // Handle authentication and app initialization - SUPER SIMPLIFICADO
  useEffect(() => {
    console.log('🚀 Iniciando aplicação...');
    
    // NÃO FAZ NADA QUE POSSA TRAVAR - apenas configura listener
    let subscription: any;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth change:', event, !!session?.user);
          
          if (session?.user) {
            console.log('✅ Usuário autenticado:', session.user.id);
            setUser(session.user);
            setAuthLoading(false);
            
            // NÃO vai direto para dashboard - deixa loadUserProfiles decidir
            console.log('🔄 Carregando perfis para decidir próximo step...');
            loadUserProfiles(true, session.user).catch(console.error);
          } else {
            console.log('❌ Usuário não autenticado');
            setUser(null);
            setAuthLoading(false);
            setCurrentStep('landing');
          }
        }
      );
      subscription = data.subscription;
      console.log('✅ Listener de auth configurado');
    } catch (error) {
      console.error('❌ Erro ao configurar listener de auth:', error);
      // Garante que mesmo com erro, saia do loading
      setAuthLoading(false);
      setCurrentStep('landing');
    }

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('❌ Erro ao desinscrever listener:', error);
        }
      }
    };
  }, []); // Executa apenas uma vez


  const loadUserProfiles = async (forceStepChange = false, currentUser = user) => {
    try {
      console.log('Loading user profiles from Supabase...');
      
      if (!currentUser) {
        console.log('No user authenticated, skipping profile load');
        return;
      }
      
      console.log('✅ User confirmed for profile loading:', currentUser.id);
      
      // Adiciona timeout para evitar travamento
      const profilesPromise = getElderlyProfiles();
      const timeoutPromise = new Promise<ElderlyProfile[]>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout loading profiles')), 5000);
      });
      
      const fetchedProfiles = await Promise.race([profilesPromise, timeoutPromise]);
      console.log('Fetched profiles from Supabase:', fetchedProfiles.length);
      
      setElderlyProfiles(fetchedProfiles);
      
      // SEMPRE força mudança de step quando chamado após auth
      if (forceStepChange || currentStep === 'landing' || currentStep === 'auth') {
        const savedStep = localStorage.getItem('cuidadoai-current-step') as AppStep;
        const savedProfile = localStorage.getItem('cuidadoai-current-profile');
        
        if (savedStep && savedProfile && fetchedProfiles.length > 0) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            const profileExists = fetchedProfiles.find(profile => profile.id === parsedProfile.id);
            if (profileExists) {
              setCurrentProfile(parsedProfile);
              setCurrentStep(savedStep);
              console.log('✅ Restored previous state:', savedStep, parsedProfile.name);
              return;
            }
          } catch (error) {
            console.error('Error parsing saved profile:', error);
          }
        }
        
        if (fetchedProfiles.length > 0) {
          console.log('✅ User has profiles, going to dashboard');
          setCurrentStep('dashboard');
        } else {
          console.log('✅ User has no profiles, going to questionnaire');
          setCurrentStep('questionnaire');
        }
      }
    } catch (error) {
      console.error('Error loading user profiles:', error);
      // Se der erro, assume que não tem perfis e vai para questionário
      console.log('❌ Error loading profiles, going to questionnaire');
      setCurrentStep('questionnaire');
    }
  };

  const handleSelectProfile = async (profile: ElderlyProfile) => {
    setCurrentProfile(profile);
    await loadChatMessages(profile.id);
    await loadDietPlan(profile.id);
    setCurrentStep('chat');
  };

  const handleAddNewProfile = () => {
    setCurrentStep('questionnaire');
  };

  const handleSignUp = async (email: string, password: string) => {
    setAuthLoading(true);
    
    // Timeout de segurança para GARANTIR que saia do loading
    const safetyTimeout = setTimeout(() => {
      console.log('🚨 TIMEOUT DE SEGURANÇA: Forçando saída do authLoading');
      setAuthLoading(false);
      setCurrentStep('questionnaire'); // Força ir para questionário se der problema
    }, 10000); // 10 segundos
    
    try {
      console.log('💾 Iniciando cadastro no Supabase para:', email);
      
      // Adiciona timeout para evitar travamento
      const signupPromise = signUp(email, password);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tempo limite excedido para cadastro')), 8000);
      });
      
      const result = await Promise.race([signupPromise, timeoutPromise]);
      console.log('✅ Cadastro no Supabase concluído');
      
      // Limpa o timeout de segurança
      clearTimeout(safetyTimeout);
      
      // Verifica se o usuário foi criado e está autenticado
      if (result) {
        console.log('🔍 Verificando se usuário está autenticado após cadastro...');
        
        // Aguarda um pouco para o listener processar
        setTimeout(async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              console.log('✅ Usuário autenticado após cadastro:', user.id);
              setUser(user);
              setAuthLoading(false);
              
              // Força ir para questionário (usuário novo)
              console.log('🎯 Forçando ir para questionário (usuário novo)');
              setCurrentStep('questionnaire');
            } else {
              console.log('❌ Usuário não autenticado após cadastro - provavelmente precisa confirmar email');
              console.log('🎯 FORÇANDO ir para questionário mesmo sem autenticação');
              
              // Força sair do loading e ir para questionário
              setAuthLoading(false);
              setCurrentStep('questionnaire');
              
              // Limpa o timeout de segurança já que resolvemos manualmente
              clearTimeout(safetyTimeout);
            }
          } catch (error) {
            console.error('❌ Erro ao verificar usuário após cadastro:', error);
            // O timeout de segurança vai resolver
          }
        }, 2000); // Aguarda 2 segundos
      }
    } catch (error) {
      console.error('❌ Erro no handleSignUp:', error);
      clearTimeout(safetyTimeout);
      setAuthLoading(false);
      alert('Erro no cadastro: ' + (error as Error).message);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    
    // Timeout de segurança para GARANTIR que saia do loading
    const safetyTimeout = setTimeout(() => {
      console.log('🚨 TIMEOUT DE SEGURANÇA LOGIN: Forçando saída do authLoading');
      setAuthLoading(false);
      setCurrentStep('landing'); // Volta para landing se der problema
    }, 10000); // 10 segundos
    
    try {
      console.log('💾 Iniciando login no Supabase para:', email);
      
      // Adiciona timeout para evitar travamento
      const signinPromise = signIn(email, password);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tempo limite excedido para login')), 8000);
      });
      
      await Promise.race([signinPromise, timeoutPromise]);
      console.log('✅ Login no Supabase concluído');
      
      // Limpa o timeout de segurança
      clearTimeout(safetyTimeout);
      
      // O listener de auth vai capturar a mudança e definir o usuário
      // Mas se não funcionar, o timeout de segurança resolve
    } catch (error) {
      console.error('❌ Erro no handleSignIn:', error);
      clearTimeout(safetyTimeout);
      setAuthLoading(false);
      alert('Erro no login: ' + (error as Error).message);
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('cuidadoai-current-step');
      localStorage.removeItem('cuidadoai-current-profile');
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const loadChatMessages = async (profileId: string) => {
    const messages = await getChatMessages(profileId);
    setChatMessages(messages);
    
    const history: ChatHistory[] = messages.map(msg => ({
      role: msg.is_from_companion ? 'assistant' : 'user',
      content: msg.message
    }));
    setChatHistory(history);
  };

  const loadDietPlan = async (profileId: string) => {
    try {
      const dietPlan = await getElderlyDietPlan(profileId);
      setCurrentDietPlan(dietPlan);
    } catch (error) {
      console.error('Error loading diet plan:', error);
    }
  };

  const handleQuestionnaireComplete = async (profileData: ElderlyProfile) => {
    setIsLoading(true);
    try {
      // In a real app, you might want to analyze the questionnaire data
      // For now, we'll create a mock health analysis
      const mockHealthAnalysis: ElderlyHealthAnalysis = {
        conditions: profileData.chronic_conditions.map((condition: string) => ({
          name: condition,
          severity: 'moderado' as const,
          confidence: 'medium' as const
        })),
        risk_factors: profileData.special_concerns || [],
        functional_capacity: {
          mobilidade: profileData.mobility_level === 'independente' ? 'independente' : 'parcial',
          cognicao: profileData.cognitive_status === 'normal' ? 'normal' : 'leve',
          atividades_vida_diaria: 'independente',
          socializacao: 'ativa'
        },
        recommendations: [
          {
            category: 'Atividade Física',
            description: 'Exercícios leves regulares adaptados às condições',
            priority: 'alta' as const
          },
          {
            category: 'Nutrição',
            description: 'Dieta balanceada com foco nas necessidades específicas',
            priority: 'média' as const
          }
        ],
        overall_risk_score: 35,
        confidence_level: 85,
        summary: `Perfil de saúde geral mostrando ${profileData.chronic_conditions.length} condições identificadas com nível de risco moderado.`,
        key_insights: [
          'Manter rotina de exercícios adequada à idade',
          'Monitorar regularmente as condições crônicas'
        ],
        urgent_alerts: [],
        care_plan_preview: [
          'Consultas médicas regulares',
          'Exercícios físicos adaptados',
          'Alimentação balanceada'
        ]
      };

      setHealthAnalysis(mockHealthAnalysis);
      setCurrentStep('identify');
    } catch (error) {
      console.error('Error processing questionnaire:', error);
      alert('Erro ao processar questionário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToRegistration = () => {
    setCurrentStep('register');
  };

  const handleSaveProfile = async (name: string) => {
    console.log('🔥 handleSaveProfile called with name:', name);
    console.log('🔥 healthAnalysis:', healthAnalysis);
    console.log('🔥 current user:', user);
    
    if (!healthAnalysis) {
      console.error('❌ No health analysis found!');
      alert('Erro: Análise de saúde não encontrada. Tente refazer o questionário.');
      return;
    }

    if (!name || !name.trim()) {
      console.error('❌ No name provided!');
      alert('Por favor, digite um nome.');
      return;
    }

    if (!user) {
      console.log('⚠️ Usuário não autenticado - tentando obter usuário atual...');
      
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          console.log('✅ Usuário encontrado:', currentUser.id);
          setUser(currentUser);
        } else {
          console.error('❌ Nenhum usuário encontrado - não é possível salvar perfil');
          alert('Erro: É necessário estar logado para salvar o perfil. Faça login novamente.');
          setCurrentStep('auth');
          return;
        }
      } catch (error) {
        console.error('❌ Erro ao obter usuário:', error);
        alert('Erro: Não foi possível verificar autenticação. Faça login novamente.');
        setCurrentStep('auth');
        return;
      }
    }

    setIsLoading(true);
    console.log('🔄 Starting profile creation...');
    
    try {
      console.log('💾 Using Supabase database - user authenticated:', user?.id);
      
      // Cria perfil no Supabase com nomes corretos das colunas (snake_case)
      const newProfile: any = {
        name: name.trim(),
        age: 70,
        gender: 'outro',
        chronic_conditions: healthAnalysis.conditions?.map(c => c.name) || [], // underscore
        medications: [],
        mobility_level: 'independente', // underscore
        cognitive_status: 'normal', // underscore
        living_arrangement: 'familia', // underscore
        emergency_contact: { // underscore
          name: 'Contato de Emergência',
          phone: '(11) 99999-9999',
          relationship: 'Familiar'
        },
        health_goals: ['Manter independência'], // underscore
        special_concerns: healthAnalysis.risk_factors || [] // underscore
      };

      console.log('📝 Saving profile to Supabase...');
      const savedProfile = await saveElderlyProfile(newProfile);
      
      if (!savedProfile) {
        throw new Error('Falha ao salvar no banco de dados');
      }

      console.log('✅ Profile saved to Supabase:', savedProfile);
      
      setElderlyProfiles(prev => [savedProfile, ...prev]);
      setCurrentProfile(savedProfile);
      
      // Cria mensagem inicial no banco
      const greeting = `Olá ${name}! É um prazer conhecê-lo(a). Sou seu companheiro de cuidados e estou aqui para ajudar com sua saúde e bem-estar. Como posso ajudá-lo(a) hoje?`;
      
      console.log('💬 Saving initial chat message...');
      await saveChatMessage({
        elderly_profile_id: savedProfile.id,
        message: greeting,
        is_from_companion: true
      });

      console.log('📨 Loading chat messages...');
      await loadChatMessages(savedProfile.id);
      
      setCurrentStep('dashboard');
      console.log('✅ Navigating to dashboard');
      
      // Reset state
      setCapturedImage('');
      setHealthAnalysis(null);
      
      console.log('🎉 Profile creation completed successfully!');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      alert('Erro ao salvar perfil: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
      console.log('🔄 Loading state reset');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentProfile) return;
    if (!user) {
      alert('Erro: Usuário não autenticado');
      return;
    }

    console.log('💬 Sending message:', message);
    console.log('💾 Using Supabase database for chat');
    
    try {
      // Salva mensagem do usuário no banco
      const userMessage = await saveChatMessage({
        elderly_profile_id: currentProfile.id,
        message,
        is_from_companion: false
      });

      if (userMessage) {
        setChatMessages(prev => [...prev, userMessage]);
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);

        // Gera resposta da IA (pode usar OpenAI se configurado)
        const responses = [
          `Obrigado por compartilhar isso comigo, ${currentProfile.name}. Como você está se sentindo hoje?`,
          `Entendo sua preocupação. É importante manter uma rotina saudável. Você tem feito seus exercícios regulares?`,
          `Isso é muito bom! Continue assim. Lembre-se de beber bastante água e descansar bem.`,
          `Vou anotar essa informação. É sempre bom conversar sobre como você está se sentindo.`,
          `${currentProfile.name}, que bom saber disso! Manter-se ativo é fundamental para o bem-estar.`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Salva resposta da IA no banco
        setTimeout(async () => {
          const aiMessage = await saveChatMessage({
            elderly_profile_id: currentProfile.id,
            message: randomResponse,
            is_from_companion: true
          });

          if (aiMessage) {
            setChatMessages(prev => [...prev, aiMessage]);
            setChatHistory(prev => [...prev, { role: 'assistant', content: randomResponse }]);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert('Erro ao enviar mensagem: ' + (error as Error).message);
    }
  };

  const handleShowDietPlan = () => {
    setCurrentStep('diet');
  };

  const handleShowWellnessMood = () => {
    setCurrentStep('wellness');
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handleBackToChat = async () => {
    if (currentProfile) {
      await loadDietPlan(currentProfile.id);
    }
    setCurrentStep('chat');
  };

  const handleGetStarted = () => {
    setCurrentStep('auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Carregando CuidadoAI...</p>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <ElderlyLandingPage
            onGetStarted={handleGetStarted}
          />
        );
        
      case 'auth':
        return (
          <AuthForm
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            isLoading={authLoading}
          />
        );
        
      case 'dashboard':
        return (
          <Dashboard
            profiles={elderlyProfiles}
            onSelectProfile={handleSelectProfile}
            onAddNewProfile={handleAddNewProfile}
            onSignOut={handleSignOut}
          />
        );
        
      case 'questionnaire':
        return (
          <ElderlyHealthQuestionnaire 
            onComplete={handleQuestionnaireComplete}
            onBack={elderlyProfiles.length > 0 ? handleBackToDashboard : undefined}
            isLoading={isLoading}
          />
        );
      
      case 'identify':
        return healthAnalysis && (
          <ElderlyIdentification
            healthAnalysis={healthAnalysis}
            profilePhoto={capturedImage}
            onContinue={handleContinueToRegistration}
          />
        );
      
      case 'register':
        return healthAnalysis && (
          <ElderlyRegistration
            healthAnalysis={healthAnalysis}
            profilePhoto={capturedImage}
            onSave={handleSaveProfile}
            isLoading={isLoading}
          />
        );
      
      case 'chat':
        return currentProfile && (
          <ChatInterface
            profile={currentProfile}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onBack={handleBackToDashboard}
            onShowHealthPlan={handleShowDietPlan}
            onShowWellnessMood={handleShowWellnessMood}
            isLoading={isLoading}
          />
        );
      
      case 'diet':
        return currentProfile && (
          <ElderlyDietPlanComponent
            profile={currentProfile}
            onBack={handleBackToDashboard}
            onDietPlanUpdated={(dietPlan) => setCurrentDietPlan(dietPlan)}
            onShowChat={handleBackToChat}
            onShowWellnessMood={handleShowWellnessMood}
          />
        );
      
      case 'wellness':
        return currentProfile && (
          <ElderlyWellnessMood
            profile={currentProfile}
            onBack={handleBackToDashboard}
            onShowChat={handleBackToChat}
            onShowDietPlan={handleShowDietPlan}
          />
        );
      
      default:
        return null;
    }
  };

  if (currentStep === 'landing' || currentStep === 'auth' || currentStep === 'dashboard' || 
      currentStep === 'chat' || currentStep === 'diet' || currentStep === 'wellness') {
    return renderCurrentStep();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            CuidadoAI 🧓
          </h1>
          <p className="text-gray-600">
            Plataforma inteligente de cuidados para idosos
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">
                {currentStep === 'questionnaire' ? 'Processando questionário...' : 'Salvando perfil...'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;