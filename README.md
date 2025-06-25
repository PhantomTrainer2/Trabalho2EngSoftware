# Trabalho 2 de Engenharia de Software

## 💡 Objetivo
Desenvolver uma aplicação web utilizando o framework Flask com Python, aplicando os princípios da **Clean Architecture**, **SOLID** e **testes unitários** bem estruturados.

---

## 📚 Descrição
A aplicação consiste em um sistema de **controle de estoque**, com operações de CRUD para **produtos** e **fornecedores**, dashboard visual com gráficos e design responsivo.

A estrutura foi organizada seguindo a Clean Architecture, separando as responsabilidades entre:
- **Entidades**
- **Casos de uso (usecases)**
- **Interfaces (controllers)**
- **Infraestrutura (adapters, rotas)**

---

## 👥 Grupo

- Breno Pinheiro Gallo de Sá (2110183)  
- Julia Guimarães Simão (2211834)  
- Pedro Antero Simas de Oliveira (2310970)  
- Luiz Eduardo Manzione Raffaini (2220982)  
- João Victor da Silva Francisco (2220756)

---

## 🚀 Como executar o projeto

### 1. 🔧 Backend (Flask + Clean Architecture)

```bash
cd Perfeccionista
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\\Scripts\\activate   # Windows

pip install -r flask
python -m app.main
pip install -r requirements.txt
```

### ▶️ Inicie o servidor
```bash
python main.py
``` 
O backend estará rodando em: http://127.0.0.1:5000

### 2. 🎨 Frontend (Next.js + Tailwind)
```bash
cd Perfeccionista/frontend
npm install
```
### ▶️ Inicie o frontend
```bash
npm run dev
```
A interface estará disponível em: http://localhost:3000

## 🧪 Testes
### Backend
Os testes unitários podem ser executados com:

```bash
cd Perfeccionista/backend
pytest
```

Certifique-se de ter o pytest instalado no ambiente virtual.

## ✅ Tecnologias utilizadas
### Backend:
Python 3.x

Flask
flask-cors
Clean Architecture
SOLID
Pytest

### Frontend:

Next.js
React
TailwindCSS
Lucide Icons
Recharts


### 📦 Dados de exemplo
Você pode popular a base de dados rodando:

```bash
python seed_db.py
```
