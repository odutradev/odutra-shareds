# Shareds - Gerenciador de Micro-Páginas e Redirecionamentos

**Shareds** é uma aplicação web moderna desenvolvida em React que permite criar, hospedar, gerenciar e monitorar micro-páginas (HTML/CSS/JS) e links de redirecionamento. O sistema oferece um painel administrativo completo com editor de código integrado, métricas de acesso detalhadas e gestão de configurações.

Este projeto foi construído para funcionar nativamente com o **PocketDB** como backend (BaaS), utilizando sua estrutura Key-Value para persistência de dados e analytics.

## 🚀 Funcionalidades

### 🖥️ Gestão de Conteúdo

  * **Criação de Páginas Customizadas**: Editor de código integrado (Monaco Editor) para HTML, CSS e JavaScript.

  * **Redirecionamentos Inteligentes**: Criação de links curtos que redirecionam para URLs externas.

  * **Slugs Personalizados**: Defina URLs amigáveis (ex: `seusite.com/promocao`) ou gere IDs aleatórios.

  * **Controle de Visibilidade**: Ative ou desative compartilhamentos instantaneamente.

### 📊 Analytics e Métricas

  * **Dashboard de Visão Geral**: Gráficos de área mostrando a evolução de visualizações nos últimos 14 dias.

  * **Métricas de Tempo**: Monitoramento do tempo médio e total que os usuários passam em suas páginas.

  * **Contadores em Tempo Real**: Total de views, pings de atividade e status de cada link.

### ⚙️ Administração e Sistema

  * **Autenticação Simplificada**: Acesso ao painel administrativo via PIN de segurança.

  * **Backup e Restauração**: Exporte todos os seus dados (páginas e métricas) para JSON e restaure quando necessário.

  * **Temas**: Suporte nativo a Light Mode e Dark Mode.

  * **Design Responsivo**: Interface adaptável para desktop e mobile construída com Material UI.

## 🛠️ Tecnologias Utilizadas

  * **Core**: React 19, TypeScript, Vite

  * **UI/UX**: Material UI (v7), Styled Components, Phosphor/MUI Icons

  * **Estado**: Zustand (com persistência local)

  * **Roteamento**: React Router DOM v7

  * **Editor**: Monaco Editor (VS Code web)

  * **Gráficos**: Recharts

  * **HTTP Client**: Axios

  * **Feedback**: React Toastify

## 🔧 Pré-requisitos

  * **Node.js** (versão 18+)

  * Uma instância do **PocketDB API** rodando (local ou remota).

## 📦 Instalação e Configuração

1.  **Clone o repositório**

    ```bash
    git clone https://github.com/odutradev/odutra-shareds
    cd odutra-shareds
    ```

2.  **Instale as dependências**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**
    Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

    ```env
    # URL da API do PocketDB
    VITE_BASEURL=http://localhost:1000

    # Token de Acesso do Projeto (Gerado pelo PocketDB via 'npm run control-access')
    VITE_CONTROL_ACCESS=seu_token_jwt_aqui

    # PIN para acesso ao painel administrativo
    VITE_PIN=123456

    # Define se é ambiente de produção (true/false)
    VITE_PRODUCTION=false
    ```

4.  **Execute em Desenvolvimento**

    ```bash
    npm run dev
    ```