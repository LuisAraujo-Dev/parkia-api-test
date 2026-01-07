🅿️ PARKIA – Plataforma de Estacionamentos Inteligentes

O PARKIA é uma plataforma completa de gestão de estacionamentos inteligentes, desenvolvida como desafio técnico, com foco em arquitetura limpa, regras de negócio bem definidas e experiência do desenvolvedor.

O sistema permite:

Controle de ocupação de vagas em tempo real

Registro de entradas e saídas de veículos

Cálculo automático de tarifas

Dashboard com métricas operacionais e financeiras

🚀 Tecnologias Utilizadas
Backend

NestJS v11 — Framework Node.js modular, escalável e orientado a boas práticas

TypeORM + PostgreSQL — Persistência de dados relacional robusta

TypeScript — Tipagem estática para maior segurança e manutenibilidade

Frontend

React 18 — Interface reativa baseada em componentes

Tailwind CSS v4 — Engine moderna de estilização, com alto desempenho

Lucide React — Biblioteca de ícones leve e consistente

Infraestrutura

Docker & Docker Compose — Orquestração completa do ambiente de desenvolvimento

🛠️ Como Executar o Projeto
1. Pré-requisitos

Docker e Docker Compose (método recomendado)

ou

Node.js v20+

PostgreSQL (porta 5444)

2. Executando com Docker (Recomendado)

Na raiz do repositório, execute:

docker compose up -d


Esse comando irá subir:

Banco de dados PostgreSQL

API Backend (NestJS)

Frontend Web (React)

3. Execução Manual (Modo Desenvolvimento)
Passo 1: Instalar dependências
# Backend
cd parkia-api
npm install

# Frontend
cd ../parkia-web
npm install

Passo 2: Executar a API
cd parkia-api
npm run start:dev

Passo 3: Executar o Frontend
cd parkia-web
npm run dev

🌐 Acesso ao Sistema

Interface Web: http://localhost:5173

API Base URL: http://localhost:3000

📑 Exemplos de Uso da API
🚗 Vagas

Listar vagas (com filtros):

GET /vagas?status=livre&tipo=carro


Criar nova vaga:

curl -X POST http://localhost:3000/vagas \
-H "Content-Type: application/json" \
-d '{"numero": "A-10", "tipo": "carro"}'


Estatísticas do dashboard:

GET /vagas/estatisticas

🔁 Movimentações

Registrar entrada de veículo:

curl -X POST http://localhost:3000/movimentacoes/entrada \
-H "Content-Type: application/json" \
-d '{"vaga_id": "UUID_DA_VAGA", "placa": "ABC-1234", "tipo_veiculo": "carro"}'


Registrar saída (com cálculo automático):

curl -X POST http://localhost:3000/movimentacoes/saida \
-H "Content-Type: application/json" \
-d '{"placa": "ABC-1234"}'

⚖️ Regras de Negócio Implementadas

Tolerância: Permanências de até 15 minutos não geram cobrança

Cálculo de tarifa:

Valor fixo para a primeira hora

Horas adicionais arredondadas para cima

Segurança de vagas:

Bloqueio de entrada em vagas ocupadas ou em manutenção

Gestão de vagas:

Vagas só podem ser excluídas quando estiverem livres

Compatibilidade de veículos:

Motos podem ocupar vagas de carros

Carros não podem ocupar vagas de motos

📂 Estrutura do Monorepo
parkia-api/        # Backend em NestJS
parkia-web/        # Frontend em React + Tailwind CSS v4
docker-compose.yml # Orquestração do ambiente completo

👨‍💻 Autor

Desenvolvido por Luís Araújo
📅 Janeiro de 2026