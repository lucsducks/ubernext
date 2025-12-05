-- Create driver_goals table for earnings goals
CREATE TABLE public.driver_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_name TEXT NOT NULL,
  goal_type TEXT NOT NULL DEFAULT 'monthly', -- daily, weekly, monthly
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC NOT NULL DEFAULT 0,
  target_trips INTEGER DEFAULT NULL,
  current_trips INTEGER NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, completed, expired
  bonus_amount NUMERIC DEFAULT 0,
  bonus_percentage NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bonus_records table for tracking earned bonuses
CREATE TABLE public.bonus_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_name TEXT NOT NULL,
  goal_id UUID REFERENCES public.driver_goals(id),
  bonus_type TEXT NOT NULL, -- goal_completion, performance, referral, loyalty
  amount NUMERIC NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on both tables
ALTER TABLE public.driver_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for driver_goals
CREATE POLICY "Allow read driver goals" ON public.driver_goals FOR SELECT USING (true);
CREATE POLICY "Allow insert driver goals" ON public.driver_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update driver goals" ON public.driver_goals FOR UPDATE USING (true);
CREATE POLICY "Allow delete driver goals" ON public.driver_goals FOR DELETE USING (true);

-- RLS Policies for bonus_records
CREATE POLICY "Allow read bonus records" ON public.bonus_records FOR SELECT USING (true);
CREATE POLICY "Allow insert bonus records" ON public.bonus_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update bonus records" ON public.bonus_records FOR UPDATE USING (true);