// OpenRouter API - Alternativa com múltiplos modelos
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Modelos disponíveis (gratuitos e pagos)
const OPENROUTER_MODELS = {
  // Modelos gratuitos
  MISTRAL_FREE: 'mistralai/mistral-7b-instruct',
  LLAMA_FREE: 'meta-llama/llama-3-8b-instruct',
  GEMMA_FREE: 'google/gemma-7b-it',
  
  // Modelos pagos (melhor qualidade)
  GPT_4: 'openai/gpt-4',
  GPT_4_TURBO: 'openai/gpt-4-turbo',
  CLAUDE_3: 'anthropic/claude-3-opus',
  GEMINI_PRO: 'google/gemini-pro'
};

// Gerar plano de dieta com OpenRouter
export const generateElderlyDietPlanWithOpenRouter = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  medications: string[],
  mobilityLevel: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<any> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const prompt = `Crie um plano de dieta semanal completo em formato JSON para ${elderlyName}, idade ${age}.

Perfil de Saúde:
- Condições crônicas: ${chronicConditions.join(', ')}
- Medicamentos: ${medications.join(', ')}
- Mobilidade: ${mobilityLevel}
- Objetivos de saúde: ${healthGoals.join(', ')}
- Preocupações especiais: ${specialConcerns.join(', ')}

IMPORTANTE: Responda APENAS com JSON válido e COMPLETO, incluindo TODOS os campos obrigatórios. Não corte o JSON. Não adicione comentários. Não adicione texto explicativo.

Estrutura obrigatória completa:
{
  "weekly_plan": {
    "Segunda-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Terça-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Quarta-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Quinta-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Sexta-feira": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Sábado": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."},
    "Domingo": {"cafe_da_manha": "...", "lanche_matinal": "...", "almoco": "...", "lanche_vespertino": "...", "jantar": "...", "ceia": "..."}
  },
  "diretrizes_nutricionais": ["diretriz 1", "diretriz 2"],
  "cuidados_especiais": ["cuidado 1", "cuidado 2"],
  "horarios_refeicoes": "horários das refeições",
  "hidratacao_diaria": "diretrizes de hidratação",
  "interacoes_medicamentos": "interações medicamentosas",
  "restricoes_alimentares": ["restrição 1", "restrição 2"],
  "monitoramento_peso": "instruções de monitoramento de peso",
  "adaptacoes_disfagia": "adaptações para disfagia se necessário",
  "calorias_diarias": 2000,
  "observacoes_gerais": "observações gerais sobre o plano alimentar"
}`;

  try {
    console.log('🌐 Tentando OpenRouter (Mistral-7B)...');
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mypaw.vercel.app',
        'X-Title': 'MyPaw Elderly Care'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODELS.MISTRAL_FREE,
        messages: [
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
      if (response.status === 401) {
        throw new Error('OpenRouter API key inválida. Obtenha em: https://openrouter.ai/keys');
      } else if (response.status === 429) {
        throw new Error('Limite OpenRouter excedido. Aguarde alguns minutos.');
      } else if (response.status === 403) {
        throw new Error('Acesso negado. Verifique sua chave e plano.');
      }
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    if (!content) {
      throw new Error('No response from OpenRouter');
    }

    // Extrair JSON da resposta
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in OpenRouter response');
    }

    let jsonString = jsonMatch[0];
    
    // Tentar corrigir problemas comuns de formatação
    jsonString = jsonString
      .replace(/\/\/.*$/gm, '') // Remove comentários de linha única
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários de bloco
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/,\s*([}\]])/g, '$1') // Remove vírgulas extras antes de } ou ]
      .replace(/([}\]])(\s*)([\{\[])/g, '$1,$3'); // Adiciona vírgulas entre objetos
    
    // Se o JSON estiver truncado (falta campos obrigatórios), tentar completar
    if (!jsonString.includes('"diretrizes_nutricionais"')) {
      // JSON está incompleto - tentar extrair apenas o weekly_plan e criar um objeto mínimo
      const weeklyPlanMatch = jsonString.match(/"weekly_plan"\s*:\s*(\{[\s\S]*?\})/);
      if (weeklyPlanMatch) {
        try {
          const weeklyPlan = JSON.parse(weeklyPlanMatch[1]);
          // Criar objeto completo com valores padrão
          return {
            weekly_plan: weeklyPlan,
            diretrizes_nutricionais: ["Dieta balanceada e nutritiva"],
            cuidados_especiais: ["Monitorar glicemia e pressão arterial"],
            horarios_refeicoes: "Refeições às 8:00, 12:00, 15:00 e 19:00",
            hidratacao_diaria: "Beber pelo menos 8 copos de água por dia",
            interacoes_medicamentos: "Consultar médico sobre interações medicamentosas",
            restricoes_alimentares: ["Evitar açúcar e gorduras saturadas"],
            monitoramento_peso: "Pesar-se semanalmente",
            adaptacoes_disfagia: "Cortar alimentos em pedaços pequenos se necessário",
            calorias_diarias: 2000,
            observacoes_gerais: "Plano gerado automaticamente, sujeito a ajustes"
          };
        } catch (e) {
          // Se falhar, continuar com o tratamento normal
        }
      }
    }
    
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error, attempting to fix:', parseError);
      console.log('Raw JSON string:', jsonString);
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
      throw new Error(`Invalid JSON format: ${errorMessage}`);
    }
  } catch (error) {
    console.error('❌ OpenRouter falhou:', error);
    throw error;
  }
};

