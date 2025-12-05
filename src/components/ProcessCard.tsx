import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProcessCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "active" | "pending" | "completed";
  metrics?: {
    label: string;
    value: string;
  }[];
}

export const ProcessCard = ({ title, description, icon: Icon, status, metrics }: ProcessCardProps) => {
  const statusLabels = {
    active: "Activo",
    pending: "Pendiente",
    completed: "Completado",
  };

  const statusColors = {
    active: "bg-secondary text-secondary-foreground",
    pending: "bg-accent text-accent-foreground",
    completed: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="p-6 transition-all hover:shadow-md animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-accent flex items-center justify-center">
          <Icon className="h-6 w-6 text-accent-foreground" />
        </div>
        <Badge className={statusColors[status]}>{statusLabels[status]}</Badge>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {metrics.map((metric, index) => (
            <div key={index}>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="text-lg font-semibold">{metric.value}</p>
            </div>
          ))}
        </div>
      )}
      
      <Button variant="ghost" className="w-full group">
        Ver más
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </Card>
  );
};
