# Configuração do Supabase para CuidadoAI

## Problema: Cadastro fica travado em "Criando conta..."

Se o cadastro está ficando travado, provavelmente é um problema de configuração do Supabase. Siga os passos abaixo:

## 1. Verificar arquivo .env.local

Crie ou verifique o arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
VITE_GEMINI_API_KEY=sua-chave-gemini-aqui
VITE_OPENAI_API_KEY=sua-chave-openai-aqui
```

## 2. Configurar Supabase

### Opção A: Usar Supabase Real
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie a URL e a chave anônima
5. Cole no arquivo `.env.local`

### Opção B: Usar Modo Demo (Recomendado para testes)
Se você não quer configurar o Supabase agora, o app funciona em modo demo:

1. Deixe as variáveis como estão no `.env.example`
2. O app detectará automaticamente e usará localStorage

## 3. Verificar Console do Navegador

Abra o console do navegador (F12) e procure por:
- ✅ Logs verdes: funcionando
- ❌ Logs vermelhos: erro
- 🎮 "Modo demo": usando localStorage
- 💾 "Usando Supabase real": usando banco real

## 4. Soluções para Problemas Comuns

### Erro de timeout
- Verifique sua conexão com internet
- Confirme se a URL do Supabase está correta

### Erro "User already registered"
- Use a opção "Já tem uma conta? Entre aqui"

### Erro "Email not confirmed"
- Verifique seu email e clique no link de confirmação

## 5. Modo Demo

Se nada funcionar, o app tem um modo demo que:
- Não requer configuração
- Salva dados no localStorage
- Funciona offline
- É perfeito para testar o app

Para forçar o modo demo, deixe as URLs como:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Logs Úteis

O app agora mostra logs detalhados no console:
- 🔧 Configuração detectada
- 🔄 Tentativas de autenticação
- ✅ Sucessos
- ❌ Erros com detalhes

Abra o console (F12) para ver o que está acontecendo!
