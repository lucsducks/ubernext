import { useState } from "react";
import { Header } from "@/components/Header";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, Filter, AlertCircle } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useMaintenance } from "@/hooks/useMaintenance";
import { MaintenanceDialog } from "@/components/MaintenanceDialog";
import { MaintenanceList } from "@/components/MaintenanceList";

export default function Maintenance() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { maintenances, loading } = useMaintenance();

  const scheduledDates = maintenances
    .filter(m => m.status === 'scheduled')
    .map(m => parseISO(m.scheduled_date));

  const filteredMaintenances = maintenances.filter(m => {
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    const matchesDate = selectedDate 
      ? isSameDay(parseISO(m.scheduled_date), selectedDate)
      : true;
    return matchesStatus && matchesDate;
  });

  const upcomingCount = maintenances.filter(m => m.status === 'scheduled').length;
  const urgentCount = maintenances.filter(m => m.priority === 'urgent' && m.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Mantenimiento Preventivo</h1>
            <p className="text-muted-foreground mt-2">
              Programa y gestiona el mantenimiento de tu flota
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Programar Mantenimiento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Programados</p>
                <p className="text-3xl font-bold mt-1">{upcomingCount}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgentes</p>
                <p className="text-3xl font-bold mt-1">{urgentCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Este Mes</p>
                <p className="text-3xl font-bold mt-1">
                  {maintenances.filter(m => {
                    const date = parseISO(m.scheduled_date);
                    return date.getMonth() === new Date().getMonth();
                  }).length}
                </p>
              </div>
              <Filter className="h-8 w-8 text-secondary" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Calendario</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              modifiers={{
                scheduled: scheduledDates
              }}
              modifiersStyles={{
                scheduled: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'hsl(var(--primary))'
                }
              }}
              className="rounded-md border"
            />
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                {selectedDate 
                  ? format(selectedDate, "d 'de' MMMM, yyyy", { locale: es })
                  : "Selecciona una fecha"}
              </p>
            </div>
          </Card>

          {/* Maintenance List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filtrar por estado:</span>
                <div className="flex gap-2">
                  {["all", "scheduled", "in_progress", "completed"].map((status) => (
                    <Badge
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setFilterStatus(status)}
                    >
                      {status === "all" ? "Todos" :
                       status === "scheduled" ? "Programados" :
                       status === "in_progress" ? "En progreso" :
                       "Completados"}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {loading ? (
              <Card className="p-6">
                <p className="text-center text-muted-foreground">Cargando mantenimientos...</p>
              </Card>
            ) : (
              <MaintenanceList maintenances={filteredMaintenances} />
            )}
          </div>
        </div>

        <MaintenanceDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </div>
  );
}