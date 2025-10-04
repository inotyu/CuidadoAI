# 🚀 Configuração do Google Gemini (Fallback para OpenAI)

## ✅ **Solução Implementada**

O sistema agora tem **fallback automático** para Google Gemini quando a OpenAI retorna erro 429.

### **🔄 Como Funciona**
1. **Primeira tentativa**: OpenAI (com rate limiting inteligente)
2. **Se falhar (429)**: Automaticamente tenta com Gemini
3. **Logs informativos**: Mostra qual API está sendo usada

## 🔑 **Como Obter Chave do Gemini (GRÁTIS)**

### **1. Acesse o Google AI Studio**
- URL: https://makersuite.google.com/app/apikey
- Faça login com sua conta Google

### **2. Crie uma API Key**
- Clique em **"Create API Key"**
- Escolha um projeto ou crie novo
- **Copie a chave** (formato: `AIza...`)

### **3. Configure no .env**
Adicione no seu arquivo `.env`:
```env
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 💰 **Vantagens do Gemini**

### **✅ Plano Gratuito Generoso**
- **15 RPM** (requests por minuto) - 5x mais que OpenAI
- **1 milhão de tokens** por mês grátis
- **Sem expiração** de créditos
- **Sem necessidade de cartão de crédito**

### **⚡ Performance**
- Respostas rápidas
- Qualidade similar ao GPT-4
- Suporte a JSON nativo
- Menos propenso a rate limiting

## 🔧 **Funcionalidades com Fallback**

### **✅ Já Implementadas**
- **Planos de Dieta**: `generateElderlyDietPlan`
- **Cenários de Bem-estar**: `generateElderlyWellnessScenario`

### **📊 Logs no Console**
```
❌ Error generating diet plan with OpenAI: Error: Failed to generate diet plan
⚠️  Tentando com Gemini como fallback...
✅ Plano de dieta gerado com sucesso usando Gemini!
```

## 🚨 **Rate Limiting Melhorado**

### **OpenAI (Mais Conservador)**
- **2 requisições por minuto** máximo
- **Delays**: 5s → 10s → 20s
- **Verificação prévia** antes de fazer requisição

### **Gemini (Mais Flexível)**
- **15 requisições por minuto**
- **Fallback automático** quando OpenAI falha
- **Sem delays agressivos**

## 🎯 **Como Testar**

### **1. Configure Ambas as APIs**
```env
# No seu .env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **2. Teste o Fallback**
1. **Gere um plano de dieta** (vai tentar OpenAI primeiro)
2. **Se der 429**: Automaticamente usa Gemini
3. **Observe os logs** no console do navegador

### **3. Monitore no Console**
- ✅ Sucesso com OpenAI
- ⚠️ Fallback para Gemini
- ❌ Ambos falharam

## 📈 **Resultado Esperado**

### **✅ Antes (Só OpenAI)**
```
❌ Error 429 → App quebra
```

### **✅ Agora (OpenAI + Gemini)**
```
❌ OpenAI Error 429 → ✅ Gemini funciona → App continua
```

## 🔗 **Links Úteis**

- **Google AI Studio**: https://makersuite.google.com/
- **Documentação Gemini**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing

---

**Resultado**: Seu app agora é **muito mais resistente** a erros de API e tem uma alternativa gratuita robusta!
