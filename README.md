# ClariFi

ClariFi is a full-stack AI-powered learning and mock-interview application. It features a Python/FastAPI backend using LangChain and ChromaDB for Retrieval-Augmented Generation (RAG), and a Next.js/React frontend with Supabase (Authentication/Database) and Stripe (Payments) integration.

## Project Structure
- `/` - Root directory containing the Python backend (`api_server.py`) and vector database (`chroma_db`).
- `/frontend` - Next.js frontend application.

---

## 🚀 Quick Start (Windows)

The easiest way to start the entire application is to use the provided batch script.

1. Ensure all prerequisites (Python, Node.js) are installed.
2. Ensure you have set up your `.env` files (see the Environment Variables section below).
3. Double-click or run the `run_app.bat` file in the root directory:
   ```cmd
   .\run_app.bat
   ```
This script will automatically open two command prompts: one starting the FastAPI backend on port 8000, and another starting the Next.js frontend on port 3000.

---

## 🛠️ Manual Setup & Installation

If you prefer to start the servers manually or are setting up the project for the first time, follow these steps.

### 1. Backend Setup (Python / FastAPI)

1. Open a terminal in the root directory.
2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the root directory and add your API keys (see below).
5. Start the backend server:
   ```bash
   python api_server.py
   ```
   *The backend API documentation will be available at `http://localhost:8000/docs`.*

### 2. Frontend Setup (Next.js / Node.js)

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend/` directory and add your keys (see below).
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend application will be available at `http://localhost:3000`.*

---

## 🔐 Environment Variables

You need to create two environment variable files, one for the backend and one for the frontend.

### Backend (`/.env`)
Create a file named `.env` in the root folder with the following keys:
```env
# Your Groq API Key for LLM processing
GROQ_API_KEY=your_groq_api_key_here

# Enable or disable RAG functionality
ENABLE_RAG=true
```

### Frontend (`/frontend/.env.local`)
Create a file named `.env.local` inside the `frontend` folder with the following keys:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (Use sk_test_... for local dev, sk_live_... for production)
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 💳 Testing Stripe Payments

To test stripe payments locally without charging a real credit card:
1. Ensure `STRIPE_SECRET_KEY` in `frontend/.env.local` is set to your **Test Mode** key (`sk_test_...`).
2. Restart the frontend server.
3. Use the following test card during checkout:
   - **Card Number:** `4242 4242 4242 4242`
   - **Expiry:** Any date in the future
   - **CVC:** Any 3 digits
   - **Zip:** Any postal code

*To switch to live payments, replace the test key with your live key (`sk_live_...`) in your production environment (e.g., Vercel) and locally if you want to test a real purchase.*
