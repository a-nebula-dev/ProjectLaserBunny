# Studio a laser coelho - Ecommerce

Este é um projeto de ecommerce desenvolvido com [Next.js](https://nextjs.org/) (App Router), focado em produtos personalizados feitos com corte a laser (MDF, acrílico, etc).

## ✨ Tecnologias Utilizadas

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (componentes de UI)
- **Clerk** (autenticação)
- **Redux Toolkit** (estado global)
- **MongoDB + Mongoose** (banco de dados)
- **ImageKit** (upload e otimização de imagens)
- **Stripe** (pagamentos)
- **Zod** (validação de dados)
- **Jest + Testing Library** (testes)

## 🚀 Como rodar o projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/laserbunny.git
   cd laserbunny
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   - Renomeie `.env.example` para `.env.local` e preencha com suas chaves do Clerk, ImageKit, MongoDB, Stripe, etc.

4. **Rode o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Acesse:**  
   [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura de Pastas

```
src/
├── app/           # Páginas e rotas (incluindo API)
├── components/    # Componentes reutilizáveis e UI (shadcn/ui)
├── features/      # Features isoladas (carrinho, auth, etc)
├── lib/           # Helpers, SDKs, conexão com banco
├── models/        # Schemas do Mongoose
├── styles/        # CSS global
└── types/         # Tipos globais TypeScript
```

## 🖼️ Upload de Imagens

O upload de imagens é feito via [ImageKit.io](https://imagekit.io/), garantindo performance e otimização.

## 🔒 Autenticação

A autenticação é feita com [Clerk](https://clerk.com/), permitindo login social, magic link, etc.

## 💳 Pagamentos

Integração com [Stripe](https://stripe.com/) para checkout seguro.

## 🛠️ Scripts

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run start` — inicia o servidor em produção
- `npm run lint` — lint do código

## 📄 Licença

Este projeto é open-source e está sob a licença [MIT](LICENSE).

---

Desenvolvido por [Studio a laser coelho](https://github.com/seu-usuario).
