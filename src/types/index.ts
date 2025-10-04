// Tipos principais para o sistema de cuidados de idosos

// Perfil do idoso
export interface ElderlyProfile {
  id: string;
  name: string;
  age: number;
  gender: 'masculino' | 'feminino' | 'outro';
  chronic_conditions: string[];
  medications: string[];
  mobility_level: 'independente' | 'assistencia-parcial' | 'assistencia-total';
  cognitive_status: 'normal' | 'leve-declinio' | 'moderado-declinio' | 'severo-declinio';
  living_arrangement: 'sozinho' | 'familia' | 'cuidador' | 'instituicao';
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  health_goals: string[];
  special_concerns: string[];
  photo_url?: string;
  user_id?: string;
  created_at: string;
  updated_at?: string;
}

// Análise de saúde gerada por IA
export interface ElderlyHealthAnalysis {
  conditions: Array<{
    name: string;
    severity: 'baixo' | 'moderado' | 'alto';
    description?: string;
  }>;
  risk_factors: string[];
  recommendations: Array<{
    category: string;
    priority: 'alta' | 'média' | 'baixa';
    description: string;
    timeframe?: string;
  }>;
  functional_capacity: {
    mobilidade: 'independente' | 'parcial' | 'dependente';
    cognicao: 'normal' | 'leve' | 'moderado' | 'severo';
    atividades_vida_diaria: 'independente' | 'parcial' | 'dependente';
    socializacao: 'ativa' | 'moderada' | 'limitada';
  };
  summary: string;
  key_insights?: string[];
  care_plan_preview?: string[];
  urgent_alerts?: string[];
  overall_risk_score: number; // 0-100
  confidence_level: number; // 0-100
}

// Mensagens de chat
export interface ChatMessage {
  id: string;
  elderly_profile_id: string;
  user_id?: string;
  message: string;
  is_from_companion: boolean;
  reasoning?: string;
  message_type?: 'text' | 'recommendation' | 'alert' | 'reminder';
  created_at: string;
}

