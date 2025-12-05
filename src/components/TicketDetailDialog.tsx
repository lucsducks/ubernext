import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Send, 
  User, 
  Headphones, 
  Clock, 
  Tag,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useSupportTickets, SupportTicket, TicketMessage } from "@/hooks/useSupportTickets";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TicketDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket;
}

export const TicketDetailDialog = ({ open, onOpenChange, ticket }: TicketDetailDialogProps) => {
  const { updateTicket, addMessage, getTicketMessages } = useSupportTickets();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && ticket) {
      loadMessages();
    }
  }, [open, ticket]);

  const loadMessages = async () => {
    const msgs = await getTicketMessages(ticket.id);
    setMessages(msgs);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);

    const success = await addMessage(ticket.id, {
      sender_type: "user",
      sender_name: ticket.user_name,
      message: newMessage.trim(),
    });

    if (success) {
      setNewMessage("");
      loadMessages();
    }
    setLoading(false);
  };

  const handleStatusChange = async (status: string) => {
    await updateTicket(ticket.id, {
      status,
      resolved_at: status === "resolved" ? new Date().toISOString() : null,
    });
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { class: string; label: string }> = {
      open: { class: "bg-accent text-accent-foreground", label: "Abierto" },
      in_progress: { class: "bg-primary text-primary-foreground", label: "En proceso" },
      resolved: { class: "bg-secondary text-secondary-foreground", label: "Resuelto" },
      closed: { class: "bg-muted text-muted-foreground", label: "Cerrado" },
    };
    const { class: className, label } = config[status] || config.open;
    return <Badge className={className}>{label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { class: string; label: string }> = {
      low: { class: "bg-muted text-muted-foreground", label: "Baja" },
      normal: { class: "bg-secondary/50 text-secondary-foreground", label: "Normal" },
      high: { class: "bg-accent text-accent-foreground", label: "Alta" },
      urgent: { class: "bg-destructive text-destructive-foreground", label: "Urgente" },
    };
    const { class: className, label } = config[priority] || config.normal;
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const categoryLabels: Record<string, string> = {
    trip: "Problema con viaje",
    payment: "Pagos y facturación",
    account: "Mi cuenta",
    safety: "Seguridad",
    driver: "Conductor",
    app: "Problema técnico",
    other: "Otro",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-muted-foreground">
                {ticket.ticket_number}
              </p>
              <DialogTitle className="text-xl">{ticket.subject}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Ticket Info */}
          <Card className="p-4 mb-4 bg-muted/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Usuario
                </p>
                <p className="font-medium">{ticket.user_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Categoría
                </p>
                <p className="font-medium">{categoryLabels[ticket.category]}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Creado
                </p>
                <p className="font-medium">
                  {format(new Date(ticket.created_at), "d MMM, HH:mm", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Estado
                </p>
                <Select value={ticket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-8 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Abierto</SelectItem>
                    <SelectItem value="in_progress">En proceso</SelectItem>
                    <SelectItem value="resolved">Resuelto</SelectItem>
                    <SelectItem value="closed">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-3" />

            <div>
              <p className="text-sm text-muted-foreground mb-1">Descripción:</p>
              <p className="text-sm">{ticket.description}</p>
            </div>

            {ticket.resolution && (
              <>
                <Separator className="my-3" />
                <div className="flex items-start gap-2 text-secondary">
                  <CheckCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Resolución:</p>
                    <p className="text-sm">{ticket.resolution}</p>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Messages */}
          <div className="flex-1 flex flex-col min-h-0">
            <h4 className="font-medium mb-2 text-sm">Conversación</h4>
            <ScrollArea className="flex-1 pr-4 max-h-[250px]">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No hay mensajes aún. Inicia la conversación.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${
                        msg.sender_type === "support" ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          msg.sender_type === "support"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.sender_type === "support" ? (
                          <Headphones className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender_type === "support"
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-xs font-medium mb-1">{msg.sender_name}</p>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(msg.created_at), "d MMM, HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            {ticket.status !== "closed" && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={loading || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
