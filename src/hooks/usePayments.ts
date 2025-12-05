import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TripPayment {
  id: string;
  trip_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  amount: number;
  commission_amount: number;
  driver_amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  user_name: string;
  user_email: string | null;
  driver_name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommissionSettings {
  id: string;
  commission_percentage: number;
  min_commission: number;
  is_active: boolean;
}

export const usePayments = () => {
  const [payments, setPayments] = useState<TripPayment[]>([]);
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trip_payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los pagos",
        variant: "destructive",
      });
    } else {
      setPayments(data as TripPayment[]);
    }
    setLoading(false);
  };

  const fetchCommissionSettings = async () => {
    const { data, error } = await supabase
      .from("commission_settings")
      .select("*")
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("Error fetching commission settings:", error);
    } else if (data) {
      setCommissionSettings(data as CommissionSettings);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchCommissionSettings();

    const channel = supabase
      .channel("payments-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trip_payments" },
        () => fetchPayments()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createPayment = async (paymentData: {
    tripId?: string;
    amount: number;
    userName: string;
    userEmail?: string;
    driverName?: string;
    description?: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke("create-trip-payment", {
        body: {
          ...paymentData,
          commissionPercentage: commissionSettings?.commission_percentage || 15,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast({
          title: "Redirigiendo al pago",
          description: "Se abrirá una nueva ventana para completar el pago",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar el pago",
        variant: "destructive",
      });
      return false;
    }
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("trip_payments")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating payment:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pago",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Pago actualizado",
      description: "El estado del pago se ha actualizado",
    });
    return true;
  };

  const getPaymentStats = () => {
    const totalAmount = payments.reduce((sum, p) => p.status === 'succeeded' ? sum + p.amount : sum, 0);
    const totalCommission = payments.reduce((sum, p) => p.status === 'succeeded' ? sum + p.commission_amount : sum, 0);
    const totalDriverAmount = payments.reduce((sum, p) => p.status === 'succeeded' ? sum + p.driver_amount : sum, 0);
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const completedPayments = payments.filter(p => p.status === 'succeeded').length;

    return {
      totalAmount,
      totalCommission,
      totalDriverAmount,
      pendingPayments,
      completedPayments,
      totalPayments: payments.length,
    };
  };

  return {
    payments,
    commissionSettings,
    loading,
    createPayment,
    updatePaymentStatus,
    getPaymentStats,
    refetch: fetchPayments,
  };
};
