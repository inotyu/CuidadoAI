// APIs GRATUITAS que funcionam online
import type { ElderlyWellnessScenario } from '../types';

// Groq - IA GRATUITA e RÁPIDA (70 req/min)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Cohere - IA GRATUITA (100 req/min)
const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

// Groq - Mais rápida que OpenAI e GRATUITA
export const generateElderlyDietPlanWithGroq = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  medications: string[],
  mobilityLevel: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<any> => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }

  const prompt = `Crie um plano alimentar semanal em JSON para ${elderlyName}, ${age} anos.

Perfil de Saúde:
- Condições crônicas: ${chronicConditions.join(', ')}
- Medicamentos: ${medications.join(', ')}
- Mobilidade: ${mobilityLevel}
- Objetivos: ${healthGoals.join(', ')}
- Preocupações: ${specialConcerns.join(', ')}

Responda APENAS com JSON válido seguindo esta estrutura:
{
  "weekly_plan": {
    "Segunda-feira": {
      "cafe_da_manha": "café da manhã detalhado com porções",
      "lanche_matinal": "lanche matinal",
      "almoco": "almoço detalhado com porções",
      "lanche_vespertino": "lanche vespertino",
      "jantar": "jantar detalhado com porções",
      "ceia": "ceia se necessário"
    },
    "Terça-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Quarta-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Quinta-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Sexta-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Sábado": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Domingo": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."}
  },
  "diretrizes_nutricionais": ["diretriz 1", "diretriz 2", "diretriz 3"],
  "horarios_refeicoes": "horários recomendados",
  "hidratacao_diaria": "diretrizes de hidratação",
  "cuidados_especiais": ["cuidado especial 1", "cuidado especial 2"]
}`;

  try {
    // Tentando Groq silenciosamente
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'Você é um nutricionista geriátrico especializado. Responda apenas com JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Limite do Groq excedido. Aguarde alguns minutos.');
      } else if (response.status === 401) {
        throw new Error('Chave da API Groq inválida. Obtenha em: https://console.groq.com/keys');
      }
      throw new Error(`Groq error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from Groq');
    }

    // Extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Groq response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ Groq falhou:', error);
    throw error;
  }
};

// Groq para cenários de bem-estar
export const generateElderlyWellnessScenarioWithGroq = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  mobilityLevel: string,
  cognitiveStatus: string,
  livingArrangement: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<ElderlyWellnessScenario | null> => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key not configured');
  }

  const prompt = `Crie um cenário educativo de bem-estar em JSON para ${elderlyName}, ${age} anos.

Perfil:
- Condições: ${chronicConditions.join(', ')}
- Mobilidade: ${mobilityLevel}
- Cognição: ${cognitiveStatus}
- Moradia: ${livingArrangement}
- Objetivos: ${healthGoals.join(', ')}
- Preocupações: ${specialConcerns.join(', ')}

Responda APENAS com JSON válido:
{
  "scenario": "Um cenário detalhado e realista descrevendo uma situação de bem-estar",
  "correct_response": "a melhor resposta para o cenário",
  "response_options": ["resposta correta", "opção plausível mas não ideal 1", "opção plausível mas não ideal 2", "opção claramente errada"],
  "explanation": "explicação detalhada de por que a resposta correta é a melhor"
}`;

  try {
    // Tentando Groq para cenário silenciosamente
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em cuidados geriátricos. Responda apenas com JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`Groq error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Groq response');
    }

    return JSON.parse(jsonMatch[0]) as ElderlyWellnessScenario;
  } catch (error) {
    console.error('❌ Groq falhou para cenário:', error);
    throw error;
  }
};

// Instruções para obter chaves gratuitas
export const getFreeAPIInstructions = (): string => {
  return `
🆓 APIs GRATUITAS para usar ONLINE:

1. 🚀 GROQ (RECOMENDADO):
   - Site: https://console.groq.com/keys
   - Limite: 70 requisições/minuto
   - Velocidade: 3x mais rápido que OpenAI
   - Gratuito: Sim, sem cartão

2. 🤖 COHERE:
   - Site: https://dashboard.cohere.ai/api-keys
   - Limite: 100 requisições/minuto
   - Gratuito: Sim, sem cartão

3. 🔮 GEMINI:
   - Site: https://makersuite.google.com/app/apikey
   - Limite: 15 requisições/minuto
   - Gratuito: Sim, sem cartão

ORDEM DE PRIORIDADE ONLINE:
1. Groq (mais rápido e generoso)
2. Gemini (confiável)
3. Cohere (backup)
4. Plano básico (sempre funciona)
  `;
};
