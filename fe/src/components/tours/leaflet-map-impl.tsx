"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import type { MapInnerProps } from "./tour-location-map";

/**
 * Tự tạo divIcon (HTML marker) thay cho icon mặc định.
 * - Tránh vấn đề Webpack/Next không bundle được PNG mặc định của Leaflet.
 * - Cho phép dễ dàng phân biệt 2 màu: xanh (khởi hành) / đỏ (điểm đến).
 */
function makeDivIcon(color: string, borderColor: string) {
  return L.divIcon({
    className: "travelto-marker",
    html: `<div style="
      width:22px;
      height:22px;
      border-radius:50%;
      background:${color};
      border:3px solid ${borderColor};
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  });
}

const destinationIcon = makeDivIcon("#db2200", "#7a1300");
const departureIcon = makeDivIcon("#0a7d59", "#054a35");

/**
 * Auto-fit map bounds để hiển thị tất cả các điểm.
 */
function FitBounds({ points }: { points: LatLngExpression[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 11);
      return;
    }

    const bounds = L.latLngBounds(points as L.LatLngTuple[]);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, points]);

  return null;
}

export function LeafletMapImpl({
  destinationCoords,
  departureCoords,
  destinationLocation,
  departureLocation,
  tourTitle,
  provinceName,
}: MapInnerProps) {
  // Luôn dùng primitive lat/lng làm deps để useMemo/FitBounds không bị re-run mỗi render.
  const destPos = useMemo<LatLngExpression>(
    () => [destinationCoords.lat, destinationCoords.lng],
    [destinationCoords.lat, destinationCoords.lng],
  );
  const depPos = useMemo<LatLngExpression | null>(
    () =>
      departureCoords ? [departureCoords.lat, departureCoords.lng] : null,
    [departureCoords?.lat, departureCoords?.lng],
  );

  const points = useMemo<LatLngExpression[]>(() => {
    const result: LatLngExpression[] = [];
    if (depPos) result.push(depPos);
    result.push(destPos);
    return result;
  }, [depPos, destPos]);

  return (
    <MapContainer
      center={destPos}
      zoom={10}
      scrollWheelZoom
      style={{ width: "100%", height: "100%" }}
    >
      {/* OpenStreetMap tiles - miễn phí, không cần API key */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds points={points} />

      {depPos && (
        <Marker position={depPos} icon={departureIcon}>
          <Popup>
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#0a7d59]">📍 Điểm khởi hành</p>
              <p className="text-xs text-[#34594d]">{departureLocation}</p>
            </div>
          </Popup>
        </Marker>
      )}

      <Marker position={destPos} icon={destinationIcon}>
        <Popup>
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#083b2d]">{tourTitle}</p>
            <p className="text-xs text-[#34594d]">📍 {destinationLocation || provinceName}</p>
          </div>
        </Popup>
      </Marker>

      {depPos && (
        <Polyline
          positions={[depPos, destPos]}
          pathOptions={{
            color: "#0a7d59",
            weight: 3,
            opacity: 0.85,
            dashArray: "8 8",
          }}
        />
      )}
    </MapContainer>
  );
}
