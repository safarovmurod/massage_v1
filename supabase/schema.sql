-- ============================================
-- Cupping Massage — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- === PROFILES ===
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- === LEADS ===
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  preferred_time TEXT,
  for_whom TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- === SITE CONTENT (editable texts) ===
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- === SITE SETTINGS (contacts, WhatsApp, etc) ===
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- === SERVICES ===
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- === ANALYTICS EVENTS ===
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- === ADMIN ACTIVITY LOG ===
CREATE TABLE IF NOT EXISTS admin_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;

-- === PROFILES: users can see only their own profile ===
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can see all profiles
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- === LEADS: only admins ===
CREATE POLICY "Admins can read leads" ON leads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update leads" ON leads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Public can submit leads (insert only)
CREATE POLICY "Anyone can submit leads" ON leads
  FOR INSERT WITH CHECK (true);

-- === SITE CONTENT: only admins ===
CREATE POLICY "Admins can read content" ON site_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can write content" ON site_content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- === SITE SETTINGS: only admins can write, public can read ===
CREATE POLICY "Public can read settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can write settings" ON site_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- === SERVICES: public read, admin write ===
CREATE POLICY "Public can read services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can write services" ON services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- === ANALYTICS: public can insert, admins can read ===
CREATE POLICY "Anyone can insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- === ADMIN ACTIVITY: admins only ===
CREATE POLICY "Admins can read activity" ON admin_activity
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert activity" ON admin_activity
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INITIAL CONTENT (optional seed data)
-- ============================================
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '992007336264'),
  ('instagram_url', 'https://www.instagram.com/safarovvv.i8/'),
  ('address', 'Зарафшон 22/1'),
  ('map_url', 'https://maps.app.goo.gl/Z6nT8PEVyGF8H6a26'),
  ('working_hours_ru', 'Душ – Якшанбе: 9:00 – 19:00'),
  ('working_hours_tj', 'Душ – Якшанбе: 9:00 – 19:00'),
  ('working_hours_en', 'Mon – Sun: 9:00 – 19:00'),
  ('wa_msg_ru', 'Здравствуйте! Я хочу узнать подробнее о баночном массаже и записаться на процедуру.'),
  ('wa_msg_tj', 'Салом! Ман мехоҳам дар бораи массажи бонкагӣ маълумот гирам ва нависам.'),
  ('wa_msg_en', 'Hello! I would like to know more about cupping massage and book an appointment.')
ON CONFLICT (key) DO NOTHING;

-- === HOW TO MAKE A USER ADMIN ===
-- Run this in SQL Editor to give admin role to a user:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
