-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create maintenance_schedules table
CREATE TABLE public.maintenance_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  cost DECIMAL(10, 2),
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for maintenance_schedules
CREATE POLICY "Allow read maintenance schedules" 
ON public.maintenance_schedules 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert maintenance schedules" 
ON public.maintenance_schedules 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update maintenance schedules" 
ON public.maintenance_schedules 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow delete maintenance schedules" 
ON public.maintenance_schedules 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_maintenance_schedules_updated_at
BEFORE UPDATE ON public.maintenance_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for maintenance_schedules
ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_schedules;

-- Insert sample maintenance data
INSERT INTO public.maintenance_schedules (vehicle_id, driver_name, service_type, scheduled_date, status, priority, cost, notes) VALUES
('ABC-123', 'Carlos Rodríguez', 'Cambio de aceite', NOW() + INTERVAL '3 days', 'scheduled', 'normal', 45.00, 'Mantenimiento regular cada 5,000 km'),
('XYZ-789', 'María García', 'Revisión de frenos', NOW() + INTERVAL '7 days', 'scheduled', 'high', 120.00, 'Cliente reportó ruido al frenar'),
('DEF-456', 'Juan Pérez', 'Rotación de neumáticos', NOW() + INTERVAL '5 days', 'scheduled', 'normal', 60.00, 'Mantenimiento preventivo'),
('GHI-789', 'Ana Martínez', 'Inspección general', NOW() + INTERVAL '10 days', 'scheduled', 'low', 80.00, 'Inspección anual requerida'),
('ABC-123', 'Carlos Rodríguez', 'Cambio de filtros', NOW() - INTERVAL '2 days', 'completed', 'normal', 35.00, 'Completado exitosamente'),
('JKL-012', 'Pedro Sánchez', 'Alineación y balanceo', NOW() + INTERVAL '1 day', 'scheduled', 'urgent', 95.00, 'Vibración reportada en el volante');