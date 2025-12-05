import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DriverDetails from "./pages/DriverDetails";
import Analytics from "./pages/Analytics";
import Maintenance from "./pages/Maintenance";
import ScheduledTrips from "./pages/ScheduledTrips";
import Support from "./pages/Support";
import Payments from "./pages/Payments";
import DriverEarnings from "./pages/DriverEarnings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/conductor/:id" element={<DriverDetails />} />
          <Route path="/analiticas" element={<Analytics />} />
          <Route path="/mantenimiento" element={<Maintenance />} />
          <Route path="/viajes" element={<ScheduledTrips />} />
          <Route path="/soporte" element={<Support />} />
          <Route path="/pagos" element={<Payments />} />
          <Route path="/ganancias" element={<DriverEarnings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
