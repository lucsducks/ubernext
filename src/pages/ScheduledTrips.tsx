import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Car,
  Share2,
  Filter
} from "lucide-react";
import { useScheduledTrips, ScheduledTrip } from "@/hooks/useScheduledTrips";
import { ScheduleTripDialog } from "@/components/ScheduleTripDialog";
import { JoinTripDialog } from "@/components/JoinTripDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ScheduledTrips = () => {
  const { trips, loading, updateTrip, deleteTrip } = useScheduledTrips();
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<ScheduledTrip | null>(null);
  const [filter, setFilter] = useState<"all" | "scheduled" | "shared">("all");

  const filteredTrips = trips.filter((trip) => {
    if (filter === "shared") return trip.is_shared;
    if (filter === "scheduled") return !trip.is_shared;
    return true;
  });

  const pendingTrips = filteredTrips.filter((t) => t.status === "pending");
  const confirmedTrips = filteredTrips.filter((t) => t.status === "confirmed");
  const completedTrips = filteredTrips.filter((t) => t.status === "completed");

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-accent text-accent-foreground",
      confirmed: "bg-secondary text-secondary-foreground",
      in_progress: "bg-primary text-primary-foreground",
      completed: "bg-muted text-muted-foreground",
      cancelled: "bg-destructive text-destructive-foreground",
    };
    const labels: Record<string, string> = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      in_progress: "En progreso",
      completed: "Completado",
      cancelled: "Cancelado",
    };
    return <Badge className={variants[status]}>{labels[status]}</Badge>;
  };

  const TripCard = ({ trip }: { trip: ScheduledTrip }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {trip.is_shared ? (
            <Share2 className="h-5 w-5 text-primary" />
          ) : (
            <Car className="h-5 w-5 text-primary" />
          )}
          <span className="font-medium">{trip.user_name}</span>
        </div>
        <div className="flex items-center gap-2">
          {trip.is_shared && (
            <Badge variant="outline" className="text-xs">
              Compartido
            </Badge>
          )}
          {getStatusBadge(trip.status)}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(trip.scheduled_date), "EEEE, d 'de' MMMM", { locale: es })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(trip.scheduled_date), "HH:mm", { locale: es })} hrs</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 text-secondary" />
          <span className="line-clamp-1">{trip.origin_address}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 text-destructive" />
          <span className="line-clamp-1">{trip.destination_address}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{trip.passengers_count} pasajero(s)</span>
        </div>
      </div>

      {trip.estimated_price && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-lg font-bold text-primary">
            ${trip.estimated_price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground ml-1">estimado</span>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {trip.is_shared && trip.status === "pending" && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setSelectedTrip(trip);
              setJoinDialogOpen(true);
            }}
          >
            Unirse
          </Button>
        )}
        {trip.status === "pending" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateTrip(trip.id, { status: "confirmed" })}
            >
              Confirmar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => deleteTrip(trip.id)}
            >
              Cancelar
            </Button>
          </>
        )}
      </div>
    </Card>
  );

  const TripsList = ({ tripsList }: { tripsList: ScheduledTrip[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tripsList.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          No hay viajes en esta categoría
        </div>
      ) : (
        tripsList.map((trip) => <TripCard key={trip.id} trip={trip} />)
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Viajes Programados</h1>
            <p className="text-muted-foreground">
              Programa tus viajes con anticipación o únete a viajes compartidos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setFilter("all")}>
              <Filter className="h-4 w-4 mr-2" />
              {filter === "all" ? "Todos" : filter === "shared" ? "Compartidos" : "Individuales"}
            </Button>
            <Button onClick={() => setScheduleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Programar viaje
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Calendar className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingTrips.length}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Car className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{confirmedTrips.length}</p>
                <p className="text-sm text-muted-foreground">Confirmados</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Share2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {trips.filter((t) => t.is_shared).length}
                </p>
                <p className="text-sm text-muted-foreground">Compartidos</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedTrips.length}</p>
                <p className="text-sm text-muted-foreground">Completados</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={filter === "scheduled" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("scheduled")}
          >
            Individuales
          </Button>
          <Button
            variant={filter === "shared" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("shared")}
          >
            Compartidos
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pendientes ({pendingTrips.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmados ({confirmedTrips.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completados ({completedTrips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {loading ? (
              <div className="text-center py-12">Cargando...</div>
            ) : (
              <TripsList tripsList={pendingTrips} />
            )}
          </TabsContent>
          <TabsContent value="confirmed">
            <TripsList tripsList={confirmedTrips} />
          </TabsContent>
          <TabsContent value="completed">
            <TripsList tripsList={completedTrips} />
          </TabsContent>
        </Tabs>
      </main>

      <ScheduleTripDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
      />

      {selectedTrip && (
        <JoinTripDialog
          open={joinDialogOpen}
          onOpenChange={setJoinDialogOpen}
          trip={selectedTrip}
        />
      )}
    </div>
  );
};

export default ScheduledTrips;
