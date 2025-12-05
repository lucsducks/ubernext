import { StatCard } from "./StatCard";
import { ProcessCard } from "./ProcessCard";
import { MapView } from "./MapView";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Car, 
  Users, 
  TrendingUp, 
  Clock,
  Navigation,
  Star,
  AlertCircle,
  UserPlus,
  CreditCard,
  Wrench,
  Gift,
  Eye
} from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: "Conductores Activos",
      value: "2,847",
      icon: Car,
      trend: "+12% vs mes anterior",
      trendUp: true,
    },
    {
      title: "Viajes Hoy",
      value: "18,429",
      icon: TrendingUp,
      trend: "+8% vs ayer",
      trendUp: true,
    },
    {
      title: "Calificación",
      value: "4.8",
      icon: Star,
      trend: "Excelente",
      trendUp: true,
    },
    {
      title: "Tiempo Espera",
      value: "2.3 min",
      icon: Clock,
      trend: "Muy rápido",
      trendUp: true,
    },
  ];

  const processes = [
    {
      title: "Asignación Inteligente",
      description: "Conectamos conductores con pasajeros automáticamente",
      icon: Navigation,
      status: "active" as const,
      metrics: [
        { label: "Eficiencia", value: "94%" },
        { label: "Tiempo", value: "1.8 min" },
      ],
    },
    {
      title: "Calidad de Servicio",
      description: "Monitoreamos la satisfacción en tiempo real",
      icon: Star,
      status: "active" as const,
      metrics: [
        { label: "Satisfacción", value: "4.8/5" },
        { label: "Casos resueltos", value: "97%" },
      ],
    },
    {
      title: "Atención de Problemas",
      description: "Resolvemos incidencias rápidamente",
      icon: AlertCircle,
      status: "active" as const,
      metrics: [
        { label: "Tiempo solución", value: "12 min" },
        { label: "Automáticas", value: "68%" },
      ],
    },
    {
      title: "Registro Conductores",
      description: "Proceso rápido de verificación y activación",
      icon: UserPlus,
      status: "active" as const,
      metrics: [
        { label: "Tiempo proceso", value: "24 hrs" },
        { label: "Aprobados", value: "89%" },
      ],
    },
    {
      title: "Pagos",
      description: "Transferencias automáticas y seguras",
      icon: CreditCard,
      status: "active" as const,
      metrics: [
        { label: "Procesados", value: "$2.4M" },
        { label: "Precisión", value: "99.9%" },
      ],
    },
    {
      title: "Mantenimiento",
      description: "Control preventivo de vehículos",
      icon: Wrench,
      status: "pending" as const,
      metrics: [
        { label: "Vehículos OK", value: "2,654" },
        { label: "Alertas", value: "193" },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">
            Panel de Control
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Gestión inteligente de tu flota en tiempo real
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm font-medium">✓ Sistema Activo - Uber</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </section>

      {/* Stats Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Estadísticas del Día</h2>
          <Button 
            onClick={() => navigate("/conductor/DRV-001")}
            variant="outline"
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Detalles de Conductor
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Map */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Mapa en Tiempo Real</h2>
        <MapView />
      </section>

      {/* Processes Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Procesos Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processes.map((process, index) => (
            <ProcessCard key={index} {...process} />
          ))}
        </div>
      </section>
    </div>
  );
};
