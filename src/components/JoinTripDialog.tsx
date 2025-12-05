import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MapPin, User, Phone, Calendar, Clock } from "lucide-react";
import { useScheduledTrips, ScheduledTrip } from "@/hooks/useScheduledTrips";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface JoinTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: ScheduledTrip;
}

export const JoinTripDialog = ({ open, onOpenChange, trip }: JoinTripDialogProps) => {
  const { joinSharedTrip } = useScheduledTrips();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    passenger_name: "",
    phone: "",
    pickup_address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await joinSharedTrip(trip.id, {
      passenger_name: formData.passenger_name,
      phone: formData.phone || null,
      pickup_address: formData.pickup_address,
      pickup_lat: null,
      pickup_lng: null,
      status: "pending",
    });

    setLoading(false);

    if (success) {
      onOpenChange(false);
      setFormData({
        passenger_name: "",
        phone: "",
        pickup_address: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Unirse a viaje compartido</DialogTitle>
          <DialogDescription>
            Completa tus datos para unirte a este viaje
          </DialogDescription>
        </DialogHeader>

        {/* Trip Info */}
        <Card className="p-4 bg-muted/50">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Organizado por: <strong>{trip.user_name}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(trip.scheduled_date), "EEEE, d 'de' MMMM", { locale: es })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(trip.scheduled_date), "HH:mm", { locale: es })} hrs</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-secondary mt-0.5" />
              <span className="line-clamp-1">{trip.origin_address}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-destructive mt-0.5" />
              <span className="line-clamp-1">{trip.destination_address}</span>
            </div>
            {trip.estimated_price && (
              <div className="pt-2 border-t">
                <span className="font-bold text-primary">
                  ${trip.estimated_price.toFixed(2)}
                </span>
                <span className="text-muted-foreground ml-1">estimado por persona</span>
              </div>
            )}
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passenger_name">
              <User className="h-4 w-4 inline mr-1" />
              Tu nombre
            </Label>
            <Input
              id="passenger_name"
              value={formData.passenger_name}
              onChange={(e) => setFormData({ ...formData, passenger_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              <Phone className="h-4 w-4 inline mr-1" />
              Teléfono de contacto
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup">
              <MapPin className="h-4 w-4 inline mr-1 text-primary" />
              Punto de recogida
            </Label>
            <Input
              id="pickup"
              placeholder="¿Dónde te recogemos?"
              value={formData.pickup_address}
              onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Indica una ubicación cerca de la ruta del viaje
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Uniéndose..." : "Unirse al viaje"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
