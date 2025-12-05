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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDriverGoals } from "@/hooks/useDriverGoals";
import { usePayments } from "@/hooks/usePayments";
import { format, addDays, addWeeks, addMonths, startOfDay } from "date-fns";

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateGoalDialog = ({ open, onOpenChange }: CreateGoalDialogProps) => {
  const { createGoal } = useDriverGoals();
  const { payments } = usePayments();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    driver_name: "",
    goal_type: "monthly",
    target_amount: "",
    target_trips: "",
    bonus_amount: "",
    bonus_percentage: "",
  });

  // Get unique drivers from payments
  const drivers = [...new Set(payments.filter((p) => p.driver_name).map((p) => p.driver_name as string))].sort();

  const getEndDate = (type: string) => {
    const today = startOfDay(new Date());
    switch (type) {
      case "daily":
        return addDays(today, 1);
      case "weekly":
        return addWeeks(today, 1);
      case "monthly":
        return addMonths(today, 1);
      default:
        return addMonths(today, 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const today = format(new Date(), "yyyy-MM-dd");
    const endDate = format(getEndDate(formData.goal_type), "yyyy-MM-dd");

    await createGoal({
      driver_name: formData.driver_name,
      goal_type: formData.goal_type,
      target_amount: parseFloat(formData.target_amount),
      target_trips: formData.target_trips ? parseInt(formData.target_trips) : undefined,
      start_date: today,
      end_date: endDate,
      bonus_amount: formData.bonus_amount ? parseFloat(formData.bonus_amount) : 0,
      bonus_percentage: formData.bonus_percentage ? parseFloat(formData.bonus_percentage) : 0,
    });

    setLoading(false);
    setFormData({
      driver_name: "",
      goal_type: "monthly",
      target_amount: "",
      target_trips: "",
      bonus_amount: "",
      bonus_percentage: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Meta de Ganancias</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Conductor</Label>
            <Select
              value={formData.driver_name}
              onValueChange={(value) => setFormData({ ...formData, driver_name: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar conductor" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver} value={driver}>
                    {driver}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Meta</Label>
            <Select
              value={formData.goal_type}
              onValueChange={(value) => setFormData({ ...formData, goal_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diaria</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meta de Ganancias (MXN)</Label>
              <Input
                type="number"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                placeholder="10000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Meta de Viajes (opcional)</Label>
              <Input
                type="number"
                value={formData.target_trips}
                onChange={(e) => setFormData({ ...formData, target_trips: e.target.value })}
                placeholder="50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bonificación Fija (MXN)</Label>
              <Input
                type="number"
                value={formData.bonus_amount}
                onChange={(e) => setFormData({ ...formData, bonus_amount: e.target.value })}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label>Bonificación % (sobre ganancias)</Label>
              <Input
                type="number"
                value={formData.bonus_percentage}
                onChange={(e) => setFormData({ ...formData, bonus_percentage: e.target.value })}
                placeholder="5"
                max="100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.driver_name || !formData.target_amount}>
              {loading ? "Creando..." : "Crear Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
