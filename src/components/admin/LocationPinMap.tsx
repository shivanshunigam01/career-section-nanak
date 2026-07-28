import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SHOWROOM_LAT, SHOWROOM_LNG } from "@/lib/dealerMap";

// Default Leaflet marker icons break under Vite bundling — use CDN icons.
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type MapPin = { lat: number; lng: number };

type Props = {
  value: MapPin | null;
  onChange: (pin: MapPin) => void;
  height?: number;
  disabled?: boolean;
  className?: string;
};

/**
 * Interactive OSM map with a draggable/clickable pin.
 * Stores lat/lng that are opened as Google Maps links elsewhere in the app.
 */
export function LocationPinMap({ value, onChange, height = 220, disabled, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const start = value ?? { lat: SHOWROOM_LAT, lng: SHOWROOM_LNG };
    const map = L.map(containerRef.current, {
      center: [start.lat, start.lng],
      zoom: 15,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([start.lat, start.lng], {
      icon: markerIcon,
      draggable: !disabled,
    }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onChangeRef.current({ lat: pos.lat, lng: pos.lng });
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (disabled) return;
      marker.setLatLng(e.latlng);
      onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;
    markerRef.current = marker;

    // Leaflet needs a reflow after dialog open.
    setTimeout(() => map.invalidateSize(), 80);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!value || !mapRef.current || !markerRef.current) return;
    const current = markerRef.current.getLatLng();
    if (Math.abs(current.lat - value.lat) < 1e-7 && Math.abs(current.lng - value.lng) < 1e-7) {
      return;
    }
    markerRef.current.setLatLng([value.lat, value.lng]);
    mapRef.current.setView([value.lat, value.lng], mapRef.current.getZoom());
  }, [value?.lat, value?.lng]);

  useEffect(() => {
    if (!markerRef.current) return;
    if (disabled) markerRef.current.dragging?.disable();
    else markerRef.current.dragging?.enable();
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height, width: "100%", borderRadius: 8, overflow: "hidden", zIndex: 0 }}
      aria-label="Pin test drive location on map"
    />
  );
}
