import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ScheduledTrip {
  id: string;
  user_name: string;
  phone: string | null;
  origin_address: string;
  origin_lat: number | null;
  origin_lng: number | null;
  destination_address: string;
  destination_lat: number | null;
  destination_lng: number | null;
  scheduled_date: string;
  passengers_count: number;
  is_shared: boolean;
  estimated_price: number | null;
  status: string;
  driver_id: string | null;
  driver_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SharedPassenger {
  id: string;
  trip_id: string;
  passenger_name: string;
  phone: string | null;
  pickup_address: string;
  pickup_lat: number | null;
  pickup_lng: number | null;
  status: string;
  created_at: string;
}

export const useScheduledTrips = () => {
  const [trips, setTrips] = useState<ScheduledTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scheduled_trips")
      .select("*")
      .order("scheduled_date", { ascending: true });

    if (error) {
      console.error("Error fetching trips:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los viajes",
        variant: "destructive",
      });
    } else {
      setTrips(data as ScheduledTrip[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();

    const channel = supabase
      .channel("scheduled-trips-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scheduled_trips" },
        () => fetchTrips()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTrip = async (trip: Omit<ScheduledTrip, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("scheduled_trips").insert([trip]);

    if (error) {
      console.error("Error adding trip:", error);
      toast({
        title: "Error",
        description: "No se pudo programar el viaje",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Viaje programado",
      description: "El viaje se ha programado exitosamente",
    });
    return true;
  };

  const updateTrip = async (id: string, updates: Partial<ScheduledTrip>) => {
    const { error } = await supabase
      .from("scheduled_trips")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating trip:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el viaje",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Viaje actualizado",
      description: "El viaje se ha actualizado exitosamente",
    });
    return true;
  };

  const deleteTrip = async (id: string) => {
    const { error } = await supabase
      .from("scheduled_trips")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting trip:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el viaje",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Viaje eliminado",
      description: "El viaje se ha eliminado exitosamente",
    });
    return true;
  };

  const joinSharedTrip = async (tripId: string, passenger: Omit<SharedPassenger, "id" | "trip_id" | "created_at">) => {
    const { error } = await supabase
      .from("shared_trip_passengers")
      .insert([{ ...passenger, trip_id: tripId }]);

    if (error) {
      console.error("Error joining trip:", error);
      toast({
        title: "Error",
        description: "No se pudo unir al viaje compartido",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Unido al viaje",
      description: "Te has unido al viaje compartido exitosamente",
    });
    return true;
  };

  return {
    trips,
    loading,
    addTrip,
    updateTrip,
    deleteTrip,
    joinSharedTrip,
    refetch: fetchTrips,
  };
};
