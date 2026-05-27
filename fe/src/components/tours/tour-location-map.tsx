"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

interface TourLocationMapProps {
  destinationLocation: string;
  departureLocation?: string;
  tourTitle: string;
  provinceName: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

// Toạ độ trung tâm Việt Nam làm fallback
const VIETNAM_CENTER: LatLng = { lat: 16.047079, lng: 108.20623 };

// Bản đồ tỉnh/thành phố Việt Nam phổ biến (fallback nếu Nominatim lỗi)
const PROVINCE_COORDS: Record<string, LatLng> = {
  "hà nội": { lat: 21.0285, lng: 105.8542 },
  "hồ chí minh": { lat: 10.7626, lng: 106.6602 },
  "sài gòn": { lat: 10.7626, lng: 106.6602 },
  "đà nẵng": { lat: 16.0544, lng: 108.2022 },
  "hải phòng": { lat: 20.8449, lng: 106.6881 },
  "cần thơ": { lat: 10.0452, lng: 105.7469 },
  "huế": { lat: 16.4637, lng: 107.5909 },
  "nha trang": { lat: 12.2388, lng: 109.1967 },
  "đà lạt": { lat: 11.9404, lng: 108.4583 },
  "phú quốc": { lat: 10.2899, lng: 103.984 },
  "hạ long": { lat: 20.9101, lng: 107.1839 },
  "sapa": { lat: 22.3364, lng: 103.8438 },
  "ninh bình": { lat: 20.2506, lng: 105.9745 },
  "quảng bình": { lat: 17.4682, lng: 106.6225 },
  "vũng tàu": { lat: 10.4114, lng: 107.1362 },
  "quy nhơn": { lat: 13.7829, lng: 109.2196 },
  "phan thiết": { lat: 10.9289, lng: 108.1022 },
  "hội an": { lat: 15.8801, lng: 108.338 },
  "mũi né": { lat: 10.9333, lng: 108.2833 },
  "côn đảo": { lat: 8.6833, lng: 106.6 },
  "tây ninh": { lat: 11.3676, lng: 106.1183 },
  "lào cai": { lat: 22.485, lng: 103.9707 },
  "hà giang": { lat: 22.8268, lng: 104.9784 },
};

function lookupProvince(text: string | undefined): LatLng | null {
  if (!text) return null;
  const normalized = text.toLowerCase().trim();
  for (const [key, coords] of Object.entries(PROVINCE_COORDS)) {
    if (normalized.includes(key)) return coords;
  }
  return null;
}

/**
 * Geocode một địa chỉ tự do dùng Nominatim (OpenStreetMap) - miễn phí 100%.
 * Lưu ý: Nominatim Public yêu cầu rate limit ≤ 1 req/giây và phải có Referer header.
 */
async function geocodeNominatim(address: string, signal: AbortSignal): Promise<LatLng | null> {
  if (!address) return null;
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", `${address}, Việt Nam`);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "vn");
    url.searchParams.set("accept-language", "vi");

    const res = await fetch(url.toString(), {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data || data.length === 0) return null;

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return { lat, lng: lon };
  } catch {
    return null;
  }
}

// =====================================================================
// React-Leaflet phải load client-side (Leaflet đụng tới `window`).
// Tách phần "Map" thành component riêng và dùng next/dynamic ssr:false.
// =====================================================================

interface MapInnerProps {
  destinationCoords: LatLng;
  departureCoords: LatLng | null;
  destinationLocation: string;
  departureLocation: string | undefined;
  tourTitle: string;
  provinceName: string;
}

const LeafletMap = dynamic(() => import("./leaflet-map-impl").then((m) => m.LeafletMapImpl), {
  ssr: false,
});

export function TourLocationMap(props: TourLocationMapProps) {
  const { destinationLocation, departureLocation, tourTitle, provinceName } = props;
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);
  const [departureCoords, setDepartureCoords] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    let timeoutId: number | undefined;

    (async () => {
      // Tối ưu: nếu lookup tỉnh thành đã hit, không cần gọi Nominatim cho điểm đó.
      const destProvince =
        lookupProvince(destinationLocation) ?? lookupProvince(provinceName);
      const depProvince = lookupProvince(departureLocation);

      const needDestApi = !destProvince;
      const needDepApi = Boolean(departureLocation) && !depProvince;

      let destFromApi: LatLng | null = null;
      let depFromApi: LatLng | null = null;

      if (needDestApi) {
        destFromApi = await geocodeNominatim(
          destinationLocation || provinceName,
          controller.signal,
        );
        if (cancelled) return;
      }

      if (needDepApi) {
        // Cách nhau ~1.1s để tôn trọng rate limit Nominatim Public (1 req/s).
        if (needDestApi) {
          await new Promise<void>((resolve) => {
            timeoutId = window.setTimeout(resolve, 1100);
          });
          if (cancelled) return;
        }
        depFromApi = await geocodeNominatim(departureLocation!, controller.signal);
        if (cancelled) return;
      }

      const finalDest = destFromApi ?? destProvince ?? VIETNAM_CENTER;
      const finalDep = depFromApi ?? depProvince;

      setDestinationCoords(finalDest);
      setDepartureCoords(finalDep);
      setStatus("ready");
    })();

    return () => {
      cancelled = true;
      controller.abort();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [destinationLocation, departureLocation, provinceName]);

  return (
    <div
      role="region"
      aria-label={`Bản đồ vị trí tour ${tourTitle}`}
      className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-[#cdece0]"
    >
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#f8fffb] pointer-events-none">
          <p className="text-base font-semibold text-[#0a7d59]">Đang tải bản đồ...</p>
        </div>
      )}

      {status === "ready" && destinationCoords && (
        <LeafletMap
          destinationCoords={destinationCoords}
          departureCoords={departureCoords}
          destinationLocation={destinationLocation}
          departureLocation={departureLocation}
          tourTitle={tourTitle}
          provinceName={provinceName}
        />
      )}
    </div>
  );
}

// Export type cho file impl dùng chung
export type { MapInnerProps, LatLng };