// Gerar cenário de bem-estar com OpenRouter
export const generateElderlyWellnessScenarioWithOpenRouter = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  medications: string[],
  mobilityLevel: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<any> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const prompt = `Crie um cenário de bem-estar para ${elderlyName}, idade ${age}.

Perfil de Saúde:
- Condições crônicas: ${chronicConditions.join(', ')}
- Medicamentos: ${medications.join(', ')}
- Mobilidade: ${mobilityLevel}
- Objetivos de saúde: ${healthGoals.join(', ')}
- Preocupações especiais: ${specialConcerns.join(', ')}

Responda APENAS com JSON válido e COMPLETO, sem comentários, sem texto adicional, sem explicações:
{
  "scenario": "Descrição completa do cenário",
  "response_options": ["Opção correta", "Opção incorreta 1", "Opção incorreta 2", "Opção incorreta 3"],
  "correct_response": "Opção correta",
  "explanation": "Explicação detalhada da resposta correta",
  "category": "seguranca",
  "difficulty": "medio",
  "learning_objective": "Objetivo de aprendizado do cenário"
}`;

  try {
    console.log('🌐 Tentando OpenRouter (Mistral-7B) - Cenário...');
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mypaw.vercel.app',
        'X-Title': 'MyPaw Elderly Care'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODELS.MISTRAL_FREE,
        messages: [
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
      if (response.status === 401) {
        throw new Error('OpenRouter API key inválida. Obtenha em: https://openrouter.ai/keys');
      } else if (response.status === 429) {
        throw new Error('Limite OpenRouter excedido. Aguarde alguns minutos.');
      } else if (response.status === 403) {
        throw new Error('Acesso negado. Verifique sua chave e plano.');
      }
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    if (!content) {
      throw new Error('No response from OpenRouter');
    }

    // Extrair JSON da resposta
    let jsonString = content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
    
    // Tentar corrigir problemas comuns de formatação
    jsonString = jsonString
      .replace(/\/\/.*$/gm, '') // Remove comentários de linha única
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários de bloco
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/,\s*([}\]])/g, '$1') // Remove vírgulas extras antes de } ou ]
      .replace(/([}\]])(\s*)([\{\[])/g, '$1,$3'); // Adiciona vírgulas entre objetos
    
    // Se o JSON estiver truncado (falta campos obrigatórios), tentar completar
    if (!jsonString.includes('"scenario"') || !jsonString.includes('"response_options"')) {
      // JSON está incompleto - criar um objeto mínimo com base no conteúdo
      const scenarioMatch = jsonString.match(/"scenario"\s*:\s*"([^"]*)"/);
      const scenario = scenarioMatch ? scenarioMatch[1] : 'Cenário de bem-estar para idosos';
      
      return {
        scenario: scenario,
        response_options: ['Opção segura', 'Opção arriscada', 'Opção neutra', 'Opção incorreta'],
        correct_response: 'Opção segura',
        explanation: 'A opção segura é a mais adequada para o bem-estar do idoso.',
        category: 'seguranca',
        difficulty: 'medio',
        learning_objective: 'Aprender a identificar situações de risco para idosos'
      };
    }
    
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error, attempting to fix:', parseError);
      console.log('Raw JSON string:', jsonString);
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
      throw new Error(`Invalid JSON format: ${errorMessage}`);
    }
  } catch (error) {
    console.error('❌ OpenRouter falhou:', error);
    throw error;
  }
};

// Instruções para configurar OpenRouter
export const getOpenRouterInstructions = () => {
  return `
🌐 CONFIGURAR OPENROUTER:

1. Criar conta:
   https://openrouter.ai

2. Obter API Key:
   https://openrouter.ai/keys

3. Adicionar ao .env.local:
   VITE_OPENROUTER_API_KEY=sk-or-...

4. Créditos gratuitos:
   - Novos usuários recebem créditos grátis
   - Modelos gratuitos disponíveis
   - Preços acessíveis para modelos premium

5. Vantagens:
   - Múltiplos modelos em um só lugar
   - Interface compatível com OpenAI
   - Modelos gratuitos e pagos
   - Alta velocidade e confiabilidade
  `;
};
