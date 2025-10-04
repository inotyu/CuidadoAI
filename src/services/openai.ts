import type { 
  AIResponse, 
  ElderlyHealthAnalysis, 
  ElderlyWellnessScenario
} from '../types';
import { 
  generateElderlyDietPlanWithGemini, 
  generateElderlyWellnessScenarioWithGemini 
} from './gemini';
import { generateSimpleDietPlan, generateElderlyDietPlanWithHuggingFace } from './huggingface';
import { 
  generateElderlyDietPlanWithOpenRouter,
  generateElderlyWellnessScenarioWithOpenRouter
} from './openrouter';
import { 
  generateElderlyDietPlanWithGroq,
  generateElderlyWellnessScenarioWithGroq,
  getFreeAPIInstructions
} from './free-apis';

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Rate limiting and retry configuration
const RETRY_DELAYS = [5000, 10000, 20000]; // 5s, 10s, 20s (mais conservador)
const MAX_RETRIES = 3;
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const MAX_REQUESTS_PER_MINUTE = 2; // Máximo 2 requisições por minuto

// Controle de rate limiting
let requestCount = 0;
let windowStart = Date.now();

// Utility function to sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Verificar se pode fazer requisição
const canMakeRequest = (): boolean => {
  const now = Date.now();
  
  // Reset window se passou 1 minuto
  if (now - windowStart >= RATE_LIMIT_WINDOW) {
    requestCount = 0;
    windowStart = now;
  }
  
  return requestCount < MAX_REQUESTS_PER_MINUTE;
};

// Incrementar contador de requisições
const incrementRequestCount = (): void => {
  requestCount++;
};

