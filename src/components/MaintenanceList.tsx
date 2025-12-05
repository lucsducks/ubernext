import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Car, User, DollarSign, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Maintenance, useMaintenance } from "@/hooks/useMaintenance";

interface MaintenanceListProps {
  maintenances: Maintenance[];
}

export function MaintenanceList({ maintenances }: MaintenanceListProps) {
  const { updateMaintenance } = useMaintenance();

  const statusConfig = {
    scheduled: {
      label: "Programado",
      color: "bg-secondary text-secondary-foreground",
      icon: Clock
    },
    in_progress: {
      label: "En Progreso",
      color: "bg-accent text-accent-foreground",
      icon: AlertCircle
    },
    completed: {
      label: "Completado",
      color: "bg-muted text-muted-foreground",
      icon: CheckCircle
    },
    cancelled: {
      label: "Cancelado",
      color: "bg-destructive/10 text-destructive",
      icon: XCircle
    }
  };

  const priorityConfig = {
    low: { label: "Baja", color: "bg-blue-100 text-blue-800" },
    normal: { label: "Normal", color: "bg-green-100 text-green-800" },
    high: { label: "Alta", color: "bg-orange-100 text-orange-800" },
    urgent: { label: "Urgente", color: "bg-red-100 text-red-800" }
  };

  const handleStatusChange = async (id: string, newStatus: Maintenance['status']) => {
    const updates: Partial<Maintenance> = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completed_date = new Date().toISOString();
    }
    await updateMaintenance(id, updates);
  };

  if (maintenances.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No se encontraron mantenimientos</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {maintenances.map((maintenance) => {
        const StatusIcon = statusConfig[maintenance.status].icon;
        
        return (
          <Card key={maintenance.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                  <Car className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{maintenance.service_type}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {maintenance.vehicle_id} • {maintenance.driver_name}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge className={statusConfig[maintenance.status].color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig[maintenance.status].label}
                </Badge>
                <Badge className={priorityConfig[maintenance.priority].color}>
                  {priorityConfig[maintenance.priority].label}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(parseISO(maintenance.scheduled_date), "d MMM yyyy", { locale: es })}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{maintenance.driver_name}</span>
              </div>
              
              {maintenance.cost && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${maintenance.cost.toFixed(2)}</span>
                </div>
              )}
            </div>

            {maintenance.notes && (
              <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted rounded-lg">
                {maintenance.notes}
              </p>
            )}

            {maintenance.status === 'scheduled' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusChange(maintenance.id, 'in_progress')}
                >
                  Iniciar
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleStatusChange(maintenance.id, 'completed')}
                >
                  Completar
                </Button>
              </div>
            )}

            {maintenance.status === 'in_progress' && (
              <Button 
                size="sm"
                onClick={() => handleStatusChange(maintenance.id, 'completed')}
              >
                Marcar como Completado
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}