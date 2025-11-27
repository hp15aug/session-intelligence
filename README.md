# Session Intelligence Platform

A powerful session recording and analytics platform that leverages AI to provide deep UX insights. Built with Next.js, Supabase, and Google Gemini.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Features

### 🎥 Session Recording & Replay
- **Pixel-Perfect Recording**: Captures every interaction (clicks, scrolls, inputs) using `rrweb`.
- **Smart Buffering**: Efficiently batches events and uploads them to Supabase Storage.
- **High-Fidelity Replay**: Watch user sessions exactly as they happened with a custom player.

### 🧠 AI-Powered Intelligence
- **Gemini 1.5 Flash Integration**: Uses Google's latest model for rapid analysis.
- **Streaming Insights**: Real-time, token-by-token analysis generation.
- **Heuristic Evaluation**: Automatically identifies:
    - **User Flow**: Reconstructs the user's journey.
    - **Core Intent**: Classifies behavior (Navigational, Transactional, etc.).
    - **UX Friction**: Pinpoints rage clicks, confusion, and abandonment.
- **Claude-Like Interface**: A clean, document-style side panel for reading reports.

### 📊 Dashboard
- **Session List**: Filterable view of all recorded sessions.
- **Metadata**: Tracks duration, event count, device info, and location.
- **Modern UI**: Built with Tailwind CSS for a premium look and feel.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL + Blob Storage)
- **AI Model**: [Google Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/)
- **Recording Engine**: [rrweb](https://www.rrweb.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project
- A Google Cloud project with Gemini API access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/session-intelligence.git
   cd session-intelligence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Visit `http://localhost:3000` to start recording sessions.
   Visit `http://localhost:3000/dashboard` to view and analyze them.

## 📝 Database Schema

The project requires a `sessions` table in Supabase:

```sql
create table sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id text,
  url text,
  user_agent text,
  window_width integer,
  window_height integer,
  duration integer default 0,
  event_count integer default 0,
  summary text
);
```

And a storage bucket named `session-recordings`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
