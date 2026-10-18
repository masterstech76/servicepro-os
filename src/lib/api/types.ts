export interface ServiceDTO {
  id: string;
  name: string;
  category: string;
  skillTag: string;
  pricing: "flat" | "hourly";
  priceCents: number;
  durationMinutes: number;
  minBillableMinutes?: number;
  depositPctOverride?: number | null;
  description: string;
}

export interface ZipCheckDTO {
  served: boolean;
  zip: string;
  city?: string;
  state?: string;
  surchargeCents: number;
}

export interface AvailableSlotDTO {
  start: string; // ISO UTC
  end: string; // ISO UTC
  lowAvailability: boolean; // true when remaining <= 2
  remaining?: number;
  simulateSlotTaken?: boolean; // used in mock mode to trigger SLOT_TAKEN
}

export interface HoldSlotInput {
  serviceId: string;
  zip: string;
  start: string;
  turnstileToken?: string;
}

export interface HoldSlotDTO {
  holdId: string;
  expiresAt: string; // ISO UTC
}

export interface UploadFileSpec {
  name: string;
  type: "image/jpeg" | "image/png" | "image/webp";
  size: number;
}

export interface SignedUploadDTO {
  path: string;
  uploadUrl: string;
  token?: string;
}

export interface AddressSuggestionDTO {
  placeName: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface CheckoutInput {
  holdId: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  issue: string;
  photoPaths: string[];
  smsConsent: boolean;
}

export interface CheckoutDTO {
  clientSecret: string;
  paymentIntentId: string;
  depositCents: number;
  totalEstimateCents: number;
  remainingEstimateCents: number;
}

export interface ConfirmedJobDTO {
  jobNumber: number;
  serviceName: string;
  scheduledStart: string;
  scheduledEnd: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  customerFirstName: string;
  customerPhone: string;
  depositCents: number;
}

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export interface BookingApiAdapter {
  getServices(): Promise<ServiceDTO[]>;
  checkZip(zip: string): Promise<ZipCheckDTO>;
  getSlots(serviceId: string, zip: string, from: string, to: string): Promise<AvailableSlotDTO[]>;
  holdSlot(input: HoldSlotInput): Promise<HoldSlotDTO>;
  signUploads(holdId: string, files: UploadFileSpec[]): Promise<SignedUploadDTO[]>;
  uploadPhoto(signedUpload: SignedUploadDTO, file: Blob): Promise<void>;
  searchAddress(query: string, zip: string): Promise<AddressSuggestionDTO[]>;
  startCheckout(input: CheckoutInput): Promise<CheckoutDTO>;
  confirmBookingPayment(paymentIntentId: string, holdId: string): Promise<{ jobNumber: number }>;
  getJobByIntent(paymentIntentId: string): Promise<ConfirmedJobDTO | null>;
}
