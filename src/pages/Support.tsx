import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Headphones,
  Plus,
  Search,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  CreditCard,
  Car,
  User,
  Shield,
} from "lucide-react";
import { useSupportTickets, SupportTicket } from "@/hooks/useSupportTickets";
import { CreateTicketDialog } from "@/components/CreateTicketDialog";
import { TicketDetailDialog } from "@/components/TicketDetailDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Support = () => {
  const { tickets, loading, updateTicket } = useSupportTickets();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openTickets = filteredTickets.filter((t) => t.status === "open");
  const inProgressTickets = filteredTickets.filter((t) => t.status === "in_progress");
  const resolvedTickets = filteredTickets.filter((t) => t.status === "resolved" || t.status === "closed");

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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      trip: <Car className="h-4 w-4" />,
      payment: <CreditCard className="h-4 w-4" />,
      account: <User className="h-4 w-4" />,
      safety: <Shield className="h-4 w-4" />,
      other: <HelpCircle className="h-4 w-4" />,
    };
    return icons[category] || icons.other;
  };

  const TicketCard = ({ ticket }: { ticket: SupportTicket }) => (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => {
        setSelectedTicket(ticket);
        setDetailDialogOpen(true);
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {getCategoryIcon(ticket.category)}
          </div>
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              {ticket.ticket_number}
            </p>
            <p className="font-medium line-clamp-1">{ticket.subject}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {getStatusBadge(ticket.status)}
          {getPriorityBadge(ticket.priority)}
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {ticket.description}
      </p>

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {ticket.user_name}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {format(new Date(ticket.created_at), "d MMM, HH:mm", { locale: es })}
        </span>
      </div>
    </Card>
  );

  const TicketsList = ({ ticketsList }: { ticketsList: SupportTicket[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ticketsList.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No hay tickets en esta categoría
        </div>
      ) : (
        ticketsList.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
      )}
    </div>
  );

  // FAQ Section
  const faqs = [
    {
      icon: <Car className="h-5 w-5" />,
      title: "¿Cómo programo un viaje?",
      description: "Ve a la sección de Viajes Programados y haz clic en 'Programar viaje'.",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "¿Cómo funcionan los pagos?",
      description: "Aceptamos múltiples métodos de pago. El cobro se realiza al finalizar el viaje.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "¿Cómo reporto un incidente?",
      description: "Crea un ticket de soporte con categoría 'Seguridad' para reportar cualquier incidente.",
    },
    {
      icon: <User className="h-5 w-5" />,
      title: "¿Cómo actualizo mi perfil?",
      description: "Accede a tu perfil desde el menú y actualiza tu información personal.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Centro de Soporte</h1>
            <p className="text-muted-foreground">
              Gestiona tus tickets y encuentra ayuda rápidamente
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo ticket
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{openTickets.length}</p>
                <p className="text-sm text-muted-foreground">Abiertos</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressTickets.length}</p>
                <p className="text-sm text-muted-foreground">En proceso</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedTickets.length}</p>
                <p className="text-sm text-muted-foreground">Resueltos</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tickets.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de ticket, asunto o usuario..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="open" className="space-y-4 mb-12">
          <TabsList>
            <TabsTrigger value="open">
              Abiertos ({openTickets.length})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              En proceso ({inProgressTickets.length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resueltos ({resolvedTickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            {loading ? (
              <div className="text-center py-12">Cargando...</div>
            ) : (
              <TicketsList ticketsList={openTickets} />
            )}
          </TabsContent>
          <TabsContent value="in_progress">
            <TicketsList ticketsList={inProgressTickets} />
          </TabsContent>
          <TabsContent value="resolved">
            <TicketsList ticketsList={resolvedTickets} />
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Preguntas frecuentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {faq.icon}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{faq.title}</h3>
                    <p className="text-sm text-muted-foreground">{faq.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">¿Necesitas ayuda inmediata?</h3>
                <p className="text-muted-foreground">
                  Nuestro equipo está disponible 24/7 para asistirte
                </p>
              </div>
            </div>
            <Button size="lg" onClick={() => setCreateDialogOpen(true)}>
              Contactar soporte
            </Button>
          </div>
        </Card>
      </main>

      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedTicket && (
        <TicketDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
};

export default Support;
