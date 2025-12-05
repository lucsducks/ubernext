import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Star,
  Car,
  Users,
  Clock,
  Target,
} from "lucide-react";

const Analytics = () => {
  // Datos de ingresos mensuales
  const monthlyRevenue = [
    { mes: "Ene", ingresos: 245000, gastos: 180000 },
    { mes: "Feb", ingresos: 268000, gastos: 195000 },
    { mes: "Mar", ingresos: 291000, gastos: 210000 },
    { mes: "Abr", ingresos: 315000, gastos: 225000 },
    { mes: "May", ingresos: 342000, gastos: 238000 },
    { mes: "Jun", ingresos: 368000, gastos: 250000 },
    { mes: "Jul", ingresos: 395000, gastos: 265000 },
    { mes: "Ago", ingresos: 421000, gastos: 278000 },
    { mes: "Sep", ingresos: 448000, gastos: 290000 },
    { mes: "Oct", ingresos: 472000, gastos: 305000 },
    { mes: "Nov", ingresos: 498000, gastos: 318000 },
  ];

  // Datos de viajes diarios (última semana)
  const dailyTrips = [
    { dia: "Lun", viajes: 1420, completados: 1398, cancelados: 22 },
    { dia: "Mar", viajes: 1580, completados: 1552, cancelados: 28 },
    { dia: "Mié", viajes: 1650, completados: 1618, cancelados: 32 },
    { dia: "Jue", viajes: 1720, completados: 1695, cancelados: 25 },
    { dia: "Vie", viajes: 1890, completados: 1862, cancelados: 28 },
    { dia: "Sáb", viajes: 2150, completados: 2118, cancelados: 32 },
    { dia: "Dom", viajes: 1950, completados: 1925, cancelados: 25 },
  ];

  // Datos de calificaciones
  const ratingDistribution = [
    { rating: "5 ★", cantidad: 12450, porcentaje: 68 },
    { rating: "4 ★", cantidad: 4280, porcentaje: 23 },
    { rating: "3 ★", cantidad: 1120, porcentaje: 6 },
    { rating: "2 ★", cantidad: 380, porcentaje: 2 },
    { rating: "1 ★", cantidad: 170, porcentaje: 1 },
  ];

  // Datos de tipos de viaje
  const tripTypes = [
    { name: "Estándar", value: 65, color: "#3b82f6" },
    { name: "Premium", value: 25, color: "#8b5cf6" },
    { name: "XL", value: 10, color: "#10b981" },
  ];

  // Datos de horas pico
  const peakHours = [
    { hora: "00:00", viajes: 420 },
    { hora: "03:00", viajes: 180 },
    { hora: "06:00", viajes: 850 },
    { hora: "09:00", viajes: 1420 },
    { hora: "12:00", viajes: 1180 },
    { hora: "15:00", viajes: 980 },
    { hora: "18:00", viajes: 1650 },
    { hora: "21:00", viajes: 1280 },
  ];

  const stats = [
    {
      title: "Ingresos del Mes",
      value: "$498,000",
      change: "+5.2%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Total de Viajes",
      value: "18,429",
      change: "+12.3%",
      trend: "up",
      icon: Car,
      color: "text-blue-500",
    },
    {
      title: "Calificación Promedio",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "Conductores Activos",
      value: "2,847",
      change: "+8.1%",
      trend: "up",
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard de Analíticas</h1>
            <p className="text-muted-foreground">
              Análisis detallado de rendimiento, ingresos y tendencias
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="ingresos" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
              <TabsTrigger value="viajes">Viajes</TabsTrigger>
              <TabsTrigger value="calificaciones">Calificaciones</TabsTrigger>
              <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
            </TabsList>

            {/* Ingresos Tab */}
            <TabsContent value="ingresos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos vs Gastos Mensuales</CardTitle>
                  <CardDescription>
                    Comparación de ingresos y gastos de los últimos 11 meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={monthlyRevenue}>
                      <defs>
                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) =>
                          `$${value.toLocaleString()}`
                        }
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorIngresos)"
                        name="Ingresos"
                      />
                      <Area
                        type="monotone"
                        dataKey="gastos"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorGastos)"
                        name="Gastos"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ganancia Neta</CardTitle>
                    <CardDescription>Utilidad mensual</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={monthlyRevenue.map((item) => ({
                          mes: item.mes,
                          ganancia: item.ingresos - item.gastos,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) =>
                            `$${value.toLocaleString()}`
                          }
                        />
                        <Bar dataKey="ganancia" fill="#10b981" name="Ganancia" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Tipos de Viaje</CardTitle>
                    <CardDescription>Por categoría de servicio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={tripTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {tripTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Viajes Tab */}
            <TabsContent value="viajes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Viajes Diarios - Última Semana</CardTitle>
                  <CardDescription>
                    Comparación de viajes completados vs cancelados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dailyTrips}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completados" fill="#10b981" name="Completados" />
                      <Bar dataKey="cancelados" fill="#ef4444" name="Cancelados" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horas Pico</CardTitle>
                  <CardDescription>Volumen de viajes por hora del día</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={peakHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="viajes"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        name="Viajes"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calificaciones Tab */}
            <TabsContent value="calificaciones" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Calificaciones</CardTitle>
                  <CardDescription>
                    Cantidad de calificaciones por nivel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={ratingDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="rating" type="category" width={60} />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#f59e0b" name="Cantidad">
                        {ratingDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "#10b981"
                                : index === 1
                                ? "#3b82f6"
                                : index === 2
                                ? "#f59e0b"
                                : index === 3
                                ? "#ef4444"
                                : "#dc2626"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ratingDistribution.slice(0, 3).map((rating, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold mb-2">{rating.rating}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rating.cantidad.toLocaleString()} calificaciones
                        </p>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${rating.porcentaje}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {rating.porcentaje}% del total
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tendencias Tab */}
            <TabsContent value="tendencias" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencias de Crecimiento</CardTitle>
                  <CardDescription>
                    Evolución de métricas clave en los últimos meses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={monthlyRevenue.map((item, index) => ({
                        mes: item.mes,
                        conductores: 2400 + index * 45,
                        viajes: 14000 + index * 420,
                        ingresos: item.ingresos / 1000,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="conductores"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Conductores"
                      />
                      <Line
                        type="monotone"
                        dataKey="viajes"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Viajes"
                      />
                      <Line
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Ingresos (Miles)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Predicciones</CardTitle>
                    <CardDescription>Proyecciones para el próximo mes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        <Target className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-semibold">Ingresos Proyectados</p>
                          <p className="text-sm text-muted-foreground">Diciembre 2024</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">$525,000</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        <Car className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="font-semibold">Viajes Estimados</p>
                          <p className="text-sm text-muted-foreground">Próximo mes</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">19,250</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-purple-500" />
                        <div>
                          <p className="font-semibold">Nuevos Conductores</p>
                          <p className="text-sm text-muted-foreground">Meta mensual</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">+125</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Eficiencia</CardTitle>
                    <CardDescription>Indicadores de rendimiento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Tasa de Completado</span>
                        <span className="text-sm font-semibold">98.5%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "98.5%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Satisfacción del Cliente</span>
                        <span className="text-sm font-semibold">96%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "96%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Retención de Conductores</span>
                        <span className="text-sm font-semibold">94%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: "94%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Tiempo Respuesta Promedio</span>
                        <span className="text-sm font-semibold">92%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
