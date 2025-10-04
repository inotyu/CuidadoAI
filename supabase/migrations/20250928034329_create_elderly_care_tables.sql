-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela principal de perfis de idosos
CREATE TABLE elderly_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 120),
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

-- 2. Tabela de análises de saúde
CREATE TABLE health_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE NOT NULL,
    conditions JSONB DEFAULT '[]',
    risk_factors TEXT[] DEFAULT '{}',
    functional_capacity JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    overall_risk_score INTEGER DEFAULT 0 CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
    summary TEXT,
    key_insights TEXT[] DEFAULT '{}',
    urgent_alerts TEXT[] DEFAULT '{}',
    care_plan_preview TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de mensagens de chat
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    is_from_companion BOOLEAN DEFAULT FALSE,
    reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de planos alimentares
CREATE TABLE elderly_diet_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE NOT NULL,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de avaliações de bem-estar
CREATE TABLE wellness_assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0),
    total_questions INTEGER NOT NULL CHECK (total_questions > 0),
    assessment_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de contatos de emergência
CREATE TABLE emergency_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    relationship TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de lembretes de medicação
CREATE TABLE medication_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    elderly_profile_id UUID REFERENCES elderly_profiles(id) ON DELETE CASCADE NOT NULL,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    time_of_day TEXT[] DEFAULT '{}',
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_elderly_profiles_user_id ON elderly_profiles(user_id);
CREATE INDEX idx_elderly_profiles_created_at ON elderly_profiles(created_at DESC);

CREATE INDEX idx_health_analyses_elderly_profile_id ON health_analyses(elderly_profile_id);
CREATE INDEX idx_health_analyses_created_at ON health_analyses(created_at DESC);

CREATE INDEX idx_chat_messages_elderly_profile_id ON chat_messages(elderly_profile_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at ASC);

CREATE INDEX idx_elderly_diet_plans_elderly_profile_id ON elderly_diet_plans(elderly_profile_id);
CREATE INDEX idx_wellness_assessments_elderly_profile_id ON wellness_assessments(elderly_profile_id);
CREATE INDEX idx_emergency_contacts_elderly_profile_id ON emergency_contacts(elderly_profile_id);
CREATE INDEX idx_medication_reminders_elderly_profile_id ON medication_reminders(elderly_profile_id);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_elderly_profiles_updated_at 
    BEFORE UPDATE ON elderly_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_elderly_diet_plans_updated_at 
    BEFORE UPDATE ON elderly_diet_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medication_reminders_updated_at 
    BEFORE UPDATE ON medication_reminders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE elderly_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE elderly_diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;

-- Políticas para elderly_profiles
CREATE POLICY "Users can view their own elderly profiles" ON elderly_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own elderly profiles" ON elderly_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own elderly profiles" ON elderly_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own elderly profiles" ON elderly_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para health_analyses
CREATE POLICY "Users can view their own health analyses" ON health_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health analyses" ON health_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para chat_messages
CREATE POLICY "Users can view their own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para elderly_diet_plans
CREATE POLICY "Users can view their own diet plans" ON elderly_diet_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diet plans" ON elderly_diet_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diet plans" ON elderly_diet_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para wellness_assessments
CREATE POLICY "Users can view their own wellness assessments" ON wellness_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness assessments" ON wellness_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para emergency_contacts
CREATE POLICY "Users can view their own emergency contacts" ON emergency_contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emergency contacts" ON emergency_contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency contacts" ON emergency_contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emergency contacts" ON emergency_contacts
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para medication_reminders
CREATE POLICY "Users can view their own medication reminders" ON medication_reminders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medication reminders" ON medication_reminders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication reminders" ON medication_reminders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication reminders" ON medication_reminders
    FOR DELETE USING (auth.uid() = user_id);