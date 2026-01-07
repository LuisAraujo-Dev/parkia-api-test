# 🅿️ PARKIA – Plataforma de Estacionamentos Inteligentes

O **PARKIA** é um sistema completo de gestão de estacionamentos desenvolvido como um desafio técnico. Ele permite o controle de ocupação de vagas em tempo real, gestão de movimentações (entrada e saída) com cálculo automático de tarifas e um dashboard para visualização de métricas financeiras e operacionais.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **NestJS v11**: Framework escalável e modular para Node.js.
- **TypeORM & PostgreSQL**: Modelagem de dados e persistência robusta.
- **TypeScript**: Tipagem estrita para maior segurança e manutenibilidade.

### Frontend
- **React 18**: Biblioteca para interfaces reativas e componentes reutilizáveis.
- **Tailwind CSS v4**: Novo motor de estilização nativo de alta performance.
- **Lucide React**: Conjunto de ícones modernos e leves.

---

## 🛠️ Como Executar o Projeto

### 1. Pré-requisitos
- **Docker** e **Docker Compose** instalados (método recomendado).
- Ou **Node.js (v20+)** e **PostgreSQL** (porta 5444) instalados localmente.

### 2. Rodando com Docker (Diferencial)
Na raiz do repositório, execute o comando abaixo para subir o Banco de Dados, a API e o Frontend simultaneamente:
```bash
docker compose up -d

3. Execução Manual (Desenvolvimento)
Passo 1: Instalar Dependências
# Na raiz do projeto
cd parkia-api && npm install
cd ../parkia-web && npm install

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
Vagas
Listar Vagas (com filtros): GET /vagas?status=livre&tipo=carro

Criar Nova Vaga:
curl -X POST http://localhost:3000/vagas \
-H "Content-Type: application/json" \
-d '{"numero": "A-10", "tipo": "carro"}'
Estatísticas do Dashboard: GET /vagas/estatisticas

Movimentações
Registrar Entrada:
curl -X POST http://localhost:3000/movimentacoes/entrada \
-H "Content-Type: application/json" \
-d '{"vaga_id": "UUID_DA_VAGA", "placa": "ABC-1234", "tipo_veiculo": "carro"}'

Registrar Saída (Cálculo automático):
curl -X POST http://localhost:3000/movimentacoes/saida \
-H "Content-Type: application/json" \
-d '{"placa": "ABC-1234"}'

⚖️ Regras de Negócio Implementadas
Tolerância: Permanências de até 15 minutos possuem custo zero.

Cálculo de Tarifa: Cobrança baseada em valor fixo para a primeira hora + horas adicionais arredondadas para cima.

Segurança de Vaga: Bloqueio de entrada em vagas ocupadas ou em manutenção.

Gestão de Vagas: Bloqueio de exclusão para vagas que não estejam livres.

Compatibilidade: Validação de tipos de veículos (Motos podem usar vagas de carros, mas o inverso é bloqueado).

📂 Estrutura do Monorepo
parkia-api/: Backend em NestJS.

parkia-web/: Frontend em React + Tailwind v4.

docker-compose.yml: Orquestração total do ambiente.

Desenvolvido por: Luis Araujo (Janeiro/2026).