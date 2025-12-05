import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Maintenance {
  id: string;
  vehicle_id: string;
  driver_name: string;
  service_type: string;
  scheduled_date: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "normal" | "high" | "urgent";
  cost: number | null;
  notes: string | null;
  reminder_sent: boolean;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useMaintenance() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaintenances();

    const channel = supabase
      .channel('maintenance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_schedules'
        },
        (payload) => {
          console.log('Maintenance change:', payload);
          fetchMaintenances();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMaintenances = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setMaintenances((data || []) as Maintenance[]);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      toast.error('Error al cargar mantenimientos');
    } finally {
      setLoading(false);
    }
  };

  const addMaintenance = async (maintenance: Omit<Maintenance, 'id' | 'created_at' | 'updated_at' | 'reminder_sent' | 'completed_date'>) => {
    try {
      const { error } = await supabase
        .from('maintenance_schedules')
        .insert([maintenance]);

      if (error) throw error;
      toast.success('Mantenimiento programado exitosamente');
      return true;
    } catch (error) {
      console.error('Error adding maintenance:', error);
      toast.error('Error al programar mantenimiento');
      return false;
    }
  };

  const updateMaintenance = async (id: string, updates: Partial<Maintenance>) => {
    try {
      const { error } = await supabase
        .from('maintenance_schedules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Mantenimiento actualizado');
      return true;
    } catch (error) {
      console.error('Error updating maintenance:', error);
      toast.error('Error al actualizar mantenimiento');
      return false;
    }
  };

  const deleteMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Mantenimiento eliminado');
      return true;
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      toast.error('Error al eliminar mantenimiento');
      return false;
    }
  };

  return {
    maintenances,
    loading,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
  };
}