// Enhanced fetch with retry logic for 429 errors
const fetchWithRetry = async (url: string, options: RequestInit, retryCount = 0): Promise<Response> => {
  // Verificar rate limit antes de fazer requisição
  if (!canMakeRequest()) {
    const waitTime = RATE_LIMIT_WINDOW - (Date.now() - windowStart);
    console.warn(`⏰ Rate limit atingido. Aguardando ${Math.ceil(waitTime / 1000)}s...`);
    await sleep(waitTime);
  }

  try {
    incrementRequestCount();
    // Tentando OpenAI silenciosamente
    const response = await fetch(url, options);
    
    // If rate limited (429), retry with exponential backoff
    if (response.status === 429 && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAYS[retryCount] || 20000;
      console.warn(`⚠️ Rate limited (429). Aguardando ${delay/1000}s... (tentativa ${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(delay);
      return fetchWithRetry(url, options, retryCount + 1);
    }
    
    if (response.ok) {
      // OpenAI respondeu com sucesso
    }
    
    return response;
  } catch (error) {
    // Network error - retry once
    if (retryCount < 1) {
      // Erro de rede - tentando novamente silenciosamente
      await sleep(5000);
      return fetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
};

// Analyze elderly health from uploaded photo and basic info
export const analyzeElderlyHealth = async (
  imageBase64: string,
  basicInfo?: { age?: number; concerns?: string[] }
): Promise<ElderlyHealthAnalysis | null> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return null;
  }

  const systemPrompt = `You are a professional geriatrician and health assessment specialist. Analyze the elderly person in the image and provide a comprehensive health assessment in JSON format.

  Consider factors like:
  - Visual signs of health conditions
  - Mobility indicators
  - Cognitive status indicators
  - Overall well-being signs
  - Potential risk factors

  Respond with this exact JSON structure:
  {
    "conditions": [
      {
        "name": "condition name",
        "severity": "baixo|moderado|alto",
        "confidence": "low|medium|high"
      }
    ],
    "risk_factors": ["factor 1", "factor 2"],
    "functional_capacity": {
      "mobilidade": "independente|parcial|dependente",
      "cognicao": "normal|leve|moderado|severo",
      "autocuidado": "independente|parcial|dependente"
    },
    "recommendations": [
      {
        "category": "category name",
        "description": "recommendation description",
        "priority": "alta|média|baixa"
      }
    ],
    "overall_risk_score": 0-100,
    "summary": "comprehensive summary of health status",
    "key_insights": ["insight 1", "insight 2"],
    "urgent_alerts": ["alert if any urgent concerns"],
    "care_plan_preview": ["care item 1", "care item 2"]
  }`;

  try {
    const response = await fetchWithRetry(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this elderly person's health. Additional info: ${JSON.stringify(basicInfo || {})}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze health');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as ElderlyHealthAnalysis;
  } catch (error) {
    console.error('Error analyzing elderly health:', error);
    return null;
  }
};

// Create companion persona for elderly chat
export const createElderlyCompanionPersona = async (
  elderlyName: string,
  age: number,
  conditions: string[]
): Promise<string> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return `Olá ${elderlyName}! Sou seu companheiro de cuidados e estou aqui para ajudar!`;
  }

  const systemPrompt = `You are a compassionate AI companion specialized in elderly care. You're meeting ${elderlyName}, ${age} years old, who has the following conditions: ${conditions.join(', ')}.

  Introduce yourself warmly in Portuguese, acknowledging their specific health conditions with empathy. Be:
  - Respectful and age-appropriate
  - Knowledgeable about their conditions
  - Encouraging but realistic
  - Ready to provide health support and companionship

  Keep the introduction under 100 words and speak directly to ${elderlyName}.`;

  try {
    const response = await fetchWithRetry(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Introduce yourself to ${elderlyName}.`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create companion persona');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || `Olá ${elderlyName}! É um prazer conhecê-lo(a). Estou aqui para ser seu companheiro e ajudar com seus cuidados de saúde!`;
  } catch (error) {
    console.error('Error creating companion persona:', error);
    return `Olá ${elderlyName}! Estou muito feliz em conhecê-lo(a) e estar aqui para ajudar com seus cuidados!`;
  }
};

// Chat with elderly companion
export const chatWithElderlyCompanion = async (
  message: string,
  elderlyName: string,
  age: number,
  conditions: string[],
  mobilityLevel: string,
  cognitiveStatus: string,
  chatHistory: Array<{ role: string; content: string }>
): Promise<AIResponse> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return {
      response: 'Desculpe, preciso de configuração para poder conversar adequadamente.',
      reasoning: 'API key não configurada'
    };
  }

  const systemPrompt = `You are a specialized AI companion for elderly care, talking with ${elderlyName}, ${age} years old.

  Health Profile:
  - Conditions: ${conditions.join(', ')}
  - Mobility: ${mobilityLevel}
  - Cognitive status: ${cognitiveStatus}

  Guidelines:
  - Be warm, patient, and respectful
  - Use age-appropriate language
  - Consider their health conditions in responses
  - Provide health tips when relevant
  - Be encouraging about their capabilities
  - Respond in Portuguese
  - Keep responses under 100 words
  - Address them by name occasionally

  Respond with ONLY valid JSON:
  {"response": "your caring response", "reasoning": "why you responded this way considering their health profile"}`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-10),
      { role: 'user', content: message }
    ];

    const response = await fetchWithRetry(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 300,
        temperature: 0.6,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to chat with companion');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{"response": "Desculpe, não consegui processar sua mensagem.", "reasoning": "Erro na resposta da API"}';
    
    try {
      const parsed = JSON.parse(content);
      return {
        response: parsed.response || "Desculpe, pode repetir?",
        reasoning: parsed.reasoning || "Resposta padrão por erro de parsing"
      };
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return {
        response: "Desculpe, estou tendo dificuldades técnicas. Pode tentar novamente?",
        reasoning: "Erro ao processar resposta da IA"
      };
    }
  } catch (error) {
    console.error('Error chatting with companion:', error);
    return {
      response: "Estou com um pequeno problema técnico. Vamos tentar novamente em alguns instantes?",
      reasoning: "Erro de comunicação com o serviço de IA"
    };
  }
};

