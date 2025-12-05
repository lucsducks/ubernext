import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePayments } from "@/hooks/usePayments";
import { GoalsSection } from "@/components/GoalsSection";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  TrendingUp,
  Calendar,
  Car,
  Search,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const DriverEarnings = () => {
  const { payments, loading } = usePayments();
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<string>("all");
  const [createGoalOpen, setCreateGoalOpen] = useState(false);

  // Get unique drivers
  const drivers = useMemo(() => {
    const driverNames = payments
      .filter((p) => p.driver_name)
      .map((p) => p.driver_name as string);
    return [...new Set(driverNames)].sort();
  }, [payments]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Filter by driver
      if (selectedDriver !== "all" && payment.driver_name !== selectedDriver) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !payment.user_name.toLowerCase().includes(search) &&
          !payment.description?.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Filter by date range
      if (dateRange !== "all") {
        const paymentDate = new Date(payment.created_at);
        const now = new Date();
        
        if (dateRange === "month") {
          const start = startOfMonth(now);
          const end = endOfMonth(now);
          if (!isWithinInterval(paymentDate, { start, end })) return false;
        } else if (dateRange === "3months") {
          const start = subMonths(now, 3);
          if (paymentDate < start) return false;
        }
      }

      return true;
    });
  }, [payments, selectedDriver, searchTerm, dateRange]);

  // Calculate stats for selected driver
  const stats = useMemo(() => {
    const completed = filteredPayments.filter((p) => p.status === "succeeded");
    const pending = filteredPayments.filter((p) => p.status === "pending");

    const totalEarnings = completed.reduce((sum, p) => sum + p.driver_amount, 0);
    const pendingEarnings = pending.reduce((sum, p) => sum + p.driver_amount, 0);
    const totalTrips = completed.length;
    const averagePerTrip = totalTrips > 0 ? totalEarnings / totalTrips : 0;

    // Calculate this month vs last month
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthEarnings = completed
      .filter((p) => new Date(p.created_at) >= thisMonthStart)
      .reduce((sum, p) => sum + p.driver_amount, 0);

    const lastMonthEarnings = completed
      .filter((p) => {
        const date = new Date(p.created_at);
        return isWithinInterval(date, { start: lastMonthStart, end: lastMonthEnd });
      })
      .reduce((sum, p) => sum + p.driver_amount, 0);

    const monthlyChange = lastMonthEarnings > 0 
      ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 
      : 0;

    return {
      totalEarnings,
      pendingEarnings,
      totalTrips,
      averagePerTrip,
      thisMonthEarnings,
      lastMonthEarnings,
      monthlyChange,
    };
  }, [filteredPayments]);

  // Chart data - earnings by day
  const chartData = useMemo(() => {
    const completed = filteredPayments.filter((p) => p.status === "succeeded");
    const grouped: Record<string, number> = {};

    completed.forEach((payment) => {
      const day = format(new Date(payment.created_at), "dd MMM", { locale: es });
      grouped[day] = (grouped[day] || 0) + payment.driver_amount;
    });

    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .slice(-14); // Last 14 days
  }, [filteredPayments]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ganancias de Conductores</h1>
            <p className="text-muted-foreground">
              Historial de pagos y estadísticas de ganancias
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger className="w-[200px]">
                <Car className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Todos los conductores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los conductores</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver} value={driver}>
                    {driver}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el tiempo</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="3months">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[180px]"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="earnings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="earnings" className="gap-2">
              <Wallet className="h-4 w-4" />
              Ganancias
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Target className="h-4 w-4" />
              Metas y Bonificaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earnings" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ganancias Totales
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalEarnings)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalTrips} viajes completados
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ganancias Pendientes
                  </CardTitle>
                  <Clock className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {formatCurrency(stats.pendingEarnings)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por procesar
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Promedio por Viaje
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.averagePerTrip)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por viaje completado
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Este Mes
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.thisMonthEarnings)}
                  </div>
                  <div className="flex items-center text-xs mt-1">
                    {stats.monthlyChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={stats.monthlyChange >= 0 ? "text-green-600" : "text-red-600"}>
                      {Math.abs(stats.monthlyChange).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground ml-1">vs mes anterior</span>
                  </div>
                </CardContent>
              </Card>
            </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ganancias por Día</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No hay datos disponibles
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tendencia de Ganancias</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No hay datos disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Historial de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay pagos registrados</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          payment.status === "succeeded"
                            ? "bg-green-100 text-green-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {payment.status === "succeeded" ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{payment.driver_name || "Sin asignar"}</p>
                          <Badge variant="outline" className="text-xs">
                            {payment.user_name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {payment.description || "Viaje"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.created_at), "PPp", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">
                        +{formatCurrency(payment.driver_amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total: {formatCurrency(payment.amount)}
                      </p>
                      <Badge
                        variant={payment.status === "succeeded" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {payment.status === "succeeded" ? "Completado" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="goals">
            <GoalsSection
              selectedDriver={selectedDriver}
              onCreateGoal={() => setCreateGoalOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </main>

      <CreateGoalDialog open={createGoalOpen} onOpenChange={setCreateGoalOpen} />
    </div>
  );
};

export default DriverEarnings;
