import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import type { 
  ElderlyProfile, 
  ElderlyHealthAnalysis, 
  ElderlyDietPlan, 
  ChatMessage 
} from '../types';

// Supabase config - using env vars for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('🔄 Iniciando cadastro no Supabase para:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erro do Supabase no cadastro:', error);
      throw error;
    }
    
    console.log('✅ Cadastro no Supabase bem-sucedido:', data.user?.id);
    return data.user;
  } catch (error) {
    console.error('❌ Erro geral no cadastro:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('🔄 Iniciando login no Supabase para:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erro do Supabase no login:', error);
      throw error;
    }
    
    console.log('✅ Login no Supabase bem-sucedido:', data.user?.id);
    return data.user;
  } catch (error) {
    console.error('❌ Erro geral no login:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    console.log('🔍 Verificando usuário atual...');
    
    // Timeout mais agressivo para evitar travamento
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Auth timeout')), 1500); // Reduzido para 1.5s
    });

    const authPromise = supabase.auth.getUser();
    
    const { data: { user } } = await Promise.race([authPromise, timeoutPromise]);
    
    if (user) {
      console.log('✅ Usuário encontrado:', user.id);
    } else {
      console.log('❌ Nenhum usuário autenticado');
    }
    
    return user;
  } catch (error) {
    if (error instanceof Error && error.message === 'Auth timeout') {
      console.warn('⚠️ Timeout na verificação de usuário - assumindo sem login');
    } else {
      console.error('❌ Erro ao verificar usuário:', error);
    }
    return null;
  }
};

// Elderly profile photo upload
export const uploadElderlyProfileImage = async (
  file: File, 
  profileId: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${profileId}-${Date.now()}.${fileExt}`;
    const filePath = `elderly-profiles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return null;
  }
};

// Save elderly profile
export const saveElderlyProfile = async (
  profile: Omit<ElderlyProfile, 'id' | 'created_at'>
): Promise<ElderlyProfile | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('elderly_profiles')
      .insert([{ ...profile, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving elderly profile:', error);
    return null;
  }
};

// Get elderly profiles for current user
export const getElderlyProfiles = async (): Promise<ElderlyProfile[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('No user found when fetching elderly profiles');
      return [];
    }

    console.log('Fetching elderly profiles for user:', user.id);

    const { data, error } = await supabase
      .from('elderly_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log('Elderly profiles query result:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching elderly profiles:', error);
    return [];
  }
};

// Update elderly profile
export const updateElderlyProfile = async (
  profileId: string,
  updates: Partial<ElderlyProfile>
): Promise<ElderlyProfile | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('elderly_profiles')
      .update(updates)
      .eq('id', profileId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating elderly profile:', error);
    return null;
  }
};

// Delete elderly profile
export const deleteElderlyProfile = async (profileId: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('elderly_profiles')
      .delete()
      .eq('id', profileId)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting elderly profile:', error);
    return false;
  }
};

// Save health analysis
export const saveHealthAnalysis = async (
  analysis: Omit<ElderlyHealthAnalysis, 'id' | 'created_at'> & { elderly_profile_id: string }
): Promise<ElderlyHealthAnalysis | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('health_analyses')
      .insert([{ ...analysis, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving health analysis:', error);
    return null;
  }
};

// Get latest health analysis for profile
export const getHealthAnalysis = async (
  elderlyProfileId: string
): Promise<ElderlyHealthAnalysis | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('health_analyses')
      .select('*')
      .eq('elderly_profile_id', elderlyProfileId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching health analysis:', error);
    return null;
  }
};

// Save chat message
export const saveChatMessage = async (
  message: Omit<ChatMessage, 'id' | 'created_at'>
): Promise<ChatMessage | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{ ...message, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return null;
  }
};

// Get chat messages for elderly profile
export const getChatMessages = async (
  elderlyProfileId: string
): Promise<ChatMessage[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('elderly_profile_id', elderlyProfileId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};

// Save elderly diet plan
export const saveElderlyDietPlan = async (
  dietPlan: {
    elderly_profile_id: string;
    plan_data: any;
  }
): Promise<ElderlyDietPlan | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Check if a diet plan already exists for this profile
    const existingPlan = await getElderlyDietPlan(dietPlan.elderly_profile_id);
    
    if (existingPlan) {
      // Update existing plan
      const { data, error } = await supabase
        .from('elderly_diet_plans')
        .update({ plan_data: dietPlan.plan_data })
        .eq('elderly_profile_id', dietPlan.elderly_profile_id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new plan
      const { data, error } = await supabase
        .from('elderly_diet_plans')
        .insert([{ 
          elderly_profile_id: dietPlan.elderly_profile_id,
          plan_data: dietPlan.plan_data,
          user_id: user.id 
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving elderly diet plan:', error);
    return null;
  }
};

// Get elderly diet plan
export const getElderlyDietPlan = async (
  elderlyProfileId: string
): Promise<ElderlyDietPlan | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('elderly_diet_plans')
      .select('*')
      .eq('elderly_profile_id', elderlyProfileId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching elderly diet plan:', error);
    return null;
  }
};

// Save wellness assessment results
export const saveWellnessAssessment = async (
  assessment: {
    elderly_profile_id: string;
    score: number;
    total_questions: number;
    assessment_data: any;
  }
): Promise<any> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('wellness_assessments')
      .insert([{ ...assessment, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving wellness assessment:', error);
    return null;
  }
};

// Get wellness assessment history
export const getWellnessAssessments = async (
  elderlyProfileId: string,
  limit = 10
): Promise<any[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('wellness_assessments')
      .select('*')
      .eq('elderly_profile_id', elderlyProfileId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching wellness assessments:', error);
    return [];
  }
};

// Save emergency contact
export const saveEmergencyContact = async (
  contact: {
    elderly_profile_id: string;
    name: string;
    phone: string;
    relationship: string;
    is_primary: boolean;
  }
): Promise<any> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert([{ ...contact, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving emergency contact:', error);
    return null;
  }
};

// Get emergency contacts for profile
export const getEmergencyContacts = async (
  elderlyProfileId: string
): Promise<any[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('elderly_profile_id', elderlyProfileId)
      .eq('user_id', user.id)
      .order('is_primary', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    return [];
  }
};

// Save medication reminders
export const saveMedicationReminder = async (
  reminder: {
    elderly_profile_id: string;
    medication_name: string;
    dosage: string;
    frequency: string;
    time_of_day: string[];
    notes?: string;
    is_active: boolean;
  }
): Promise<any> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('medication_reminders')
      .insert([{ ...reminder, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving medication reminder:', error);
    return null;
  }
};

// Get active medication reminders
export const getMedicationReminders = async (
  elderlyProfileId: string
): Promise<any[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('medication_reminders')
      .select('*')
      .eq('elderly_profile_id', elderlyProfileId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching medication reminders:', error);
    return [];
  }
};