// Conversa completa
export interface ElderlyConversation {
  id: string;
  elderly_profile_id: string;
  messages: ChatMessage[];
  topic: string;
  mood_assessment?: string;
  health_insights?: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Plano de dieta para idosos
export interface ElderlyDietPlan {
  id: string;
  profile_id: string;
  plan_data: {
    weekly_plan: {
      [key: string]: { // Segunda-feira, Terça-feira, etc.
        cafe_da_manha: string;
        lanche_matinal: string;
        almoco: string;
        lanche_vespertino: string;
        jantar: string;
        ceia: string;
        observacoes?: string;
      };
    };
    diretrizes_nutricionais: string[];
    cuidados_especiais: string[];
    horarios_refeicoes: string;
    hidratacao_diaria: string;
    interacoes_medicamentos?: string;
    restricoes_alimentares: string[];
    suplementos_recomendados?: string[];
    monitoramento_peso: string;
    adaptacoes_disfagia?: string;
    calorias_diarias?: number;
    observacoes_gerais?: string;
  };
  created_at: string;
  updated_at: string;
}

// Cenário de bem-estar para avaliações interativas
export interface ElderlyWellnessScenario {
  scenario: string;
  response_options: string[];
  correct_response: string;
  explanation: string;
  category: 'seguranca' | 'nutricao' | 'medicacao' | 'social' | 'mental' | 'fisica';
  difficulty: 'facil' | 'medio' | 'dificil';
  learning_objective: string;
  health_focus?: string[];
}

// Métricas de saúde diárias
export interface ElderlyHealthMetrics {
  id: string;
  profile_id: string;
  date: string;
  weight?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  glucose_level?: number;
  mood_rating: number; // 1-10
  pain_level: number; // 0-10
  sleep_hours: number;
  medication_adherence: boolean;
  activity_level: 'baixo' | 'moderado' | 'alto';
  social_interaction: 'nenhuma' | 'limitada' | 'moderada' | 'alta';
  cognitive_assessment?: number; // 1-10
  notes?: string;
  created_at: string;
}

// Plano de saúde/rotina
export interface HealthPlan {
  id: string;
  elderly_profile_id: string;
  plan_data: {
    daily_routine: {
      morning: string[];
      afternoon: string[];
      evening: string[];
    };
    medication_schedule: Array<{
      medication: string;
      dosage: string;
      times: string[];
      with_food: boolean;
    }>;
    exercise_plan: string[];
    social_activities: string[];
    health_checkpoints: string[];
    emergency_procedures: string[];
    care_notes: string[];
  };
  created_at: string;
  updated_at: string;
}

// Compromissos e lembretes
export interface ElderlyAppointment {
  id: string;
  profile_id: string;
  type: 'medico' | 'exame' | 'terapia' | 'vacina' | 'social' | 'outro';
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  doctor_name?: string;
  specialty?: string;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado' | 'remarcado';
  reminder_sent: boolean;
  notes?: string;
  created_at: string;
}

// Medicamentos
export interface ElderlyMedication {
  id: string;
  profile_id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  start_date: string;
  end_date?: string;
  prescribing_doctor: string;
  purpose: string;
  side_effects?: string[];
  interactions?: string[];
  is_active: boolean;
  adherence_tracking: boolean;
  notes?: string;
  created_at: string;
}

// Contatos de emergência
export interface ElderlyEmergencyContact {
  id: string;
  profile_id: string;
  name: string;
  relationship: string;
  phone_primary: string;
  phone_secondary?: string;
  email?: string;
  address?: string;
  is_primary: boolean;
  can_make_medical_decisions: boolean;
  availability_notes?: string;
  created_at: string;
}

// Resultados de avaliações
export interface ElderlyAssessmentResult {
  id: string;
  profile_id: string;
  assessment_type: 'cognitivo' | 'funcional' | 'nutricional' | 'psicologico' | 'social' | 'fisico';
  score: number;
  max_score: number;
  percentage: number;
  interpretation: string;
  recommendations: string[];
  conducted_by: string;
  assessment_date: string;
  next_assessment_due?: string;
  notes?: string;
  created_at: string;
}

// Alertas de cuidados
export interface ElderlyCareAlert {
  id: string;
  profile_id: string;
  type: 'medicacao' | 'consulta' | 'emergencia' | 'monitoramento' | 'social' | 'nutricao';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  title: string;
  message: string;
  created_at: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved: boolean;
  resolved_at?: string;
  actions_taken?: string[];
  follow_up_needed?: boolean;
}

// Membros da família com acesso
export interface ElderlyFamilyMember {
  id: string;
  profile_id: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  access_level: 'visualizacao' | 'edicao' | 'completo';
  can_receive_alerts: boolean;
  preferred_contact_method: 'email' | 'sms' | 'telefone' | 'app';
  is_active: boolean;
  created_at: string;
}

// Objetivos de bem-estar
export interface ElderlyWellnessGoal {
  id: string;
  profile_id: string;
  category: 'fisica' | 'mental' | 'social' | 'nutricional' | 'medica' | 'pessoal';
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  is_active: boolean;
  progress_history: Array<{
    date: string;
    value: number;
    notes?: string;
  }>;
  created_at: string;
}

// Log de atividades
export interface ElderlyActivityLog {
  id: string;
  profile_id: string;
  activity_type: 'exercicio' | 'social' | 'mental' | 'lazer' | 'autocuidado' | 'medicacao';
  description: string;
  duration_minutes: number;
  intensity?: 'baixa' | 'moderada' | 'alta';
  enjoyment_rating?: number; // 1-5
  completed_at: string;
  notes?: string;
  created_at: string;
}

// Estado da aplicação principal
export interface AppState {
  currentProfile: ElderlyProfile | null;
  profiles: ElderlyProfile[];
  chatMessages: ChatMessage[];
  healthPlan?: HealthPlan;
  dietPlan?: ElderlyDietPlan;
  isLoading: boolean;
  user_id?: string;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  error?: string;
}

// Tipos para serviços de IA
export interface AIAnalysisRequest {
  profile: ElderlyProfile;
  recent_metrics?: ElderlyHealthMetrics[];
  conversation_history?: ChatMessage[];
  context?: string;
}

export interface AIRecommendation {
  category: string;
  recommendation: string;
  priority: 'alta' | 'média' | 'baixa';
  rationale: string;
  timeframe: string;
  resources?: string[];
}

export interface AIResponse {
  response: string;
  reasoning: string;
  mood_assessment?: string;
  health_insights?: string[];
  recommendations?: AIRecommendation[];
}

// Tipos para relatórios e dashboards
export interface ElderlyHealthReport {
  profile_id: string;
  period: string;
  metrics_summary: {
    average_mood: number;
    average_pain: number;
    medication_adherence_rate: number;
    activity_frequency: number;
    social_engagement: number;
  };
  trends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
  recommendations: AIRecommendation[];
  generated_at: string;
}

// Configurações do usuário
export interface UserSettings {
  user_id: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  emergency_contact_info: {
    name: string;
    phone: string;
    relationship: string;
  };
  privacy_settings: {
    share_data_for_research: boolean;
    allow_family_access: boolean;
  };
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

// Tipos para integrações externas
export interface MedicalIntegration {
  provider: string;
  api_key: string;
  sync_enabled: boolean;
  last_sync: string;
  sync_frequency: 'daily' | 'weekly' | 'monthly';
}

// Tipos para dados de sensores (se aplicável)
export interface SensorData {
  profile_id: string;
  sensor_type: 'heart_rate' | 'blood_pressure' | 'glucose' | 'activity' | 'sleep';
  value: number;
  unit: string;
  timestamp: string;
  device_id?: string;
}

// Constantes e enums
export const CHRONIC_CONDITIONS = [
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
] as const;

export const HEALTH_GOALS = [
  'Manter independência',
  'Melhorar mobilidade',
  'Controlar dor',
  'Manter memória',
  'Melhorar sono',
  'Manter peso saudável',
  'Socializar mais',
  'Reduzir medicamentos'
] as const;

export const SPECIAL_CONCERNS = [
  'Risco de quedas',
  'Isolamento social',
  'Problemas de memória',
  'Dificuldade para dormir',
  'Perda de apetite',
  'Dor crônica',
  'Mudanças de humor',
  'Dificuldade com medicamentos'
] as const;