import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export const MapView = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !tokenSubmitted || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-99.1332, 19.4326], // Ciudad de México
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Simular conductores en tiempo real
    const driverLocations = [
      { lng: -99.1332, lat: 19.4326, name: "Conductor 1" },
      { lng: -99.1532, lat: 19.4426, name: "Conductor 2" },
      { lng: -99.1132, lat: 19.4226, name: "Conductor 3" },
      { lng: -99.1232, lat: 19.4526, name: "Conductor 4" },
      { lng: -99.1432, lat: 19.4126, name: "Conductor 5" },
    ];

    driverLocations.forEach((driver) => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#3b82f6";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";

      new mapboxgl.Marker(el)
        .setLngLat([driver.lng, driver.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${driver.name}</strong><br>Disponible`))
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [tokenSubmitted, mapboxToken]);

  if (!tokenSubmitted) {
    return (
      <Card className="p-8 max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">Configurar Mapa</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Para ver el mapa en tiempo real, necesitas un token de Mapbox.
            <br />
            Obtén uno gratis en{" "}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <Input
            placeholder="Pega tu token de Mapbox aquí"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button onClick={() => setTokenSubmitted(true)} disabled={!mapboxToken}>
            Mostrar Mapa
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur p-3 rounded-lg shadow-md">
        <p className="text-sm font-medium">🚗 Conductores Activos</p>
        <p className="text-2xl font-bold text-primary">5</p>
      </div>
    </div>
  );
};
