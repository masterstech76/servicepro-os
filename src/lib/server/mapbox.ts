import "server-only";
import { businessConfig } from "@config/business.config";

export interface GeocodeResult {
  lat: number;
  lng: number;
  resolvedZip?: string;
  provider: "mapbox" | "mock";
}

/**
 * Geocodes a street address + city/state/zip to {lat, lng}.
 * Uses Mapbox Geocoding API when MAPBOX_SERVER_TOKEN is set;
 * otherwise falls back to deterministic Miami coordinates per BLOCKERS.md.
 */
export async function geocodeAddress(input: {
  line1: string;
  city: string;
  state: string;
  zip: string;
}): Promise<GeocodeResult> {
  const token = process.env.MAPBOX_SERVER_TOKEN?.trim();

  if (token) {
    try {
      const query = encodeURIComponent(
        `${input.line1}, ${input.city}, ${input.state} ${input.zip}`
      );
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=us&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const feature = data?.features?.[0];
        if (feature && Array.isArray(feature.center) && feature.center.length >= 2) {
          const [lng, lat] = feature.center;
          const postcodeCtx = (feature.context ?? []).find((c: { id?: string; text?: string }) =>
            c.id?.startsWith("postcode.")
          );
          return {
            lat,
            lng,
            resolvedZip: postcodeCtx?.text,
            provider: "mapbox",
          };
        }
      }
    } catch {
      // Fall back to deterministic mock coordinates
    }
  }

  // Deterministic coordinate hash inside Miami near businessConfig.mapbox.defaultCenter
  const [baseLng, baseLat] = businessConfig.mapbox.defaultCenter;
  const zipNum = parseInt(input.zip, 10) || 33133;
  const offsetLat = ((zipNum % 25) - 12) * 0.003;
  const offsetLng = ((input.line1.length % 20) - 10) * 0.002;

  return {
    lat: Number((baseLat + offsetLat).toFixed(6)),
    lng: Number((baseLng + offsetLng).toFixed(6)),
    resolvedZip: input.zip,
    provider: "mock",
  };
}
