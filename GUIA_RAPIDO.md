# 🚀 GUIA RÁPIDO - CONFIGURAR SUPABASE

## PASSO 1: Criar arquivo .env.local

1. **Abra a pasta `mypaw-main/`**
2. **Crie um novo arquivo** chamado `.env.local`
3. **Cole este conteúdo** (suas credenciais):

```env
VITE_SUPABASE_URL=https://thgjsfiatmkjqedtknki.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZ2pzZmlhdG1ranFlZHRrbmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzg5NzMsImV4cCI6MjA3NDY1NDk3M30.YmVtR1DX7RKckgyJgs1XqX1l1-43-7Ufpd9gUhkLJ5Q
VITE_GEMINI_API_KEY=sua-chave-gemini-aqui
VITE_OPENAI_API_KEY=sua-chave-openai-aqui
```

## PASSO 2: Executar SQL no Supabase

1. **Vá para**: https://supabase.com/dashboard
2. **Clique no seu projeto**: thgjsfiatmkjqedtknki
3. **Clique em "SQL Editor"** (menu lateral)
4. **Abra o arquivo** `SQL_PARA_EXECUTAR.sql`
5. **Copie TODO o conteúdo**
6. **Cole no SQL Editor**
7. **Clique em "Run"**

## PASSO 3: Testar

1. **Recarregue a página** do app (F5)
2. **Abra o console** (F12)
3. **Procure por**: `💾 Usando Supabase real`
4. **Teste o cadastro**!

## ✅ PRONTO!

Agora o app usará o banco Supabase real em vez do modo demo!

## 🆘 Se der erro:

- Verifique se o arquivo `.env.local` está na pasta correta
- Verifique se o SQL foi executado sem erros
- Olhe o console do navegador para logs detalhados
