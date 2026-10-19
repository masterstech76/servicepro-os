import { addDays, addMinutes, format } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@config/business.config";
import { computeBookingEstimate } from "@/lib/domain/pricing";
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

interface MockHoldRecord {
  holdId: string;
  serviceId: string;
  zip: string;
  start: string;
  expiresAt: string;
  checkoutInput?: CheckoutInput;
  paymentIntentId?: string;
  depositCents?: number;
  estimateCents?: number;
}

const mockHolds = new Map<string, MockHoldRecord>();
const mockConfirmedJobs = new Map<string, ConfirmedJobDTO>();
let mockJobSequence = 1041;

function sleep(ms = 320): Promise<void> {
  // Fast in automated unit tests, 300-450ms in browser per PHASES.md Phase 1
  const delay = typeof window === "undefined" ? 20 : ms;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export const mockBookingAdapter: BookingApiAdapter = {
  async getServices(): Promise<ServiceDTO[]> {
    await sleep(300);
    return businessConfig.services.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      skillTag: s.skillTag,
      pricing: s.pricing,
      priceCents: s.price,
      durationMinutes: s.durationMinutes,
      minBillableMinutes: s.minBillableMinutes,
      depositPctOverride: s.depositPctOverride ?? null,
      description: s.description,
    }));
  },

  async checkZip(zip: string): Promise<ZipCheckDTO> {
    await sleep(310);
    const clean = zip.trim();
    const served = businessConfig.zipCodes.includes(clean);
    if (!served) {
      return {
        served: false,
        zip: clean,
        surchargeCents: 0,
      };
    }
    return {
      served: true,
      zip: clean,
      city: businessConfig.city,
      state: businessConfig.state,
      surchargeCents: clean === "33149" ? 1500 : 0, // Key Biscayne surcharge example or 0 for 33133
    };
  },

  async getSlots(serviceId: string, zip: string, from: string, to: string): Promise<AvailableSlotDTO[]> {
    await sleep(350);
    if (!businessConfig.zipCodes.includes(zip.trim())) {
      return [];
    }

    const service =
      businessConfig.services.find((s) => s.id === serviceId) ?? businessConfig.services[0];
    const tz = businessConfig.timezone;
    const slots: AvailableSlotDTO[] = [];

    // Generate deterministic slots across the requested range
    // Day index 2 (3rd day in scroller) is intentionally fully booked (empty) so the "Fully booked — try {next available day}" link is testable!
    const startDay = new Date(`${from}T00:00:00`);
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const d = addDays(startDay, dayOffset);
      const dateStr = format(d, "yyyy-MM-dd");
      if (dateStr > to) break;

      const dayOfWeek = d.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const hours = businessConfig.hours[dayOfWeek];
      if (!hours) continue; // Sunday closed

      // Make dayOffset === 2 fully booked (unless it's Sunday, in which case dayOffset === 3 is fully booked)
      const fullyBookedOffset = new Date(addDays(startDay, 2)).getDay() === 0 ? 3 : 2;
      if (dayOffset === fullyBookedOffset) {
        continue;
      }

      const candidateHours = dayOfWeek === 6 ? [8, 9, 10, 11, 12, 13, 14] : [8, 9, 10, 11, 13, 14, 15, 16];
      for (const hr of candidateHours) {
        const localStartStr = `${dateStr}T${String(hr).padStart(2, "0")}:00:00`;
        const utcStart = fromZonedTime(localStartStr, tz);
        // Ensure future slot or at least deterministic for today/tomorrow
        const utcEnd = addMinutes(utcStart, service.durationMinutes);

        // 14:00 (2:00 PM) has "Only 1 left" (lowAvailability = true, remaining = 1)
        // 11:00 (11:00 AM) simulates SLOT_TAKEN when clicked
        const isOneLeft = hr === 14;
        const isTwoLeft = hr === 9;
        const isTakenTrigger = hr === 11;

        slots.push({
          start: utcStart.toISOString(),
          end: utcEnd.toISOString(),
          lowAvailability: isOneLeft || isTwoLeft || isTakenTrigger,
          remaining: isOneLeft || isTakenTrigger ? 1 : isTwoLeft ? 2 : 3,
          simulateSlotTaken: isTakenTrigger,
        });
      }
    }

    return slots;
  },

  async holdSlot(input: HoldSlotInput): Promise<HoldSlotDTO> {
    await sleep(320);
    if (!businessConfig.zipCodes.includes(input.zip.trim())) {
      throw new ApiError("ZIP_NOT_SERVED", `Sorry, we don't serve ${input.zip} yet.`, 400);
    }

    // Simulate SLOT_TAKEN when user selects the 11:00 AM slot in business timezone
    const localHour = Number(formatInTimeZone(new Date(input.start), businessConfig.timezone, "H"));
    if (localHour === 11) {
      throw new ApiError(
        "SLOT_TAKEN",
        "That time was just taken. Please pick another available window.",
        409
      );
    }

    const holdId = `hold_${Math.random().toString(36).slice(2, 10)}`;
    const expiresAt = addMinutes(new Date(), businessConfig.booking.holdMinutes).toISOString();

    mockHolds.set(holdId, {
      holdId,
      serviceId: input.serviceId,
      zip: input.zip,
      start: input.start,
      expiresAt,
    });

    return { holdId, expiresAt };
  },

  async signUploads(holdId: string, files: UploadFileSpec[]): Promise<SignedUploadDTO[]> {
    await sleep(300);
    return files.map((f, idx) => ({
      path: `${businessConfig.slug}/drafts/${holdId}/${Date.now()}-${idx}-${f.name.replace(/[^a-zA-Z0-9._-]/g, "")}`,
      uploadUrl: `mock://upload/${holdId}/${idx}`,
    }));
  },

  async uploadPhoto(_signedUpload: SignedUploadDTO, _file: Blob): Promise<void> {
    await sleep(250);
  },

  async searchAddress(query: string, zip: string): Promise<AddressSuggestionDTO[]> {
    await sleep(200);
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    // Deterministic mock suggestions for Miami addresses
    const isWrongZipTest = trimmed.toLowerCase().includes("90210") || trimmed.toLowerCase().includes("beverly");
    if (isWrongZipTest) {
      return [
        {
          placeName: "456 Rodeo Dr, Beverly Hills, CA 90210",
          line1: "456 Rodeo Dr",
          city: "Beverly Hills",
          state: "CA",
          zip: "90210",
          lat: 34.0696,
          lng: -118.4053,
        },
      ];
    }

    return [
      {
        placeName: `${trimmed}, Miami, FL ${zip}`,
        line1: trimmed,
        city: "Miami",
        state: "FL",
        zip,
        lat: 25.7617,
        lng: -80.1918,
      },
      {
        placeName: `123 Brickell Ave, Miami, FL ${zip}`,
        line1: "123 Brickell Ave",
        city: "Miami",
        state: "FL",
        zip,
        lat: 25.765,
        lng: -80.1905,
      },
    ];
  },

  async startCheckout(input: CheckoutInput): Promise<CheckoutDTO> {
    await sleep(350);
    const hold = mockHolds.get(input.holdId);
    if (!hold) {
      throw new ApiError("HOLD_NOT_FOUND", "Slot hold expired, pick time again.", 410);
    }
    const serviceId = hold.serviceId;
    const service = businessConfig.services.find((s) => s.id === serviceId);
    if (!service) {
      throw new ApiError("SERVICE_NOT_FOUND", "Service not found.", 404);
    }

    const zipInfo = await this.checkZip(input.address.zip);
    if (!zipInfo.served) {
      throw new ApiError("ZIP_NOT_SERVED", `Sorry, we don't serve ${input.address.zip} yet.`, 400);
    }

    const est = computeBookingEstimate({
      pricingType: service.pricing,
      priceCents: service.price,
      durationMinutes: service.durationMinutes,
      minBillableMinutes: service.minBillableMinutes,
      surchargeCents: zipInfo.surchargeCents,
      depositPct: businessConfig.booking.depositPct,
      depositPctOverride: service.depositPctOverride,
    });

    const paymentIntentId = `pi_mock_${input.holdId}`;
    const clientSecret = `${paymentIntentId}_secret_mock`;

    mockHolds.set(input.holdId, {
      holdId: input.holdId,
      serviceId: service.id,
      zip: input.address.zip,
      start: hold.start,
      expiresAt: addMinutes(new Date(), 15).toISOString(),
      checkoutInput: input,
      paymentIntentId,
      depositCents: est.depositCents,
      estimateCents: est.estimateCents,
    });

    return {
      clientSecret,
      paymentIntentId,
      depositCents: est.depositCents,
      totalEstimateCents: est.estimateCents,
      remainingEstimateCents: est.remainingEstimateCents,
    };
  },

  async confirmBookingPayment(paymentIntentId: string, holdId: string): Promise<{ jobNumber: number }> {
    await sleep(350);
    const existing = mockConfirmedJobs.get(paymentIntentId);
    if (existing) {
      return { jobNumber: existing.jobNumber };
    }

    const hold = mockHolds.get(holdId);
    if (!hold) {
      throw new ApiError("HOLD_NOT_FOUND", "Slot hold expired.", 410);
    }
    const service = businessConfig.services.find((s) => s.id === hold.serviceId);
    if (!service) {
      throw new ApiError("SERVICE_NOT_FOUND", "Service not found.", 404);
    }
    const startIso = hold.start;
    const endIso = addMinutes(new Date(startIso), service.durationMinutes).toISOString();

    mockJobSequence += 1;
    const job: ConfirmedJobDTO = {
      jobNumber: mockJobSequence,
      serviceName: service.name,
      scheduledStart: startIso,
      scheduledEnd: endIso,
      addressLine1: hold?.checkoutInput?.address.line1 ?? "123 Brickell Ave",
      city: hold?.checkoutInput?.address.city ?? "Miami",
      state: hold?.checkoutInput?.address.state ?? "FL",
      zip: hold?.checkoutInput?.address.zip ?? "33133",
      customerFirstName: (hold?.checkoutInput?.customer.name ?? "Maria").split(" ")[0],
      customerPhone: hold?.checkoutInput?.customer.phone ?? "(305) 555-0142",
      depositCents: hold?.depositCents ?? 1980,
    };

    mockConfirmedJobs.set(paymentIntentId, job);
    return { jobNumber: job.jobNumber };
  },

  async getJobByIntent(paymentIntentId: string): Promise<ConfirmedJobDTO | null> {
    await sleep(200);
    return mockConfirmedJobs.get(paymentIntentId) ?? null;
  },
};
