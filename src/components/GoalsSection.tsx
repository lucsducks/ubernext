import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDriverGoals, DriverGoal } from "@/hooks/useDriverGoals";
import { Target, Trophy, Gift, TrendingUp, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GoalsSectionProps {
  selectedDriver: string;
  onCreateGoal: () => void;
}

export const GoalsSection = ({ selectedDriver, onCreateGoal }: GoalsSectionProps) => {
  const { goals, bonuses, loading, getGoalProgress, deleteGoal, getDriverStats } = useDriverGoals();

  const filteredGoals = selectedDriver === "all"
    ? goals
    : goals.filter((g) => g.driver_name === selectedDriver);

  const filteredBonuses = selectedDriver === "all"
    ? bonuses
    : bonuses.filter((b) => b.driver_name === selectedDriver);

  const activeGoals = filteredGoals.filter((g) => g.status === "active");
  const completedGoals = filteredGoals.filter((g) => g.status === "completed");

  const totalPendingBonus = filteredBonuses
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + b.amount, 0);

  const totalPaidBonus = filteredBonuses
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case "daily": return "Diaria";
      case "weekly": return "Semanal";
      case "monthly": return "Mensual";
      default: return type;
    }
  };

  const GoalCard = ({ goal }: { goal: DriverGoal }) => {
    const progress = Math.min(getGoalProgress(goal), 100);
    const isCompleted = goal.status === "completed";
    const potentialBonus = goal.bonus_amount + (goal.current_amount * goal.bonus_percentage / 100);

    return (
      <Card className={`transition-all ${isCompleted ? "border-green-500/50 bg-green-500/5" : ""}`}>
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Target className={`h-5 w-5 ${isCompleted ? "text-green-500" : "text-primary"}`} />
              <div>
                <p className="font-medium">{goal.driver_name}</p>
                <Badge variant="outline" className="text-xs">
                  {getGoalTypeLabel(goal.goal_type)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isCompleted && <Trophy className="h-5 w-5 text-yellow-500" />}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => deleteGoal(goal.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">
                  {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(1)}% completado</p>
            </div>

            {goal.target_trips && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Viajes</span>
                <span>{goal.current_trips} / {goal.target_trips}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Vence
              </span>
              <span>{format(new Date(goal.end_date), "d MMM yyyy", { locale: es })}</span>
            </div>

            {(goal.bonus_amount > 0 || goal.bonus_percentage > 0) && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-1 text-sm">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Bonificación:</span>
                  <span className="font-medium text-primary">
                    {goal.bonus_amount > 0 && formatCurrency(goal.bonus_amount)}
                    {goal.bonus_amount > 0 && goal.bonus_percentage > 0 && " + "}
                    {goal.bonus_percentage > 0 && `${goal.bonus_percentage}%`}
                  </span>
                </div>
                {isCompleted && (
                  <p className="text-xs text-green-600 mt-1">
                    Ganado: {formatCurrency(potentialBonus)}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Metas Activas</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Metas Completadas</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bonos Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPendingBonus)}</p>
              </div>
              <Gift className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bonos Pagados</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPaidBonus)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas Activas
          </CardTitle>
          <Button onClick={onCreateGoal} size="sm">
            Nueva Meta
          </Button>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay metas activas</p>
              <Button variant="outline" className="mt-4" onClick={onCreateGoal}>
                Crear primera meta
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Metas Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedGoals.slice(0, 6).map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bonuses History */}
      {filteredBonuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Historial de Bonificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredBonuses.slice(0, 10).map((bonus) => (
                <div
                  key={bonus.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      bonus.status === "paid" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      <Gift className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{bonus.driver_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {bonus.description || bonus.bonus_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(bonus.created_at), "d MMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(bonus.amount)}</p>
                    <Badge variant={bonus.status === "paid" ? "default" : "secondary"}>
                      {bonus.status === "paid" ? "Pagado" : "Pendiente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