// Generate elderly diet plan - GROQ PRIMEIRO (70 RPM GRATUITO)
export const generateElderlyDietPlan = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  medications: string[],
  mobilityLevel: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<any> => {
  // 🚀 PRIORIDADE 1: Tentar Groq primeiro (70 RPM GRATUITO - funciona online)
  try {
    const groqResult = await generateElderlyDietPlanWithGroq(
      elderlyName, age, chronicConditions, medications, 
      mobilityLevel, healthGoals, specialConcerns
    );
    if (groqResult) {
      console.log('✅ Plano gerado com GROQ (70 req/min gratuito)!');
      return groqResult;
    }
  } catch (groqError) {
    console.warn('⚠️ Groq não disponível, tentando Gemini...', groqError);
    
    // Mostrar instruções se Groq não estiver configurado
    if (groqError instanceof Error && groqError.message.includes('not configured')) {
      console.info(getFreeAPIInstructions());
    }
  }

  // 🚀 PRIORIDADE 2: Tentar Gemini (15 RPM grátis)
  // Tentando Gemini silenciosamente
  try {
    const geminiResult = await generateElderlyDietPlanWithGemini(
      elderlyName, age, chronicConditions, medications, 
      mobilityLevel, healthGoals, specialConcerns
    );
    if (geminiResult) {
      console.log('✅ Plano de dieta gerado com sucesso usando Gemini!');
      return geminiResult;
    }
  } catch (geminiError) {
    console.warn('⚠️ Gemini falhou, tentando Hugging Face...', geminiError);
  }

  // 🚀 PRIORIDADE 3: Tentar Hugging Face (GRATUITO)
  try {
    const hfResult = await generateElderlyDietPlanWithHuggingFace(
      elderlyName, age, chronicConditions, medications, 
      mobilityLevel, healthGoals, specialConcerns
    );
    if (hfResult) {
      console.log('✅ Plano gerado com Hugging Face (Phi-2)!');
      return hfResult;
    }
  } catch (hfError) {
    console.warn('⚠️ Hugging Face falhou, tentando OpenRouter...', hfError);
  }

  // 🚀 PRIORIDADE 3.5: Tentar OpenRouter (gratuito e pago)
  try {
    const orResult = await generateElderlyDietPlanWithOpenRouter(
      elderlyName, age, chronicConditions, medications, 
      mobilityLevel, healthGoals, specialConcerns
    );
    if (orResult) {
      console.log('✅ Plano gerado com OpenRouter (Mistral-7B)!');
      return orResult;
    }
  } catch (orError) {
    console.warn('⚠️ OpenRouter falhou, tentando OpenAI...', orError);
  }

  // 🚀 PRIORIDADE 4: Fallback para OpenAI
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    // Pular direto para plano básico
    console.warn('🔧 Gerando plano básico sem IA...');
    const basicPlan = generateSimpleDietPlan(elderlyName, age, chronicConditions);
    return basicPlan;
  }

  const systemPrompt = `You are a professional geriatric nutritionist. Create a comprehensive weekly diet plan for ${elderlyName}, ${age} years old.

  Health Profile:
  - Chronic conditions: ${chronicConditions.join(', ')}
  - Medications: ${medications.join(', ')}
  - Mobility level: ${mobilityLevel}
  - Health goals: ${healthGoals.join(', ')}
  - Special concerns: ${specialConcerns.join(', ')}

  Create a practical, healthy, and culturally appropriate Brazilian diet plan considering:
  - Age-related nutritional needs
  - Medication interactions
  - Chronic condition management
  - Mobility limitations affecting food preparation
  - Hydration needs for elderly
  - Texture modifications if needed

  Respond with this exact JSON structure:
  {
    "weekly_plan": {
      "Segunda-feira": {
        "cafe_da_manha": "detailed breakfast with portions",
        "lanche_matinal": "morning snack",
        "almoco": "detailed lunch with portions",
        "lanche_vespertino": "afternoon snack",
        "jantar": "detailed dinner with portions",
        "ceia": "evening snack if needed",
        "observacoes": "daily notes"
      },
      // ... continue for all 7 days
    },
    "diretrizes_nutricionais": ["guideline 1", "guideline 2", "guideline 3"],
    "horarios_refeicoes": "recommended eating schedule",
    "hidratacao_diaria": "daily hydration guidelines",
    "cuidados_especiais": ["special care 1", "special care 2"],
    "interacoes_medicamentos": "medication interaction warnings",
    "preparo_facil": ["easy preparation tips"],
    "emergencia_contato": "when to contact healthcare provider"
  }`;

  try {
    const response = await fetchWithRetry(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a weekly diet plan for ${elderlyName}.`
          }
        ],
        max_tokens: 3000,
        temperature: 0.4,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Limite de requisições excedido. Aguarde alguns minutos e tente novamente.');
      } else if (response.status === 401) {
        throw new Error('Chave da API OpenAI inválida. Verifique sua configuração.');
      } else if (response.status === 402) {
        throw new Error('Créditos da OpenAI esgotados. Adicione créditos à sua conta.');
      }
      throw new Error(`Erro na API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('❌ OpenAI também falhou:', error);
    
    // 🔧 PRIORIDADE 3: Último recurso - plano básico sem IA
    console.warn('🔧 Gerando plano básico sem IA como último recurso...');
    const basicPlan = generateSimpleDietPlan(elderlyName, age, chronicConditions);
    if (basicPlan) {
      console.log('✅ Plano básico gerado com sucesso!');
      return basicPlan;
    }
    
    console.error('❌ Todas as alternativas falharam');
    return null;
  }
};

