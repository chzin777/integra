# Íntegra Consultoria de Marketing — Site

Site institucional da **Íntegra Consultoria de Marketing**: manifesto, serviços, método, portfólio, planos, depoimentos e formulário de contato.

**Produção:** https://integra-puce.vercel.app

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + CSS por seção (`src/components/*.css`)
- GSAP, Framer Motion e Lenis
- `next-themes` (tema claro/escuro)

## Como rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

Sem variáveis de ambiente.

## Rotas

| Rota  | Descrição |
|-------|-----------|
| `/`   | Versão principal do site |
| `/v2` | Variação de layout (layout e CSS próprios em `src/app/v2`) |

## Estrutura

```
src/
  app/                 layout, home e versão /v2
  components/          Hero, Manifesto, Servicos, Metodo, Portfolio, Planos,
                       Depoimentos, CtaFinal, ModalContato, Flutuante, Nav
  lib/contato.ts       montagem da mensagem/link de contato
  lib/utils.ts         helper `cn`
```

## Deploy

Vercel — cada push na `main` publica automaticamente.
