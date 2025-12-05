-- Tabla para pagos de viajes
CREATE TABLE public.trip_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.scheduled_trips(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  amount NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  driver_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'mxn',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  user_name TEXT NOT NULL,
  user_email TEXT,
  driver_name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.trip_payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Allow read trip payments" ON public.trip_payments FOR SELECT USING (true);
CREATE POLICY "Allow insert trip payments" ON public.trip_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update trip payments" ON public.trip_payments FOR UPDATE USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_trip_payments_updated_at
  BEFORE UPDATE ON public.trip_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Tabla para configuración de comisiones
CREATE TABLE public.commission_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  commission_percentage NUMERIC NOT NULL DEFAULT 15,
  min_commission NUMERIC NOT NULL DEFAULT 5,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.commission_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read commission settings" ON public.commission_settings FOR SELECT USING (true);
CREATE POLICY "Allow update commission settings" ON public.commission_settings FOR UPDATE USING (true);

-- Insertar configuración por defecto
INSERT INTO public.commission_settings (commission_percentage, min_commission) VALUES (15, 5);

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_payments;