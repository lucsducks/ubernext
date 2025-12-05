-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  related_to TEXT, -- 'driver', 'trip', 'system'
  related_id TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura de todas las notificaciones (para administradores)
CREATE POLICY "Permitir lectura de notificaciones"
  ON public.notifications
  FOR SELECT
  USING (true);

-- Política para permitir inserción de notificaciones
CREATE POLICY "Permitir crear notificaciones"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir actualización (marcar como leída)
CREATE POLICY "Permitir actualizar notificaciones"
  ON public.notifications
  FOR UPDATE
  USING (true);

-- Habilitar realtime para la tabla de notificaciones
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- Insertar notificaciones de ejemplo
INSERT INTO public.notifications (title, message, type, related_to, related_id) VALUES
  ('Nuevo Conductor Registrado', 'Carlos Mendoza ha completado su registro exitosamente', 'success', 'driver', 'DRV-001'),
  ('Viaje Completado', 'Viaje #12345 completado con calificación de 5 estrellas', 'success', 'trip', 'TRIP-12345'),
  ('Alerta de Mantenimiento', 'Vehículo ABC-123-XYZ requiere verificación', 'warning', 'driver', 'DRV-001'),
  ('Documento por Vencer', 'Verificación vehicular de Carlos Mendoza vence en 7 días', 'warning', 'driver', 'DRV-001'),
  ('Sistema Actualizado', 'Nueva versión del sistema desplegada exitosamente', 'info', 'system', null);