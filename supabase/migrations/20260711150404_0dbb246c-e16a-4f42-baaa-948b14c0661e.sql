CREATE TABLE public.alertes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alertes TO authenticated;
GRANT ALL ON public.alertes TO service_role;
ALTER TABLE public.alertes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own alertes" ON public.alertes FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX alertes_user_id_idx ON public.alertes(user_id);