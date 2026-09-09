# Баночный массаж — React + Supabase

Premium wellness website with admin dashboard.

## Features

### Public Site
- React + Vite + React Router
- 3 languages: RU / TJ / EN (full i18n)
- Dark / Light theme toggle
- Glassmorphism design, scroll animations
- Yandex Map integration
- WhatsApp integration with localized messages
- Cookie consent
- Mobile-first responsive design

### Admin Dashboard
- Supabase Auth (email/password)
- Supabase Database with Row Level Security
- Routes: /login, /register, /forgot-password, /admin
- Admin sections: Dashboard, Users, Leads, Content, Contacts, Analytics, Settings
- Analytics tracking (page_view, whatsapp_click, instagram_click, form_submit, language_change, login, registration)
- Protected admin routes (role-based access)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create .env file
```bash
cp .env.example .env
```
Add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Supabase database
1. Create a project at https://supabase.com
2. Go to SQL Editor
3. Run the scripts in order: `supabase/schema.sql`, then `migration_02` … `migration_08_leads_limits.sql`
4. Enable Email auth in Authentication settings
5. For the "Continue with Google" button: Authentication → Providers → Google,
   add Client ID / Secret, redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`

### 3.1 Environment variables on Vercel
Project → Settings → Environment Variables. Each variable holds **only its value**,
without the `NAME=` prefix:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | publishable / anon key |

If a value is wrong, the site falls back to the built-in values in
`src/lib/supabase.js` and prints a warning in the browser console.
`VITE_SUPABASE_URL` and the anon key are public by design — they end up in the
JS bundle. Data is protected by RLS policies, never by hiding the key.
**Never put the `service_role` key into any `VITE_*` variable.**

### 4. Make yourself admin
After registering, run in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 5. Run development server
```bash
npm run dev
```

### 6. Build for production
```bash
npm run build
```

## Deploy to GitHub Pages
```bash
npm run build
# Push dist/ to GitHub Pages or use gh-pages package
```

## Tech Stack
- React 18
- Vite 5
- React Router 6
- Supabase (Auth + Database)
- CSS (custom, no framework)
