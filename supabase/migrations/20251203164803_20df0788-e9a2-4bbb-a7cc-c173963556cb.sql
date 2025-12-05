-- Tabla para viajes programados
CREATE TABLE public.scheduled_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  phone TEXT,
  origin_address TEXT NOT NULL,
  origin_lat NUMERIC,
  origin_lng NUMERIC,
  destination_address TEXT NOT NULL,
  destination_lat NUMERIC,
  destination_lng NUMERIC,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  passengers_count INTEGER NOT NULL DEFAULT 1,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  estimated_price NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  driver_id TEXT,
  driver_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para pasajeros que se unen a viajes compartidos
CREATE TABLE public.shared_trip_passengers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.scheduled_trips(id) ON DELETE CASCADE,
  passenger_name TEXT NOT NULL,
  phone TEXT,
  pickup_address TEXT NOT NULL,
  pickup_lat NUMERIC,
  pickup_lng NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para tickets de soporte
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  user_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to TEXT,
  resolution TEXT,
  related_trip_id UUID REFERENCES public.scheduled_trips(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Tabla para mensajes/respuestas de tickets
CREATE TABLE public.ticket_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.scheduled_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_trip_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para scheduled_trips
CREATE POLICY "Allow read scheduled trips" ON public.scheduled_trips FOR SELECT USING (true);
CREATE POLICY "Allow insert scheduled trips" ON public.scheduled_trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update scheduled trips" ON public.scheduled_trips FOR UPDATE USING (true);
CREATE POLICY "Allow delete scheduled trips" ON public.scheduled_trips FOR DELETE USING (true);

-- Políticas RLS para shared_trip_passengers
CREATE POLICY "Allow read shared passengers" ON public.shared_trip_passengers FOR SELECT USING (true);
CREATE POLICY "Allow insert shared passengers" ON public.shared_trip_passengers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update shared passengers" ON public.shared_trip_passengers FOR UPDATE USING (true);
CREATE POLICY "Allow delete shared passengers" ON public.shared_trip_passengers FOR DELETE USING (true);

-- Políticas RLS para support_tickets
CREATE POLICY "Allow read support tickets" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "Allow insert support tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update support tickets" ON public.support_tickets FOR UPDATE USING (true);

-- Políticas RLS para ticket_messages
CREATE POLICY "Allow read ticket messages" ON public.ticket_messages FOR SELECT USING (true);
CREATE POLICY "Allow insert ticket messages" ON public.ticket_messages FOR INSERT WITH CHECK (true);

-- Triggers para updated_at
CREATE TRIGGER update_scheduled_trips_updated_at
  BEFORE UPDATE ON public.scheduled_trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;