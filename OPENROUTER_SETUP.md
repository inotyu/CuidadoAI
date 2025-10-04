# OpenRouter Integration

## Overview
OpenRouter é uma plataforma unificada que oferece acesso a múltiplos modelos de IA através de uma única API, incluindo modelos gratuitos e pagos.

## Vantagens

### ✅ Benefícios
- **Múltiplos modelos**: Mistral, Llama, GPT-4, Claude, Gemini e mais
- **Modelos gratuitos**: Mistral-7B, Llama-3-8B, Gemma-7B
- **Interface unificada**: Compatível com OpenAI API
- **Alta disponibilidade**: Serviço estável e rápido
- **Créditos iniciais**: Novos usuários recebem créditos grátis
- **Preços acessíveis**: Modelos premium a preços competitivos

### 📊 Comparação com outras APIs

| API | Modelos Gratuitos | RPM | Preço | Qualidade |
|-----|------------------|-----|-------|----------|
| **OpenRouter** | ✅ Mistral-7B, Llama-3-8B | Alta | Baixo | Alta |
| Groq | ✅ Llama-3-70B | 70 | Grátis | Alta |
| Gemini | ✅ Gemini-1.5-Flash | 15 | Grátis | Alta |
| Hugging Face | ✅ Phi-2, Mistral | Média | Grátis | Média |
| OpenAI | ❌ | 3 | Pago | Alta |

## Configuração

### 1. Criar conta
```
https://openrouter.ai
```

### 2. Obter API Key
```
https://openrouter.ai/keys
```

### 3. Adicionar ao .env.local
```bash
VITE_OPENROUTER_API_KEY=sk-or-...
```

### 4. Reiniciar o servidor
```bash
npm run dev
```

## Modelos Disponíveis

### 🆓 Modelos Gratuitos
- **mistralai/mistral-7b-instruct** - Rápido e eficiente
- **meta-llama/llama-3-8b-instruct** - Última versão do Llama
- **google/gemma-7b-it** - Modelo do Google

### 💳 Modelos Premium
- **openai/gpt-4** - Melhor qualidade geral
- **openai/gpt-4-turbo** - Versão otimizada
- **anthropic/claude-3-opus** - Excelente para texto
- **google/gemini-pro** - Modelo multimodal

## Integração no Sistema

### Hierarquia de Prioridade
1. 🚀 **Groq** - 70 RPM gratuito (prioridade máxima)
2. 🔄 **Gemini** - 15 RPM gratuito
3. 🤗 **Hugging Face** - Gratuito (Phi-2)
4. 🌐 **OpenRouter** - Gratuito/pago (Mistral-7B)
5. 💰 **OpenAI** - 3 RPM pago
6. 🔧 **Plano Básico** - Sempre funciona

### Funcionalidades Implementadas
- ✅ Geração de planos de dieta
- ✅ Geração de cenários de bem-estar
- ✅ Tratamento de erros detalhado
- ✅ Fallback automático
- ✅ Logs informativos

## Uso

### Exemplo de chamada
```typescript
const dietPlan = await generateElderlyDietPlanWithOpenRouter(
  "Maria", 75, ["diabetes"], ["metformina"], 
  "parcial", ["controle glicemia"], ["hipoglicemia"]
);
```

### Resposta esperada
```json
{
  "weekly_plan": {
    "Monday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
    "Tuesday": {"breakfast": "...", "lunch": "...", "dinner": "..."}
  },
  "nutritional_guidelines": ["..."],
  "daily_hydration": "...",
  "special_care": ["..."]
}
```

## Monitoramento

### Logs no console
```
🌐 Tentando OpenRouter (Mistral-7B)...
✅ Plano gerado com OpenRouter (Mistral-7B)!
```

### Erros comuns
- **401**: Chave API inválida
- **429**: Limite de requisições excedido
- **403**: Acesso negado (verificar créditos)

## Dicas

### Para produção
1. Configurar múltiplas chaves para load balancing
2. Monitorar uso de créditos
3. Usar modelos gratuitos para desenvolvimento
4. Atualizar para modelos premium para melhor qualidade

### Para desenvolvimento
1. Usar modelos gratuitos (Mistral-7B)
2. Testar diferentes prompts
3. Monitorar respostas no console
4. Verificar formatação JSON

## Suporte

- **Documentação**: https://openrouter.ai/docs
- **Status**: https://status.openrouter.ai
- **Preços**: https://openrouter.ai/pricing
