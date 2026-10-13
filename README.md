# Messaging App: Frontend

Frontend de uma aplicação de mensagens em tempo real. Permite criar conta, iniciar sessão, procurar pessoas, trocar mensagens privadas, acompanhar a presença dos contactos e editar o perfil.

Desenvolvido como parte do percurso [Node.js do The Odin Project](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs).

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white)

- **Aplicação:** [messagingapp-git-main-jormaedes-projects.vercel.app](https://messagingapp-git-main-jormaedes-projects.vercel.app/)
- **Backend:** [github.com/jormaedes/messaging-app-backend](https://github.com/jormaedes/messaging-app-backend)

---

## Índice

1. [Funcionalidades](#funcionalidades)
2. [Tecnologias](#tecnologias)
3. [Estrutura](#estrutura)
4. [Começar](#começar)
5. [Variáveis de ambiente](#variáveis-de-ambiente)
6. [Scripts](#scripts)
7. [Como funciona](#como-funciona)
8. [Deploy](#deploy)
9. [Limitações](#limitações)

## Funcionalidades

- Registo, início de sessão e terminação de sessão.
- Restauro da sessão autenticada entre visitas.
- Lista de conversas privadas, com pré-visualização e contagem de mensagens não lidas.
- Pesquisa de conversas e pesquisa de pessoas por nome de utilizador.
- Abertura ou recuperação de uma conversa privada existente.
- Envio e receção de mensagens em tempo real.
- Histórico paginado de mensagens e carregamento de mensagens anteriores ao percorrer a conversa.
- Envio optimista, tentativa de reenvio de mensagens com falha e confirmação de leitura.
- Estado de ligação, presença online/offline e última actividade.
- Edição do nome de apresentação, biografia e endereço da imagem de perfil.
- Interface responsiva em português, com navegação adaptada a dispositivos móveis.

## Tecnologias

| Área | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Interface | React 19 e TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| Estado no cliente | Zustand 5 |
| Ícones | Lucide React |
| API em tempo real | Socket.IO Client 4 |
| Deploy | Vercel |

## Estrutura

```text
src/
├─ app/
│  ├─ (app)/
│  │  ├─ chat/          # conversas e mensagens
│  │  └─ profile/       # edição do perfil
│  ├─ (auth)/
│  │  ├─ login/         # início de sessão
│  │  └─ signup/        # criação de conta
│  ├─ globals.css       # estilos globais
│  └─ layout.tsx        # layout raiz e metadados
├─ components/
│  ├─ auth/              # componentes de autenticação
│  ├─ chat/              # lista, pesquisa, conversa e compositor
│  ├─ layout/            # cabeçalho da aplicação
│  ├─ profile/           # formulário do perfil
│  └─ ui/                # componentes reutilizáveis
├─ lib/                  # cliente API, socket, tipos e utilitários
└─ stores/               # estado de autenticação, conversas e mensagens
```

## Começar

### Pré-requisitos

- Node.js 20.9 ou superior.
- npm.
- Uma instância do [backend](https://github.com/jormaedes/messaging-app-backend), local ou publicada.

### Instalação

```bash
# Clona este repositório e entra na pasta do projecto
npm install
```

Cria o ficheiro `.env.local` na raiz do projecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Inicia o servidor de desenvolvimento:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Não publiques `.env.local`. O ficheiro não deve conter segredos; `NEXT_PUBLIC_API_URL` é disponibilizada ao navegador.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição | Exemplo local |
|---|---:|---|---|
| `NEXT_PUBLIC_API_URL` | Sim | URL base da API backend. O cliente Socket.IO também se liga a este endereço. | `http://localhost:4000` |

Como a variável começa por `NEXT_PUBLIC_`, o valor é incluído no bundle do navegador. Guarda aqui apenas o URL público do backend, nunca segredos ou credenciais.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o Next.js em desenvolvimento. |
| `npm run lint` | Executa o ESLint. |
| `npm run build` | Cria a compilação de produção. |
| `npm start` | Serve a compilação de produção. Executa depois de `npm run build`. |

## Como funciona

- A autenticação e os dados são obtidos através da API REST do backend.
- O token JWT é guardado no `localStorage` e enviado nas chamadas autenticadas.
- O Socket.IO usa o mesmo endereço configurado em `NEXT_PUBLIC_API_URL` e recebe o token durante a ligação.
- A API REST grava as mensagens; o socket notifica os clientes ligados sobre mensagens, presença e leituras.
- O estado da interface é organizado em stores Zustand para autenticação, conversas, ligação e mensagens.

## Deploy

A aplicação está publicada na [Vercel](https://messagingapp-git-main-jormaedes-projects.vercel.app/).

Para publicar uma nova instância:

1. Importa o repositório frontend na Vercel.
2. Define `NEXT_PUBLIC_API_URL` nas variáveis de ambiente do projecto com o URL público do backend.
3. Confirma que o backend permite, por CORS e Socket.IO, a origem exacta do frontend publicado.
4. Faz o deploy. Sempre que o URL do backend mudar, actualiza a variável e volta a publicar o frontend.

O backend está documentado em [github.com/jormaedes/messaging-app-backend](https://github.com/jormaedes/messaging-app-backend). Consulta esse repositório para configurar a base de dados, JWT, CORS e o servidor de sockets.

## Limitações

- A interface suporta actualmente conversas privadas. O modelo do backend prevê grupos, mas a gestão de grupos ainda não está implementada.
- As imagens de perfil são carregadas a partir de um URL; não há carregamento de ficheiros.
- É necessária uma ligação activa ao backend para autenticação, conversas e mensagens.

## Autor

**Jormaedes** · [GitHub](https://github.com/jormaedes) · [LinkedIn](https://www.linkedin.com/in/jormaedes)