// Generate wellness scenario - GROQ PRIMEIRO
export const generateElderlyWellnessScenario = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  mobilityLevel: string,
  cognitiveStatus: string,
  livingArrangement: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<ElderlyWellnessScenario | null> => {
  // 🚀 PRIORIDADE 1: Tentar Groq primeiro (70 RPM GRATUITO)
  try {
    const groqResult = await generateElderlyWellnessScenarioWithGroq(
      elderlyName, age, chronicConditions, mobilityLevel,
      cognitiveStatus, livingArrangement, healthGoals, specialConcerns
    );
    if (groqResult) {
      console.log('✅ Cenário gerado com GROQ (70 req/min gratuito)!');
      return groqResult;
    }
  } catch (groqError) {
    console.warn('⚠️ Groq não disponível para cenário, tentando Gemini...', groqError);
  }

  // 🚀 PRIORIDADE 2: Tentar Gemini
  // Tentando Gemini para cenário de bem-estar silenciosamente
  try {
    const geminiResult = await generateElderlyWellnessScenarioWithGemini(
      elderlyName, age, chronicConditions, mobilityLevel,
      cognitiveStatus, livingArrangement, healthGoals, specialConcerns
    );
    if (geminiResult) {
      console.log('✅ Cenário gerado com sucesso usando Gemini!');
      return geminiResult;
    }
  } catch (geminiError) {
    console.warn('⚠️ Gemini falhou, tentando OpenRouter...', geminiError);
  }

  // 🚀 PRIORIDADE 3: Tentar OpenRouter
  try {
    const orResult = await generateElderlyWellnessScenarioWithOpenRouter(
      elderlyName, age, chronicConditions, [],
      mobilityLevel, healthGoals, specialConcerns
    );
    if (orResult) {
      console.log('✅ Cenário gerado com OpenRouter (Mistral-7B)!');
      return orResult;
    }
  } catch (orError) {
    console.warn('⚠️ OpenRouter falhou, tentando OpenAI...', orError);
  }

  // 🔄 PRIORIDADE 4: Fallback para OpenAI
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return null;
  }

  const systemPrompt = `You are a geriatric care specialist. Create an educational wellness scenario for ${elderlyName}, ${age} years old.

  Profile:
  - Conditions: ${chronicConditions.join(', ')}
  - Mobility: ${mobilityLevel}
  - Cognitive status: ${cognitiveStatus}
  - Living: ${livingArrangement}
  - Goals: ${healthGoals.join(', ')}
  - Concerns: ${specialConcerns.join(', ')}

  Create a realistic scenario that tests knowledge about elderly wellness, considering their specific profile. Make it educational and relevant to their situation.

  Respond with this exact JSON structure:
  {
    "scenario": "A detailed, realistic scenario describing a wellness situation",
    "correct_response": "the best response to the scenario",
    "response_options": ["correct response", "plausible but not ideal option 1", "plausible but not ideal option 2", "clearly wrong option"],
    "explanation": "detailed explanation of why the correct response is best, including scientific reasoning and specific considerations for elderly care"
  }

  Focus on practical situations like:
  - Daily routine management
  - Health monitoring
  - Social engagement
  - Safety considerations
  - Medication management
  - Emergency recognition`;

  try {
    const response = await fetchWithRetry(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a wellness scenario for ${elderlyName}'s profile.`
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Limite de requisições excedido. Aguarde alguns minutos e tente novamente.');
      } else if (response.status === 401) {
        throw new Error('Chave da API OpenAI inválida. Verifique sua configuração.');
      } else if (response.status === 402) {
        throw new Error('Créditos da OpenAI esgotados. Adicione créditos à sua conta.');
      }
      throw new Error(`Erro na API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content) as ElderlyWellnessScenario;
  } catch (error) {
    console.error('❌ OpenAI também falhou para cenário:', error);
    return null;
  }
};

// Generate health insights from questionnaire data
export const generateHealthInsights = async (
  profileData: any
): Promise<string[]> => {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return ['Análise detalhada não disponível no momento.'];
  }

  const systemPrompt = `You are a geriatrician analyzing an elderly person's health profile. Provide 3-5 key insights in Portuguese that are:
  - Actionable and practical
  - Specific to their profile
  - Encouraging but realistic
  - Focused on improving quality of life

  Profile data: ${JSON.stringify(profileData)}

  Respond with a JSON array of insights:
  ["insight 1", "insight 2", "insight 3"]`;

  try {
    const response = await fetchWithRetry(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: 'Generate health insights for this profile.'
          }
        ],
        max_tokens: 500,
        temperature: 0.5,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate insights');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : parsed.insights || [];
    }
    
    return ['Análise personalizada será disponibilizada em breve.'];
  } catch (error) {
    console.error('Error generating health insights:', error);
    return ['Não foi possível gerar insights no momento.'];
  }
};