import {
  ApiError,
  type AddressSuggestionDTO,
  type AvailableSlotDTO,
  type BookingApiAdapter,
  type CheckoutDTO,
  type CheckoutInput,
  type ConfirmedJobDTO,
  type HoldSlotDTO,
  type HoldSlotInput,
  type ServiceDTO,
  type SignedUploadDTO,
  type UploadFileSpec,
  type ZipCheckDTO,
} from "./types";
import { mockBookingAdapter } from "./mock-adapter";

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const code = data?.error?.code ?? "API_ERROR";
    const message = data?.error?.message ?? "Something went wrong. Please try again.";
    throw new ApiError(code, message, res.status);
  }
  return data as T;
}

export const realBookingAdapter: BookingApiAdapter = {
  async getServices(): Promise<ServiceDTO[]> {
    const res = await fetch("/api/services", { next: { revalidate: 60 } });
    const data = await parseJsonOrThrow<{ services: ServiceDTO[] }>(res);
    return data.services;
  },

  async checkZip(zip: string): Promise<ZipCheckDTO> {
    const res = await fetch(`/api/service-area?zip=${encodeURIComponent(zip.trim())}`, {
      next: { revalidate: 300 },
    });
    return parseJsonOrThrow<ZipCheckDTO>(res);
  },

  async getSlots(serviceId: string, zip: string, from: string, to: string): Promise<AvailableSlotDTO[]> {
    const params = new URLSearchParams({ serviceId, zip, from, to });
    const res = await fetch(`/api/slots?${params.toString()}`, { cache: "no-store" });
    const data = await parseJsonOrThrow<{ slots: AvailableSlotDTO[] }>(res);
    return data.slots;
  },

  async holdSlot(input: HoldSlotInput): Promise<HoldSlotDTO> {
    const res = await fetch("/api/slots/hold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return parseJsonOrThrow<HoldSlotDTO>(res);
  },

  async signUploads(holdId: string, files: UploadFileSpec[]): Promise<SignedUploadDTO[]> {
    const res = await fetch("/api/uploads/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ holdId, files }),
    });
    const data = await parseJsonOrThrow<{ uploads: SignedUploadDTO[] }>(res);
    return data.uploads;
  },

  async uploadPhoto(signedUpload: SignedUploadDTO, file: Blob): Promise<void> {
    if (signedUpload.uploadUrl.startsWith("mock://") || signedUpload.uploadUrl.startsWith("/api/")) {
      const res = await fetch(signedUpload.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/jpeg" },
        body: file,
      });
      if (!res.ok) {
        throw new ApiError("UPLOAD_FAILED", "Failed to upload photo.", res.status);
      }
      return;
    }
    const res = await fetch(signedUpload.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/jpeg" },
      body: file,
    });
    if (!res.ok) {
      throw new ApiError("UPLOAD_FAILED", "Failed to upload photo to storage.", res.status);
    }
  },

  async searchAddress(query: string, zip: string): Promise<AddressSuggestionDTO[]> {
    // Uses mock/fallback autocomplete when NEXT_PUBLIC_MAPBOX_TOKEN is not set
    return mockBookingAdapter.searchAddress(query, zip);
  },

  async startCheckout(input: CheckoutInput): Promise<CheckoutDTO> {
    const res = await fetch("/api/jobs/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return parseJsonOrThrow<CheckoutDTO>(res);
  },

  async confirmBookingPayment(paymentIntentId: string, holdId: string): Promise<{ jobNumber: number }> {
    const res = await fetch("/api/dev/simulate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentIntentId, holdId }),
    });
    return parseJsonOrThrow<{ jobNumber: number }>(res);
  },

  async getJobByIntent(paymentIntentId: string): Promise<ConfirmedJobDTO | null> {
    const res = await fetch(`/api/jobs/by-intent?pi=${encodeURIComponent(paymentIntentId)}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    const data = await parseJsonOrThrow<{ job: ConfirmedJobDTO }>(res);
    return data.job;
  },
};
