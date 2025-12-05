import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Star,
  TrendingUp,
  Car,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Award,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DriverDetails = () => {
  const navigate = useNavigate();

  // Datos de ejemplo del conductor
  const driver = {
    id: "DRV-001",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+52 55 1234 5678",
    avatar: "",
    status: "Activo",
    rating: 4.8,
    totalTrips: 1247,
    joinDate: "15 Ene 2023",
    totalEarnings: "$124,580",
    vehicleModel: "Toyota Corolla 2021",
    licensePlate: "ABC-123-XYZ",
  };

  const stats = [
    { label: "Viajes Totales", value: "1,247", icon: Car, color: "text-primary" },
    { label: "Calificación", value: "4.8/5", icon: Star, color: "text-yellow-500" },
    { label: "Ingresos Totales", value: "$124,580", icon: DollarSign, color: "text-green-500" },
    { label: "Tasa de Aceptación", value: "94%", icon: TrendingUp, color: "text-blue-500" },
  ];

  const recentTrips = [
    { id: "1", date: "28 Nov 2024", time: "14:30", from: "Centro", to: "Polanco", distance: "8.5 km", fare: "$145", rating: 5 },
    { id: "2", date: "28 Nov 2024", time: "12:15", from: "Roma Norte", to: "Condesa", distance: "3.2 km", fare: "$78", rating: 5 },
    { id: "3", date: "27 Nov 2024", time: "18:45", from: "Reforma", to: "Santa Fe", distance: "12.1 km", fare: "$210", rating: 4 },
    { id: "4", date: "27 Nov 2024", time: "16:20", from: "Coyoacán", to: "Del Valle", distance: "6.8 km", fare: "$125", rating: 5 },
    { id: "5", date: "27 Nov 2024", time: "10:00", from: "Polanco", to: "Aeropuerto", distance: "18.3 km", fare: "$320", rating: 5 },
  ];

  const documents = [
    { name: "Licencia de Conducir", status: "Verificado", expiry: "15 Ene 2026", verified: true },
    { name: "INE / Identificación", status: "Verificado", expiry: "20 Mar 2028", verified: true },
    { name: "Seguro del Vehículo", status: "Verificado", expiry: "10 Jun 2025", verified: true },
    { name: "Verificación Vehicular", status: "Por Vencer", expiry: "05 Dic 2024", verified: false },
    { name: "Antecedentes Penales", status: "Verificado", expiry: "N/A", verified: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← Volver al Panel
        </Button>

        <div className="space-y-6">
          {/* Perfil del Conductor */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={driver.avatar} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {driver.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{driver.name}</h1>
                      <Badge className="bg-green-500 text-white">{driver.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">ID: {driver.id}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Miembro desde: {driver.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span>{driver.vehicleModel} • {driver.licensePlate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Calificaciones Detalladas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Calificaciones Detalladas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Amabilidad</span>
                  <span className="text-sm font-semibold">4.9/5</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Puntualidad</span>
                  <span className="text-sm font-semibold">4.7/5</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Conducción</span>
                  <span className="text-sm font-semibold">4.8/5</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Limpieza del Vehículo</span>
                  <span className="text-sm font-semibold">4.9/5</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Historial de Viajes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historial de Viajes Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Distancia</TableHead>
                    <TableHead>Tarifa</TableHead>
                    <TableHead>Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>{trip.date}</TableCell>
                      <TableCell>{trip.time}</TableCell>
                      <TableCell>{trip.from}</TableCell>
                      <TableCell>{trip.to}</TableCell>
                      <TableCell>{trip.distance}</TableCell>
                      <TableCell className="font-semibold">{trip.fare}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{trip.rating}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        {doc.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Vence: {doc.expiry}
                          </p>
                        </div>
                      </div>
                      <Badge variant={doc.verified ? "default" : "secondary"}>
                        {doc.status}
                      </Badge>
                    </div>
                    {index < documents.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DriverDetails;
