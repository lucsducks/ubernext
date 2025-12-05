import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_name: string;
  email: string | null;
  phone: string | null;
  category: string;
  priority: string;
  subject: string;
  description: string;
  status: string;
  assigned_to: string | null;
  resolution: string | null;
  related_trip_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const generateTicketNumber = () => {
  const prefix = "TKT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tickets:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive",
      });
    } else {
      setTickets(data as SupportTicket[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();

    const channel = supabase
      .channel("support-tickets-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => fetchTickets()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createTicket = async (
    ticket: Omit<SupportTicket, "id" | "ticket_number" | "created_at" | "updated_at" | "resolved_at">
  ) => {
    const ticketNumber = generateTicketNumber();
    const { error } = await supabase
      .from("support_tickets")
      .insert([{ ...ticket, ticket_number: ticketNumber }]);

    if (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el ticket",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Ticket creado",
      description: `Tu ticket ${ticketNumber} ha sido creado exitosamente`,
    });
    return ticketNumber;
  };

  const updateTicket = async (id: string, updates: Partial<SupportTicket>) => {
    const { error } = await supabase
      .from("support_tickets")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el ticket",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Ticket actualizado",
      description: "El ticket se ha actualizado exitosamente",
    });
    return true;
  };

  const addMessage = async (
    ticketId: string,
    message: Omit<TicketMessage, "id" | "ticket_id" | "created_at">
  ) => {
    const { error } = await supabase
      .from("ticket_messages")
      .insert([{ ...message, ticket_id: ticketId }]);

    if (error) {
      console.error("Error adding message:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const getTicketMessages = async (ticketId: string) => {
    const { data, error } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return data as TicketMessage[];
  };

  return {
    tickets,
    loading,
    createTicket,
    updateTicket,
    addMessage,
    getTicketMessages,
    refetch: fetchTickets,
  };
};
