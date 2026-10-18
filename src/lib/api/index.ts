import type { BookingApiAdapter } from "./types";
import { mockBookingAdapter } from "./mock-adapter";
import { realBookingAdapter } from "./real-adapter";

export * from "./types";

export function getApiMode(): "mock" | "real" {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("apiMode");
    if (override === "mock" || override === "real") {
      return override;
    }
  }
  const envMode = process.env.NEXT_PUBLIC_API_MODE ?? process.env.API_MODE ?? "real";
  return envMode === "mock" ? "mock" : "real";
}

export function getBookingApi(): BookingApiAdapter {
  return getApiMode() === "real" ? realBookingAdapter : mockBookingAdapter;
}
