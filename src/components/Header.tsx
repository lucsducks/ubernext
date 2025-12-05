import { Menu, User, BarChart3, Calendar, Car, Headphones, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationPanel } from "./NotificationPanel";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-primary" />
            <span className="text-xl font-bold">Uber</span>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="text-sm"
            >
              Panel
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/analiticas")}
              className="text-sm gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analíticas
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/mantenimiento")}
              className="text-sm gap-2"
            >
              <Calendar className="h-4 w-4" />
              Mantenimiento
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/viajes")}
              className="text-sm gap-2"
            >
              <Car className="h-4 w-4" />
              Viajes
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/soporte")}
              className="text-sm gap-2"
            >
              <Headphones className="h-4 w-4" />
              Soporte
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/pagos")}
              className="text-sm gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Pagos
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate("/ganancias")}
              className="text-sm gap-2"
            >
              <Wallet className="h-4 w-4" />
              Ganancias
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationPanel />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
