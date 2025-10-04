-- EXECUTE ESTE SQL NO SEU SUPABASE
-- Vá em: Supabase Dashboard > SQL Editor > Cole este código > Execute

-- Tabelas para o sistema CuidadoAI

-- Tabela de perfis de idosos
CREATE TABLE IF NOT EXISTS elderly_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT CHECK (gender IN ('masculino', 'feminino', 'outro')),
    chronic_conditions TEXT[] DEFAULT '{}',
    medications TEXT[] DEFAULT '{}',
    mobility_level TEXT CHECK (mobility_level IN ('independente', 'assistencia-parcial', 'assistencia-total')),
    cognitive_status TEXT CHECK (cognitive_status IN ('normal', 'leve-declinio', 'moderado-declinio', 'severo-declinio')),
    living_arrangement TEXT CHECK (living_arrangement IN ('sozinho', 'familia', 'cuidador', 'instituicao')),
    emergency_contact JSONB DEFAULT '{}',
    health_goals TEXT[] DEFAULT '{}',
    special_concerns TEXT[] DEFAULT '{}',
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de mensagens de chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_from_companion BOOLEAN DEFAULT FALSE,
    reasoning TEXT,
    message_type TEXT DEFAULT 'text',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de planos de dieta
CREATE TABLE IF NOT EXISTS elderly_diet_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações de bem-estar
CREATE TABLE IF NOT EXISTS wellness_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    assessment_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contatos de emergência
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relationship TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de lembretes de medicação
CREATE TABLE IF NOT EXISTS medication_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    time_of_day TEXT[] NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE elderly_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE elderly_diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para elderly_profiles
CREATE POLICY "Users can view own elderly profiles" ON elderly_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own elderly profiles" ON elderly_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own elderly profiles" ON elderly_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own elderly profiles" ON elderly_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para chat_messages
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para elderly_diet_plans
CREATE POLICY "Users can view own diet plans" ON elderly_diet_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diet plans" ON elderly_diet_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diet plans" ON elderly_diet_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para wellness_assessments
CREATE POLICY "Users can view own wellness assessments" ON wellness_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wellness assessments" ON wellness_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para emergency_contacts
CREATE POLICY "Users can view own emergency contacts" ON emergency_contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency contacts" ON emergency_contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency contacts" ON emergency_contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency contacts" ON emergency_contacts
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para medication_reminders
CREATE POLICY "Users can view own medication reminders" ON medication_reminders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medication reminders" ON medication_reminders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medication reminders" ON medication_reminders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medication reminders" ON medication_reminders
    FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_elderly_profiles_updated_at BEFORE UPDATE ON elderly_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_elderly_diet_plans_updated_at BEFORE UPDATE ON elderly_diet_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
