# 🧓 CuidadoAI - Plataforma de Cuidados para Idosos

Plataforma moderna de cuidados para idosos com inteligência artificial, ajudando famílias e cuidadores a proporcionar o melhor acompanhamento para a terceira idade.

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura](#-estrutura)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

CuidadoAI é uma plataforma completa que oferece:

- **Acompanhamento de Saúde**: Monitoramento inteligente da saúde dos idosos
- **Avaliações Geriátricas**: Questionários especializados para identificar necessidades
- **Planos de Cuidados**: Recomendações personalizadas baseadas no perfil de saúde
- **Assistente IA**: Companheiro virtual especializado em cuidados geriátricos

## ✨ Funcionalidades

- 🏥 **Avaliação de Saúde**: Questionários detalhados para detectar condições crônicas
- 🍎 **Planos Nutricionais**: Dieta personalizada para necessidades específicas da terceira idade
- 💊 **Controle de Medicamentos**: Histórico e lembretes de tratamentos
- � **Análise de Bem-Estar**: Avaliação de humor e qualidade de vida
- 🤖 **Assistente IA Especializado**: Chatbot treinado em geriatria
- 📋 **Gestão de Perfis**: Múltiplos perfis de idosos por cuidador

## 🛠 Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **IA**: OpenAI GPT, Google Gemini
- **Ícones**: Lucide React

## 🚀 Instalação

```bash
# Clonar
git clone https://github.com/inotyu/pawmyy.git
cd pawmyy

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Iniciar desenvolvimento
npm run dev
```

## ⚙️ Configuração

Configure as variáveis em `.env.local`:

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
VITE_OPENAI_API_KEY=sua_chave_openai
VITE_GEMINI_API_KEY=sua_chave_gemini
```

## 📁 Estrutura

```
src/
├── components/    # Componentes React
├── services/      # Integrações de API
├── types/         # Definições TypeScript
└── App.tsx       # Aplicação principal
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Add nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Pull Request

---

**Feito com ❤️ para idosos e seus cuidadores**
