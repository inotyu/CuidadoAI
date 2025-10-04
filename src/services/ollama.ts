// Ollama - IA 100% GRATUITA e LOCAL
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'llama3.2:1b'; // Modelo leve e rápido

// Verificar se Ollama está rodando
const isOllamaAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    return response.ok;
  } catch {
    return false;
  }
};

// Gerar plano de dieta com Ollama (GRATUITO e RÁPIDO)
export const generateElderlyDietPlanWithOllama = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  medications: string[],
  mobilityLevel: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<any> => {
  if (!(await isOllamaAvailable())) {
    throw new Error('Ollama não está rodando. Instale em: https://ollama.ai');
  }

  const prompt = `Crie um plano alimentar semanal em JSON para ${elderlyName}, ${age} anos.

Perfil:
- Condições: ${chronicConditions.join(', ')}
- Medicamentos: ${medications.join(', ')}
- Mobilidade: ${mobilityLevel}
- Objetivos: ${healthGoals.join(', ')}
- Preocupações: ${specialConcerns.join(', ')}

Responda APENAS com JSON válido:
{
  "weekly_plan": {
    "Segunda-feira": {
      "cafe_da_manha": "café da manhã com porções",
      "almoco": "almoço com porções",
      "jantar": "jantar com porções"
    },
    "Terça-feira": {"cafe_da_manha": "...", "almoco": "...", "jantar": "..."},
    "Quarta-feira": {"cafe_da_manha": "...", "almoco": "...", "jantar": "..."},
    "Quinta-feira": {"cafe_da_manha": "...", "almoco": "...", "jantar": "..."},
    "Sexta-feira": {"cafe_da_manha": "...", "almoco": "...", "jantar": "..."},
    "Sábado": {"cafe_da_manha": "...", "almoco": "...", "jantar": "..."},
    "Domingo": {"cafe_da_manha": "...", "almoco": "...", "jantar": "..."}
  },
  "diretrizes_nutricionais": ["diretriz 1", "diretriz 2"],
  "hidratacao_diaria": "2 litros de água",
  "cuidados_especiais": ["cuidado 1", "cuidado 2"]
}`;

  try {
    // Tentando Ollama silenciosamente
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.response;
    
    if (!content) {
      throw new Error('No response from Ollama');
    }

    // Extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Ollama response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ Ollama falhou:', error);
    throw error;
  }
};

// Gerar cenário de bem-estar com Ollama
export const generateElderlyWellnessScenarioWithOllama = async (
  elderlyName: string,
  age: number,
  chronicConditions: string[],
  mobilityLevel: string,
  cognitiveStatus: string,
  livingArrangement: string,
  healthGoals: string[],
  specialConcerns: string[]
): Promise<any> => {
  if (!(await isOllamaAvailable())) {
    throw new Error('Ollama não está rodando');
  }

  const prompt = `Crie um cenário educativo de bem-estar em JSON para ${elderlyName}, ${age} anos.

Perfil:
- Condições: ${chronicConditions.join(', ')}
- Mobilidade: ${mobilityLevel}
- Cognição: ${cognitiveStatus}
- Moradia: ${livingArrangement}

Responda APENAS com JSON:
{
  "scenario": "Cenário detalhado de uma situação de bem-estar",
  "correct_response": "a melhor resposta",
  "response_options": ["resposta correta", "opção 1", "opção 2", "opção errada"],
  "explanation": "explicação detalhada da resposta correta"
}`;

  try {
    // Tentando Ollama para cenário de bem-estar silenciosamente
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.8
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.response;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Ollama response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('❌ Ollama falhou para cenário:', error);
    throw error;
  }
};

// Instruções de instalação do Ollama
export const getOllamaInstallInstructions = (): string => {
  return `
🚀 OLLAMA - IA 100% GRATUITA E LOCAL

1. Instalar Ollama:
   - Windows: https://ollama.ai/download/windows
   - Baixe e execute o instalador

2. Instalar modelo leve:
   - Abra terminal/cmd
   - Execute: ollama pull llama3.2:1b
   - Aguarde download (~1GB)

3. Verificar se está rodando:
   - Execute: ollama serve
   - Deve mostrar "Ollama is running on http://localhost:11434"

VANTAGENS:
✅ 100% GRATUITO (sem limites)
✅ RÁPIDO (roda local)
✅ PRIVADO (dados não saem do PC)
✅ SEM INTERNET (após instalação)
✅ SEM RATE LIMITS
  `;
};
