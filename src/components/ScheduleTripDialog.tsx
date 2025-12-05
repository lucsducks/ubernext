import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, User, Phone, Users, DollarSign } from "lucide-react";
import { useScheduledTrips } from "@/hooks/useScheduledTrips";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ScheduleTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScheduleTripDialog = ({ open, onOpenChange }: ScheduleTripDialogProps) => {
  const { addTrip } = useScheduledTrips();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("09:00");
  const [formData, setFormData] = useState({
    user_name: "",
    phone: "",
    origin_address: "",
    destination_address: "",
    passengers_count: 1,
    is_shared: false,
    estimated_price: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    
    const [hours, minutes] = time.split(":").map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes, 0, 0);

    const success = await addTrip({
      user_name: formData.user_name,
      phone: formData.phone || null,
      origin_address: formData.origin_address,
      origin_lat: null,
      origin_lng: null,
      destination_address: formData.destination_address,
      destination_lat: null,
      destination_lng: null,
      scheduled_date: scheduledDate.toISOString(),
      passengers_count: formData.passengers_count,
      is_shared: formData.is_shared,
      estimated_price: formData.estimated_price ? parseFloat(formData.estimated_price) : null,
      status: "pending",
      driver_id: null,
      driver_name: null,
      notes: formData.notes || null,
    });

    setLoading(false);

    if (success) {
      onOpenChange(false);
      setFormData({
        user_name: "",
        phone: "",
        origin_address: "",
        destination_address: "",
        passengers_count: 1,
        is_shared: false,
        estimated_price: "",
        notes: "",
      });
      setDate(undefined);
      setTime("09:00");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Programar nuevo viaje</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_name">
                <User className="h-4 w-4 inline mr-1" />
                Nombre
              </Label>
              <Input
                id="user_name"
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="h-4 w-4 inline mr-1" />
                Teléfono
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-2">
            <Label htmlFor="origin">
              <MapPin className="h-4 w-4 inline mr-1 text-secondary" />
              Origen
            </Label>
            <Input
              id="origin"
              placeholder="Dirección de recogida"
              value={formData.origin_address}
              onChange={(e) => setFormData({ ...formData, origin_address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">
              <MapPin className="h-4 w-4 inline mr-1 text-destructive" />
              Destino
            </Label>
            <Input
              id="destination"
              placeholder="Dirección de destino"
              value={formData.destination_address}
              onChange={(e) => setFormData({ ...formData, destination_address: e.target.value })}
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Fecha
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Passengers and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengers">
                <Users className="h-4 w-4 inline mr-1" />
                Pasajeros
              </Label>
              <Input
                id="passengers"
                type="number"
                min={1}
                max={6}
                value={formData.passengers_count}
                onChange={(e) =>
                  setFormData({ ...formData, passengers_count: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Precio estimado
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Opcional"
                value={formData.estimated_price}
                onChange={(e) => setFormData({ ...formData, estimated_price: e.target.value })}
              />
            </div>
          </div>

          {/* Shared Trip */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="shared">Viaje compartido</Label>
              <p className="text-sm text-muted-foreground">
                Permite que otros pasajeros se unan a tu viaje
              </p>
            </div>
            <Switch
              id="shared"
              checked={formData.is_shared}
              onCheckedChange={(checked) => setFormData({ ...formData, is_shared: checked })}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              placeholder="Instrucciones especiales, referencias, etc."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !date}>
              {loading ? "Programando..." : "Programar viaje"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
