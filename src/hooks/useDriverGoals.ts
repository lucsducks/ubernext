import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DriverGoal {
  id: string;
  driver_name: string;
  goal_type: string;
  target_amount: number;
  current_amount: number;
  target_trips: number | null;
  current_trips: number;
  start_date: string;
  end_date: string;
  status: string;
  bonus_amount: number;
  bonus_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface BonusRecord {
  id: string;
  driver_name: string;
  goal_id: string | null;
  bonus_type: string;
  amount: number;
  description: string | null;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export interface CreateGoalData {
  driver_name: string;
  goal_type: string;
  target_amount: number;
  target_trips?: number;
  start_date: string;
  end_date: string;
  bonus_amount?: number;
  bonus_percentage?: number;
}

export interface CreateBonusData {
  driver_name: string;
  goal_id?: string;
  bonus_type: string;
  amount: number;
  description?: string;
}

export const useDriverGoals = () => {
  const [goals, setGoals] = useState<DriverGoal[]>([]);
  const [bonuses, setBonuses] = useState<BonusRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from("driver_goals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las metas",
        variant: "destructive",
      });
    } else {
      setGoals(data || []);
    }
  };

  const fetchBonuses = async () => {
    const { data, error } = await supabase
      .from("bonus_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bonuses:", error);
    } else {
      setBonuses(data || []);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchGoals(), fetchBonuses()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const createGoal = async (goalData: CreateGoalData) => {
    const { data, error } = await supabase
      .from("driver_goals")
      .insert([goalData])
      .select()
      .single();

    if (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la meta",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Meta creada",
      description: "La meta se ha creado correctamente",
    });
    fetchGoals();
    return data;
  };

  const updateGoal = async (id: string, updates: Partial<DriverGoal>) => {
    const { error } = await supabase
      .from("driver_goals")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating goal:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la meta",
        variant: "destructive",
      });
      return false;
    }

    fetchGoals();
    return true;
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase
      .from("driver_goals")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la meta",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Meta eliminada",
      description: "La meta se ha eliminado correctamente",
    });
    fetchGoals();
    return true;
  };

  const createBonus = async (bonusData: CreateBonusData) => {
    const { data, error } = await supabase
      .from("bonus_records")
      .insert([bonusData])
      .select()
      .single();

    if (error) {
      console.error("Error creating bonus:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la bonificación",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Bonificación creada",
      description: "La bonificación se ha registrado correctamente",
    });
    fetchBonuses();
    return data;
  };

  const updateBonusStatus = async (id: string, status: string) => {
    const updates: Partial<BonusRecord> = { status };
    if (status === "paid") {
      updates.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("bonus_records")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating bonus:", error);
      return false;
    }

    fetchBonuses();
    return true;
  };

  const getGoalProgress = (goal: DriverGoal) => {
    return (goal.current_amount / goal.target_amount) * 100;
  };

  const getDriverStats = (driverName: string) => {
    const driverGoals = goals.filter((g) => g.driver_name === driverName);
    const driverBonuses = bonuses.filter((b) => b.driver_name === driverName);

    const activeGoals = driverGoals.filter((g) => g.status === "active");
    const completedGoals = driverGoals.filter((g) => g.status === "completed");
    const totalBonusEarned = driverBonuses
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + b.amount, 0);
    const pendingBonus = driverBonuses
      .filter((b) => b.status === "pending")
      .reduce((sum, b) => sum + b.amount, 0);

    return {
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      totalBonusEarned,
      pendingBonus,
    };
  };

  return {
    goals,
    bonuses,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    createBonus,
    updateBonusStatus,
    getGoalProgress,
    getDriverStats,
    refetch: fetchAll,
  };
};
