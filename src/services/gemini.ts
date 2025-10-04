import type { GeminiResponse, ElderlyWellnessScenario } from '../types';

// Google Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Use Gemini to identify pet from uploaded image
export const identifyPet = async (imageBase64: string): Promise<GeminiResponse | null> => {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not configured');
    return null;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this pet image and provide detailed information in JSON format with these exact fields:
              {
                "type": "animal type (dog, cat, bird, etc.)",
                "breed": "specific breed if identifiable",
                "description": "detailed description of the pet",
                "characteristics": ["list", "of", "key", "characteristics"],
                "care_tips": ["list", "of", "care", "tips"]
              }`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to identify pet');
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error identifying pet:', error);
    return null;
  }
};

// Fallback: Generate elderly diet plan with Gemini
export const generateElderlyDietPlanWithGemini = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  medications: string[],
  mobilityLevel: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<any> => {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not configured');
    return null;
  }

  const prompt = `Crie um plano alimentar semanal para ${elderlyName}, ${age} anos.

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
      "ceia": "ceia se necessário",
      "observacoes": "observações diárias"
    },
    "Terça-feira": { "cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "...", "observacoes": "..." },
    "Quarta-feira": { "cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "...", "observacoes": "..." },
    "Quinta-feira": { "cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "...", "observacoes": "..." },
    "Sexta-feira": { "cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "...", "observacoes": "..." },
    "Sábado": { "cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "...", "observacoes": "..." },
    "Domingo": { "cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "...", "observacoes": "..." }
  },
  "diretrizes_nutricionais": ["diretriz 1", "diretriz 2", "diretriz 3"],
  "horarios_refeicoes": "horários recomendados",
  "hidratacao_diaria": "diretrizes de hidratação",
  "cuidados_especiais": ["cuidado especial 1", "cuidado especial 2"],
  "interacoes_medicamentos": "avisos sobre interações",
  "preparo_facil": ["dica de preparo fácil"],
  "emergencia_contato": "quando contatar profissional de saúde"
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Chave da API Gemini inválida ou projeto não configurado. Verifique https://makersuite.google.com/app/apikey');
      } else if (response.status === 403) {
        throw new Error('API Gemini não habilitada. Habilite em https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com');
      } else if (response.status === 429) {
        throw new Error('Limite do Gemini excedido. Aguarde alguns minutos.');
      }
      throw new Error(`Erro na API Gemini: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error generating diet plan with Gemini:', error);
    return null;
  }
};

// Fallback: Generate wellness scenario with Gemini
export const generateElderlyWellnessScenarioWithGemini = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  mobilityLevel: string,
  cognitiveStatus: string,
  livingArrangement: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<ElderlyWellnessScenario | null> => {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key not configured');
    return null;
  }

  const prompt = `Crie um cenário educativo de bem-estar para ${elderlyName}, ${age} anos.

Perfil:
- Condições: ${chronicConditions.join(', ')}
- Mobilidade: ${mobilityLevel}
- Cognição: ${cognitiveStatus}
- Moradia: ${livingArrangement}
- Objetivos: ${healthGoals.join(', ')}
- Preocupações: ${specialConcerns.join(', ')}

Responda APENAS com JSON válido seguindo esta estrutura:
{
  "scenario": "Um cenário detalhado e realista descrevendo uma situação de bem-estar",
  "correct_response": "a melhor resposta para o cenário",
  "response_options": ["resposta correta", "opção plausível mas não ideal 1", "opção plausível mas não ideal 2", "opção claramente errada"],
  "explanation": "explicação detalhada de por que a resposta correta é a melhor, incluindo raciocínio científico e considerações específicas para cuidados geriátricos"
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Chave da API Gemini inválida ou projeto não configurado. Verifique https://makersuite.google.com/app/apikey');
      } else if (response.status === 403) {
        throw new Error('API Gemini não habilitada. Habilite em https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com');
      } else if (response.status === 429) {
        throw new Error('Limite do Gemini excedido. Aguarde alguns minutos.');
      }
      throw new Error(`Erro na API Gemini: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]) as ElderlyWellnessScenario;
  } catch (error) {
    console.error('Error generating wellness scenario with Gemini:', error);
    return null;
  }
};