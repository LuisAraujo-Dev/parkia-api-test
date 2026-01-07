# 🅿️ PARKIA – Plataforma de Estacionamentos Inteligentes

O **PARKIA** é um sistema de gestão de estacionamentos desenvolvido como um desafio técnico. Ele permite o controle de ocupação de vagas em tempo real, gestão de movimentações (entrada e saída) com cálculo automático de tarifas e um dashboard para visualização de métricas.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS v11**: Framework escalável para Node.js.
- **TypeORM & PostgreSQL**: Modelagem de dados e persistência robusta.
- **TypeScript**: Tipagem estrita para maior segurança de código.

### Frontend
- **React 18**: Biblioteca para interfaces reativas.
- **Tailwind CSS v4**: Novo motor de estilização de alta performance.
- **Lucide React**: Conjunto de ícones modernos.

---

## 🛠️ Como Executar o Projeto

### 1. Pré-requisitos
- **Docker** e **Docker Compose** instalados (recomendado).
- Ou **Node.js (v20+)** e **PostgreSQL** instalados localmente.

### 2. Rodando com Docker (Método mais rápido)
Na raiz do repositório `parkia-challenge`, execute:
```bash
docker compose up -d
Este comando sobe automaticamente o Banco de Dados, a API e o Frontend.

3. Execução Manual (Sem Docker)
Passo 1: Banco de Dados
Certifique-se de ter um banco PostgreSQL rodando na porta 5444 (conforme configurado no projeto) com as seguintes credenciais:

User: luis_admin

Password: parkia_password

DB: parkia_db

Passo 2: Instalar Dependências
Bash

# Na raiz do projeto
cd parkia-api && npm install
cd ../parkia-web && npm install
Passo 3: Executar a API
Bash

cd parkia-api
npm run start:dev
Passo 4: Executar o Frontend
Bash

cd parkia-web
npm run dev
🌐 Acesso ao Sistema
Interface Web: http://localhost:5173

API Base URL: http://localhost:3000

📑 Exemplos de Uso da API
Vagas
Listar Vagas (com filtros): GET /vagas?status=livre&tipo=carro

Criar Nova Vaga:

Bash

curl -X POST http://localhost:3000/vagas \
-H "Content-Type: application/json" \
-d '{"numero": "A-10", "tipo": "carro"}'
Estatísticas do Dashboard: GET /vagas/estatisticas

Movimentações
Registrar Entrada:

Bash

curl -X POST http://localhost:3000/movimentacoes/entrada \
-H "Content-Type: application/json" \
-d '{"vaga_id": "UUID_DA_VAGA", "placa": "ABC-1234", "tipo_veiculo": "carro"}'
Registrar Saída (Retorna valor calculado):

Bash

curl -X POST http://localhost:3000/movimentacoes/saida \
-H "Content-Type: application/json" \
-d '{"placa": "ABC-1234"}'
⚖️ Regras de Negócio Implementadas
Tolerância: Permanências de até 15 minutos não são cobradas.

Cálculo de Tarifa: Cobrança da primeira hora cheia + horas adicionais fracionadas (arredondadas para cima).

Segurança de Vaga: Uma vaga em manutenção ou ocupada não aceita novas entradas.

Gestão de Vagas: Não é permitido excluir vagas que possuam veículos estacionados.

Compatibilidade: Motos podem usar vagas de carros, mas carros são impedidos de usar vagas de motos.

📂 Estrutura do Monorepo
parkia-api/: Código fonte do Backend em NestJS.

parkia-web/: Código fonte do Frontend em React + Tailwind v4.

docker-compose.yml: Orquestração de containers.

Desenvolvido por: Luis Araujo (Janeiro/2026).