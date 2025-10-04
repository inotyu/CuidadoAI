// Hugging Face Inference API - Alternativa gratuita
const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;
const HF_BASE_URL = 'https://api-inference.huggingface.co/models';

// Modelos disponíveis (gratuitos)
const HF_MODELS = {
  TEXT_GENERATION: 'microsoft/DialoGPT-large',
  LLAMA: 'meta-llama/Llama-2-7b-chat-hf',
  MISTRAL: 'mistralai/Mistral-7B-Instruct-v0.2',
  PHI: 'microsoft/phi-2',
  FALCON: 'tiiuae/falcon-7b-instruct'
};

// Gerar plano de dieta com Hugging Face
export const generateElderlyDietPlanWithHuggingFace = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  medications: string[],
  mobilityLevel: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<any> => {
  if (!HF_API_KEY) {
    throw new Error('Hugging Face API key not configured');
  }

  const prompt = `Create a weekly diet plan in JSON format for ${elderlyName}, age ${age}.

Health Profile:
- Chronic conditions: ${chronicConditions.join(', ')}
- Medications: ${medications.join(', ')}
- Mobility: ${mobilityLevel}
- Health goals: ${healthGoals.join(', ')}
- Special concerns: ${specialConcerns.join(', ')}

Respond with valid JSON:
{
  "weekly_plan": {
    "Monday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
    "Tuesday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
    "Wednesday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
    "Thursday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
    "Friday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
    "Saturday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
    "Sunday": {"breakfast": "...", "lunch": "...", "dinner": "..."}
  },
  "nutritional_guidelines": ["guideline 1", "guideline 2"],
  "daily_hydration": "hydration guidelines",
  "special_care": ["care 1", "care 2"]
}`;

  try {
    // Tentando Hugging Face silenciosamente
    const response = await fetch(`${HF_BASE_URL}/${HF_MODELS.PHI}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error('Modelo Hugging Face carregando. Aguarde alguns segundos.');
      } else if (response.status === 429) {
        throw new Error('Limite Hugging Face excedido. Aguarde alguns minutos.');
      } else if (response.status === 401) {
        throw new Error('Chave Hugging Face inválida. Obtenha em: https://huggingface.co/settings/tokens');
      }
      throw new Error(`Hugging Face error: ${response.status}`);
    }

    const data = await response.json();
    const content = data[0]?.generated_text || data.generated_text || '';
    
    if (!content) {
      throw new Error('No response from Hugging Face');
    }

    // Extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Hugging Face response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ Hugging Face falhou:', error);
    throw error;
  }
};

// Gerar plano de dieta simples (sem IA)
export const generateSimpleDietPlan = (
  elderlyName: string,
  age: number,
  conditions: string[]
): any => {
  console.log('📋 Gerando plano básico sem IA...');
  
  const hasDiabetes = conditions.some(c => c.toLowerCase().includes('diabetes'));
  const hasHypertension = conditions.some(c => c.toLowerCase().includes('hipertensão'));
  
  return {
    weekly_plan: {
      "Segunda-feira": {
        "breakfast": hasDiabetes ? "Aveia com canela e chá sem açúcar" : "Pão integral com queijo branco e suco natural",
        "lunch": "Arroz integral, feijão, peixe grelhado e salada",
        "dinner": "Sopa de legumes e frango grelhado"
      },
      "Terça-feira": {
        "breakfast": hasDiabetes ? "Iogurte natural com sementes" : "Tapioca com queijo e café",
        "lunch": "Macarrão integral com molho de tomate e carne magra",
        "dinner": "Omelete com legumes e arroz"
      },
      "Quarta-feira": {
        "breakfast": hasDiabetes ? "Salada de frutas sem açúcar" : "Vitamina de frutas naturais",
        "lunch": "Salmão assado com batata doce e brócolis",
        "dinner": "Ensopado de legumes com carne magra"
      },
      "Quinta-feira": {
        "breakfast": hasDiabetes ? "Pão integral com abacate" : "Pão francês com manteiga e café",
        "lunch": "Frango grelhado com quinoa e salada",
        "dinner": "Sopa de feijão com legumes"
      },
      "Sexta-feira": {
        "breakfast": hasDiabetes ? "Iogurte com nozes" : "Torradas com geleia natural e chá",
        "lunch": "Carne moída com legumes e arroz integral",
        "dinner": "Peixe assado com purê de batata"
      },
      "Sábado": {
        "breakfast": hasDiabetes ? "Omelete com espinafre" : "Bolo simples com café",
        "lunch": "Churrasco de frango com salada",
        "dinner": "Lasanha de legumes"
      },
      "Domingo": {
        "breakfast": hasDiabetes ? "Salada de frutas" : "Pão de queijo e suco natural",
        "lunch": "Feijoada leve com laranja",
        "dinner": "Strogonoff de frango com arroz"
      }
    },
    nutritional_guidelines: hasDiabetes ? [
      "Controlar carboidratos",
      "Preferir alimentos de baixo índice glicêmico",
      "Evitar açúcares simples",
      "Fazer refeições regulares"
    ] : hasHypertension ? [
      "Reduzir sódio",
      "Aumentar potássio",
      "Evitar alimentos processados",
      "Controlar peso"
    ] : [
      "Dieta balanceada",
      "Frutas e vegetais diários",
      "Proteínas magras",
      "Hidratação adequada"
    ],
    daily_hydration: "2 a 3 litros de água por dia",
    special_care: hasDiabetes ? [
      "Monitorar glicemia",
      "Levar sempre um lanche",
      "Evitar pular refeições"
    ] : hasHypertension ? [
      "Monitorar pressão arterial",
      "Evitar alimentos salgados",
      "Praticar atividade física leve"
    ] : [
      "Atividade física regular",
      "Exames médicos periódicos",
      "Bom descanso noturno"
    ]
  };
};
