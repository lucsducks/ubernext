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
import { usePayments } from "@/hooks/usePayments";
import { CreditCard, Loader2 } from "lucide-react";

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId?: string;
  prefilledAmount?: number;
  prefilledUserName?: string;
  prefilledDriverName?: string;
}

export const CreatePaymentDialog = ({
  open,
  onOpenChange,
  tripId,
  prefilledAmount,
  prefilledUserName,
  prefilledDriverName,
}: CreatePaymentDialogProps) => {
  const { createPayment, commissionSettings } = usePayments();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: prefilledAmount || 0,
    userName: prefilledUserName || "",
    userEmail: "",
    driverName: prefilledDriverName || "",
    description: "",
  });

  const commissionPercentage = commissionSettings?.commission_percentage || 15;
  const commissionAmount = Math.round((formData.amount * commissionPercentage) / 100);
  const driverAmount = formData.amount - commissionAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await createPayment({
      tripId,
      amount: formData.amount,
      userName: formData.userName,
      userEmail: formData.userEmail || undefined,
      driverName: formData.driverName || undefined,
      description: formData.description || undefined,
    });

    setLoading(false);
    if (success) {
      onOpenChange(false);
      setFormData({
        amount: 0,
        userName: "",
        userEmail: "",
        driverName: "",
        description: "",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Procesar Nuevo Pago
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Nombre del Cliente *</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                placeholder="Nombre completo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Correo Electrónico</Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) =>
                  setFormData({ ...formData, userEmail: e.target.value })
                }
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto Total (MXN) *</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverName">Nombre del Conductor</Label>
              <Input
                id="driverName"
                value={formData.driverName}
                onChange={(e) =>
                  setFormData({ ...formData, driverName: e.target.value })
                }
                placeholder="Conductor asignado"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detalles del viaje o servicio..."
              rows={2}
            />
          </div>

          {/* Commission Preview */}
          {formData.amount > 0 && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Desglose del Pago</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold">{formatCurrency(formData.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Comisión ({commissionPercentage}%)</p>
                  <p className="font-bold text-green-600">{formatCurrency(commissionAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Conductor</p>
                  <p className="font-bold text-blue-600">{formatCurrency(driverAmount)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.amount || !formData.userName}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Procesar Pago
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
