# 🆓 APIs GRATUITAS que FUNCIONAM ONLINE

## ✅ **Nova Estratégia Otimizada**

Agora o sistema usa **APIs gratuitas** que funcionam perfeitamente em **hospedagem online**!

## 🚀 **GROQ - PRIORIDADE MÁXIMA**

### **Por que Groq é PERFEITO?**
- 🆓 **100% GRATUITO** (sem cartão de crédito)
- ⚡ **3x mais rápido** que OpenAI
- 🌐 **70 requisições/minuto** (vs 3 da OpenAI)
- 🔗 **Funciona online** (Vercel, Netlify, etc.)
- 🤖 **Modelo Llama 3** (qualidade excelente)

### **Como Obter Chave Groq (2 minutos)**
1. **Acesse**: https://console.groq.com/keys
2. **Crie conta** (só email, sem cartão)
3. **Create API Key**
4. **Copie a chave**: `gsk_xxxxxxxxxxxxxxxxxxxxxxxx`

## 📊 **Nova Ordem de Prioridade**

```mermaid
graph TD
    A[Usuário solicita] --> B[1. 🚀 GROQ]
    B --> C{Groq OK?}
    C -->|✅ Sim| D[Resultado Groq - 70 req/min]
    C -->|❌ Não config| E[2. 🔄 Gemini]
    E --> F{Gemini OK?}
    F -->|✅ Sim| G[Resultado Gemini - 15 req/min]
    F -->|❌ Limite| H[3. 💰 OpenAI]
    H --> I{OpenAI OK?}
    I -->|✅ Sim| J[Resultado OpenAI - 3 req/min]
    I -->|❌ 429| K[4. 🔧 Plano Básico]
    K --> L[✅ Sempre funciona]
```

## 🔧 **Configuração no .env**

```env
# APIs GRATUITAS (adicione no seu .env)
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```

## 📈 **Comparação Completa**

| API | Custo | RPM | Velocidade | Online | Qualidade |
|-----|-------|-----|------------|--------|-----------|
| **Groq** | 🆓 Grátis | 70 | ⚡⚡⚡ | ✅ | 🌟🌟🌟🌟 |
| Gemini | 🆓 Grátis | 15 | ⚡⚡ | ✅ | 🌟🌟🌟🌟 |
| OpenAI | 💰 Pago | 3 | ⚡⚡ | ✅ | 🌟🌟🌟🌟🌟 |
| Básico | 🆓 Grátis | ∞ | ⚡⚡⚡ | ✅ | 🌟🌟 |

## 🌐 **Hospedagem Online**

### **✅ Funciona Perfeitamente Em:**
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **Railway**
- **Heroku**

### **🔧 Deploy Simples:**
```bash
# Vercel (mais fácil)
npm i -g vercel
vercel

# Netlify
npm run build
# Arraste pasta dist para netlify.com
```

## 📱 **Logs Esperados**

### **Com Groq Configurado:**
```
🚀 Tentando Groq (GRATUITO - 70 req/min)...
✅ Plano gerado com GROQ (70 req/min gratuito)!
```

### **Fallback Automático:**
```
⚠️ Groq não disponível, tentando Gemini...
🔄 Tentando Gemini...
✅ Plano de dieta gerado com sucesso usando Gemini!
```

## 🎯 **Resultado Final**

Com essa configuração você tem:
- ✅ **Sistema robusto** com 4 níveis de fallback
- ✅ **APIs gratuitas** que funcionam online
- ✅ **70 req/min** com Groq (muito generoso)
- ✅ **Velocidade 3x maior** que OpenAI
- ✅ **Deploy simples** em qualquer plataforma
- ✅ **Nunca quebra** - sempre tem fallback

**Configure o Groq agora e tenha IA rápida e gratuita para sempre!** 🚀
