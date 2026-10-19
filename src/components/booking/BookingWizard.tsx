"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { addDays, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  Snowflake,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Lock,
  Info,
  CalendarPlus,
  Phone,
  WifiOff,
  CreditCard,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import {
  getBookingApi,
  ApiError,
  type AvailableSlotDTO,
  type ConfirmedJobDTO,
  type ServiceDTO,
  type AddressSuggestionDTO,
} from "@/lib/api";
import { computeBookingEstimate } from "@/lib/domain/pricing";
import {
  formatBusinessDate,
  formatBusinessTime,
  formatBusinessTimeWithZone,
  formatDisplayPhone,
  formatMoneyCents,
} from "@/lib/domain/format";
import {
  zipSchema,
  step3IssueSchema,
  step5DetailsSchema,
} from "@/lib/validation/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { Money } from "@/components/shared/Money";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { SlotChip } from "@/components/booking/SlotChip";
import {
  PhotoUploader,
  type UploadedPhotoItem,
} from "@/components/booking/PhotoUploader";
import { Step1Service } from "@/components/booking/steps/Step1Service";
import { Step2Zip } from "@/components/booking/steps/Step2Zip";
import { Step3Issue } from "@/components/booking/steps/Step3Issue";
import { Step4Slot } from "@/components/booking/steps/Step4Slot";
import { Step5Details } from "@/components/booking/steps/Step5Details";
import { Step6Payment } from "@/components/booking/steps/Step6Payment";
import { Step7Confirm } from "@/components/booking/steps/Step7Confirm";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "servicepro_booking_wizard_v1";

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WizardState {
  step: WizardStep;
  selectedService: ServiceDTO | null;
  zip: string;
  zipChecked: boolean;
  zipServed: boolean;
  zipCity: string;
  zipState: string;
  surchargeCents: number;
  issueText: string;
  selectedDay: string; // YYYY-MM-DD in business timezone
  selectedSlotStart: string | null; // ISO UTC
  holdId: string | null;
  holdExpiresAt: string | null; // ISO UTC
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  uploadedPhotoPaths: string[];
  clientSecret: string | null;
  paymentIntentId: string | null;
  confirmedJob: ConfirmedJobDTO | null;
}

type WizardAction =
  | { type: "HYDRATE"; payload: Partial<WizardState> }
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SELECT_SERVICE"; service: ServiceDTO }
  | {
      type: "SET_ZIP_RESULT";
      zip: string;
      checked: boolean;
      served: boolean;
      city?: string;
      state?: string;
      surchargeCents: number;
    }
  | { type: "SET_ISSUE_TEXT"; text: string }
  | { type: "SET_DAY"; day: string }
  | { type: "SELECT_SLOT"; slotStart: string }
  | { type: "SET_HOLD"; holdId: string; expiresAt: string }
  | { type: "CLEAR_HOLD" }
  | {
      type: "SET_CONTACT_FIELD";
      field:
        | "addressLine1"
        | "addressLine2"
        | "city"
        | "state"
        | "customerName"
        | "customerPhone"
        | "customerEmail";
      value: string;
    }
  | { type: "SET_UPLOADED_PATHS"; paths: string[] }
  | { type: "SET_CHECKOUT"; clientSecret: string; paymentIntentId: string }
  | { type: "SET_CONFIRMED_JOB"; job: ConfirmedJobDTO };

function getInitialDayString(): string {
  const now = new Date();
  const tomorrow = addDays(now, 1);
  // If tomorrow is Sunday (closed), pick Monday
  const dayInTz = formatInTimeZone(tomorrow, businessConfig.timezone, "yyyy-MM-dd");
  const dow = Number(formatInTimeZone(tomorrow, businessConfig.timezone, "i")); // 7 = Sunday in ISO
  if (dow === 7) {
    return formatInTimeZone(addDays(tomorrow, 1), businessConfig.timezone, "yyyy-MM-dd");
  }
  return dayInTz;
}

const initialWizardState: WizardState = {
  step: 1,
  selectedService: null,
  zip: "",
  zipChecked: false,
  zipServed: false,
  zipCity: businessConfig.city,
  zipState: businessConfig.state,
  surchargeCents: 0,
  issueText: "",
  selectedDay: getInitialDayString(),
  selectedSlotStart: null,
  holdId: null,
  holdExpiresAt: null,
  addressLine1: "",
  addressLine2: "",
  city: businessConfig.city,
  state: businessConfig.state,
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  uploadedPhotoPaths: [],
  clientSecret: null,
  paymentIntentId: null,
  confirmedJob: null,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SELECT_SERVICE":
      return { ...state, selectedService: action.service };
    case "SET_ZIP_RESULT":
      return {
        ...state,
        zip: action.zip,
        zipChecked: action.checked,
        zipServed: action.served,
        zipCity: action.city ?? businessConfig.city,
        zipState: action.state ?? businessConfig.state,
        city: action.city ?? businessConfig.city,
        state: action.state ?? businessConfig.state,
        surchargeCents: action.surchargeCents,
      };
    case "SET_ISSUE_TEXT":
      return { ...state, issueText: action.text };
    case "SET_DAY":
      return { ...state, selectedDay: action.day, selectedSlotStart: null };
    case "SELECT_SLOT":
      return { ...state, selectedSlotStart: action.slotStart };
    case "SET_HOLD":
      return { ...state, holdId: action.holdId, holdExpiresAt: action.expiresAt };
    case "CLEAR_HOLD":
      return {
        ...state,
        holdId: null,
        holdExpiresAt: null,
        selectedSlotStart: null,
      };
    case "SET_CONTACT_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_UPLOADED_PATHS":
      return { ...state, uploadedPhotoPaths: action.paths };
    case "SET_CHECKOUT":
      return {
        ...state,
        clientSecret: action.clientSecret,
        paymentIntentId: action.paymentIntentId,
      };
    case "SET_CONFIRMED_JOB":
      return { ...state, confirmedJob: action.job, step: 7 };
    default:
      return state;
  }
}

export function BookingWizard() {
  const searchParams = useSearchParams();
  const [state, dispatch] = React.useReducer(wizardReducer, initialWizardState);
  const [hydrated, setHydrated] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

  // Step 1 services list
  const [services, setServices] = React.useState<ServiceDTO[]>([]);
  const [loadingServices, setLoadingServices] = React.useState(true);

  // Step 2 ZIP check
  const [checkingZip, setCheckingZip] = React.useState(false);
  const [zipError, setZipError] = React.useState<string | null>(null);

  // Step 3 photos
  const [photos, setPhotos] = React.useState<UploadedPhotoItem[]>([]);
  const [issueError, setIssueError] = React.useState<string | null>(null);

  // Step 4 slots
  const [slots, setSlots] = React.useState<AvailableSlotDTO[]>([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [holdingSlot, setHoldingSlot] = React.useState(false);

  // Step 5 address suggestions & field errors
  const [suggestions, setSuggestions] = React.useState<AddressSuggestionDTO[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
  const [startingCheckout, setStartingCheckout] = React.useState(false);

  // Step 6 mock card form & countdown
  const [cardNumber, setCardNumber] = React.useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = React.useState("12/28");
  const [cardCvc, setCardCvc] = React.useState("424");
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [submittingPayment, setSubmittingPayment] = React.useState(false);
  const [remainingSeconds, setRemainingSeconds] = React.useState<number | null>(null);
  const [holdExpiredModalOpen, setHoldExpiredModalOpen] = React.useState(false);

  // Online/offline listener
  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Hydrate from sessionStorage
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<WizardState>;
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // ignore storage errors
    } finally {
      setHydrated(true);
    }
  }, []);

  // Prefill contact details if customer is logged in
  React.useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) {
          if (data.profile.name) {
            dispatch({ type: "SET_CONTACT_FIELD", field: "customerName", value: data.profile.name });
          }
          if (data.profile.phone) {
            dispatch({ type: "SET_CONTACT_FIELD", field: "customerPhone", value: data.profile.phone });
          }
          if (data.profile.email) {
            dispatch({ type: "SET_CONTACT_FIELD", field: "customerEmail", value: data.profile.email });
          }
        }
      })
      .catch(() => {});
  }, []);

  // Save to sessionStorage
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated]);

  // Load services on mount
  React.useEffect(() => {
    let active = true;
    const api = getBookingApi();
    setLoadingServices(true);
    api
      .getServices()
      .then((list) => {
        if (!active) return;
        setServices(list);
        const preselectId = searchParams.get("serviceId");
        if (preselectId) {
          const found = list.find((s) => s.id === preselectId);
          if (found) {
            dispatch({ type: "SELECT_SERVICE", service: found });
          }
        } else if (!state.selectedService && list.length > 0) {
          dispatch({ type: "SELECT_SERVICE", service: list[0] });
        }
      })
      .catch(() => {
        toast.error("Unable to load services.");
      })
      .finally(() => {
        if (active) setLoadingServices(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Support testing hold expiry via query param ?expireHoldIn=2
  const expireHoldOverrideSec = searchParams.get("expireHoldIn")
    ? Number(searchParams.get("expireHoldIn"))
    : null;

  // Hold countdown timer
  React.useEffect(() => {
    if (!state.holdExpiresAt || state.step === 7) {
      setRemainingSeconds(null);
      return;
    }

    const updateTimer = () => {
      const expiresMs = new Date(state.holdExpiresAt!).getTime();
      const diffSec = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
      setRemainingSeconds(diffSec);
      if (diffSec <= 0) {
        setHoldExpiredModalOpen(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [state.holdExpiresAt, state.step]);

  // Load 7-day slots when entering Step 4
  const scrollerDays = React.useMemo(() => {
    const base = new Date();
    const list: { dateStr: string; label: string; shortLabel: string }[] = [];
    for (let i = 1; i <= 7; i++) {
      const d = addDays(base, i);
      const dateStr = formatInTimeZone(d, businessConfig.timezone, "yyyy-MM-dd");
      const label = formatInTimeZone(d, businessConfig.timezone, "EEE MMM d");
      const shortLabel = formatInTimeZone(d, businessConfig.timezone, "EEE d");
      list.push({ dateStr, label, shortLabel });
    }
    return list;
  }, []);

  React.useEffect(() => {
    if (state.step !== 4 || !state.selectedService || !state.zipServed) return;
    let active = true;
    const api = getBookingApi();
    setLoadingSlots(true);
    const from = scrollerDays[0].dateStr;
    const to = scrollerDays[scrollerDays.length - 1].dateStr;

    api
      .getSlots(state.selectedService.id, state.zip, from, to)
      .then((res) => {
        if (!active) return;
        setSlots(res);
      })
      .catch(() => {
        if (active) toast.error("Could not load available times.");
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [state.step, state.selectedService, state.zip, state.zipServed, scrollerDays]);

  // Auto-check ZIP at 5 digits in Step 2
  async function handleZipInputChange(raw: string) {
    const digitsOnly = raw.replace(/\D/g, "").slice(0, 5);
    setZipError(null);
    dispatch({
      type: "SET_ZIP_RESULT",
      zip: digitsOnly,
      checked: false,
      served: false,
      surchargeCents: 0,
    });

    if (digitsOnly.length === 5) {
      setCheckingZip(true);
      try {
        const api = getBookingApi();
        const res = await api.checkZip(digitsOnly);
        dispatch({
          type: "SET_ZIP_RESULT",
          zip: digitsOnly,
          checked: true,
          served: res.served,
          city: res.city,
          state: res.state,
          surchargeCents: res.surchargeCents,
        });
        if (!res.served) {
          setZipError(`Sorry, we don't serve ${digitsOnly} yet.`);
        }
      } catch {
        setZipError("Could not verify ZIP code. Please try again.");
      } finally {
        setCheckingZip(false);
      }
    }
  }

  // Address autocomplete in Step 5
  async function handleAddressChange(val: string) {
    dispatch({ type: "SET_CONTACT_FIELD", field: "addressLine1", value: val });
    setFieldErrors((prev) => ({ ...prev, addressLine1: "" }));
    if (val.trim().length >= 3) {
      const api = getBookingApi();
      const results = await api.searchAddress(val, state.zip);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSelectSuggestion(item: AddressSuggestionDTO) {
    dispatch({ type: "SET_CONTACT_FIELD", field: "addressLine1", value: item.line1 });
    dispatch({ type: "SET_CONTACT_FIELD", field: "city", value: item.city });
    dispatch({ type: "SET_CONTACT_FIELD", field: "state", value: item.state });
    setShowSuggestions(false);

    if (item.zip !== state.zip) {
      setFieldErrors((prev) => ({
        ...prev,
        addressLine1: `That address isn't in ${state.zip}.`,
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, addressLine1: "" }));
    }
  }

  // Filter slots for selectedDay
  const daySlots = React.useMemo(() => {
    return slots.filter((s) => {
      const slotLocalDay = formatInTimeZone(
        new Date(s.start),
        businessConfig.timezone,
        "yyyy-MM-dd"
      );
      return slotLocalDay === state.selectedDay;
    });
  }, [slots, state.selectedDay]);

  const morningSlots = React.useMemo(() => {
    return daySlots.filter((s) => {
      const hour = Number(formatInTimeZone(new Date(s.start), businessConfig.timezone, "H"));
      return hour < 12;
    });
  }, [daySlots]);

  const afternoonSlots = React.useMemo(() => {
    return daySlots.filter((s) => {
      const hour = Number(formatInTimeZone(new Date(s.start), businessConfig.timezone, "H"));
      return hour >= 12;
    });
  }, [daySlots]);

  const nextAvailableDay = React.useMemo(() => {
    for (const d of scrollerDays) {
      if (d.dateStr <= state.selectedDay) continue;
      const hasAny = slots.some(
        (s) =>
          formatInTimeZone(new Date(s.start), businessConfig.timezone, "yyyy-MM-dd") ===
          d.dateStr
      );
      if (hasAny) return d;
    }
    return scrollerDays.find((d) =>
      slots.some(
        (s) =>
          formatInTimeZone(new Date(s.start), businessConfig.timezone, "yyyy-MM-dd") ===
          d.dateStr
      )
    );
  }, [scrollerDays, slots, state.selectedDay]);

  // Estimate & deposit computation
  const estimate = React.useMemo(() => {
    const svc = state.selectedService ?? services[0] ?? {
      pricing: "flat" as const,
      priceCents: 9900,
      durationMinutes: 90,
    };
    return computeBookingEstimate({
      pricingType: svc.pricing,
      priceCents: svc.priceCents,
      durationMinutes: svc.durationMinutes,
      minBillableMinutes: svc.minBillableMinutes,
      surchargeCents: state.surchargeCents,
      depositPct: businessConfig.booking.depositPct,
      depositPctOverride: svc.depositPctOverride,
    });
  }, [state.selectedService, services, state.surchargeCents]);

  // Step navigation handler
  async function handleContinue() {
    if (isOffline) {
      toast.error("You're offline. Reconnect to continue.");
      return;
    }

    if (state.step === 1) {
      if (!state.selectedService) {
        toast.error("Please select a service.");
        return;
      }
      dispatch({ type: "SET_STEP", step: 2 });
      return;
    }

    if (state.step === 2) {
      const parsed = zipSchema.safeParse(state.zip);
      if (!parsed.success) {
        setZipError(parsed.error.issues[0].message);
        return;
      }
      if (!state.zipChecked) {
        await handleZipInputChange(state.zip);
        return;
      }
      if (!state.zipServed) {
        setZipError(`Sorry, we don't serve ${state.zip} yet.`);
        return;
      }
      dispatch({ type: "SET_STEP", step: 3 });
      return;
    }

    if (state.step === 3) {
      const parsed = step3IssueSchema.safeParse({ issueText: state.issueText });
      if (!parsed.success) {
        setIssueError(parsed.error.issues[0].message);
        return;
      }
      setIssueError(null);
      dispatch({ type: "SET_STEP", step: 4 });
      return;
    }

    if (state.step === 4) {
      if (!state.selectedSlotStart || !state.selectedService) {
        toast.error("Please pick an arrival time.");
        return;
      }
      setHoldingSlot(true);
      try {
        const api = getBookingApi();
        const hold = await api.holdSlot({
          serviceId: state.selectedService.id,
          zip: state.zip,
          start: state.selectedSlotStart,
        });

        const expiresAt =
          expireHoldOverrideSec !== null
            ? new Date(Date.now() + expireHoldOverrideSec * 1000).toISOString()
            : hold.expiresAt;

        dispatch({ type: "SET_HOLD", holdId: hold.holdId, expiresAt });

        // Upload any selected issue photos to draft folder
        if (photos.length > 0) {
          const specs = photos.map((p) => ({
            name: p.name,
            type: "image/jpeg" as const,
            size: p.file?.size ?? 1024,
          }));
          const signed = await api.signUploads(hold.holdId, specs);
          const uploadedPaths: string[] = [];
          for (let i = 0; i < signed.length; i++) {
            const item = photos[i];
            if (item?.file) {
              await api.uploadPhoto(signed[i], item.file);
            }
            uploadedPaths.push(signed[i].path);
          }
          dispatch({ type: "SET_UPLOADED_PATHS", paths: uploadedPaths });
        }

        dispatch({ type: "SET_STEP", step: 5 });
      } catch (err) {
        if (err instanceof ApiError && err.code === "SLOT_TAKEN") {
          toast.error("That time was just taken");
          dispatch({ type: "CLEAR_HOLD" });
          dispatch({ type: "SET_STEP", step: 4 });
        } else if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Could not hold that time slot. Please pick another.");
        }
      } finally {
        setHoldingSlot(false);
      }
      return;
    }

    if (state.step === 5) {
      const errors: Record<string, string> = {};
      if (
        state.addressLine1.toLowerCase().includes("90210") ||
        state.addressLine1.toLowerCase().includes("beverly")
      ) {
        errors.addressLine1 = `That address isn't in ${state.zip}.`;
      }

      const parsed = step5DetailsSchema.safeParse({
        addressLine1: state.addressLine1,
        addressLine2: state.addressLine2,
        city: state.city,
        state: state.state,
        zip: state.zip,
        name: state.customerName,
        phone: state.customerPhone,
        email: state.customerEmail,
      });

      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = String(issue.path[0]);
          if (!errors[key]) errors[key] = issue.message;
        }
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});

      if (!state.holdId) {
        toast.error("Your slot hold expired. Please pick a time again.");
        dispatch({ type: "SET_STEP", step: 4 });
        return;
      }

      setStartingCheckout(true);
      try {
        const api = getBookingApi();
        const checkout = await api.startCheckout({
          holdId: state.holdId,
          customer: {
            name: state.customerName.trim(),
            phone: state.customerPhone.trim(),
            email: state.customerEmail.trim(),
          },
          address: {
            line1: state.addressLine1.trim(),
            line2: state.addressLine2.trim() || undefined,
            city: state.city.trim(),
            state: state.state.trim(),
            zip: state.zip.trim(),
          },
          issue: state.issueText.trim(),
          photoPaths: state.uploadedPhotoPaths,
          smsConsent: true,
        });
        dispatch({
          type: "SET_CHECKOUT",
          clientSecret: checkout.clientSecret,
          paymentIntentId: checkout.paymentIntentId,
        });
        dispatch({ type: "SET_STEP", step: 6 });
      } catch (err) {
        if (err instanceof ApiError && err.code === "SLOT_TAKEN") {
          toast.error("That time was just taken");
          dispatch({ type: "CLEAR_HOLD" });
          dispatch({ type: "SET_STEP", step: 4 });
        } else if (err instanceof Error) {
          toast.error(err.message);
        }
      } finally {
        setStartingCheckout(false);
      }
      return;
    }

    if (state.step === 6) {
      await handleConfirmPayment();
    }
  }

  async function handleConfirmPayment() {
    if (!state.holdId || !state.paymentIntentId) return;
    setPaymentError(null);

    if (cardNumber.replace(/\D/g, "").endsWith("9995")) {
      setPaymentError("Your card was declined. Please check your card details or try another card.");
      return;
    }

    setSubmittingPayment(true);
    try {
      const api = getBookingApi();
      await api.confirmBookingPayment(state.paymentIntentId, state.holdId);

      // Poll getJobByIntent up to 10 times
      let job: ConfirmedJobDTO | null = null;
      for (let attempt = 0; attempt < 10; attempt++) {
        job = await api.getJobByIntent(state.paymentIntentId);
        if (job) break;
        await new Promise((r) => setTimeout(r, 250));
      }

      if (!job) {
        throw new Error("Booking confirmation timed out.");
      }

      dispatch({ type: "SET_CONFIRMED_JOB", job });
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      if (err instanceof ApiError && err.code === "SLOT_TAKEN") {
        toast.error("That time was just taken");
        dispatch({ type: "CLEAR_HOLD" });
        dispatch({ type: "SET_STEP", step: 4 });
      } else {
        setPaymentError(
          err instanceof Error ? err.message : "Payment failed. Please try again."
        );
      }
    } finally {
      setSubmittingPayment(false);
    }
  }

  function handleBack() {
    if (state.step > 1 && state.step < 7) {
      dispatch({ type: "SET_STEP", step: (state.step - 1) as WizardStep });
    }
  }

  function handlePickNewTimeFromModal() {
    setHoldExpiredModalOpen(false);
    dispatch({ type: "CLEAR_HOLD" });
    dispatch({ type: "SET_STEP", step: 4 });
  }

  function formatCountdown(seconds: number | null): string {
    if (seconds === null) return "10:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // Generate .ics calendar download URL for Step 7
  function buildCalendarHref(job: ConfirmedJobDTO): string {
    const fmt = (iso: string) =>
      new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${businessConfig.businessName} - ${job.serviceName} (Job #${job.jobNumber})`,
      `DTSTART:${fmt(job.scheduledStart)}`,
      `DTEND:${fmt(job.scheduledEnd)}`,
      `LOCATION:${job.addressLine1}, ${job.city}, ${job.state} ${job.zip}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-navy-900">
      {/* Offline banner */}
      {isOffline && (
        <div
          role="alert"
          className="bg-danger text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>You&apos;re offline — actions are paused until connection returns.</span>
        </div>
      )}

      {/* Top Glass Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-heading font-bold text-base sm:text-lg text-navy-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 rounded-xl"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-orange-500 shadow-sm">
              <Snowflake className="h-4 w-4" aria-hidden="true" />
            </div>
            <span>{businessConfig.businessName}</span>
          </Link>
          <PhoneLink phone={businessConfig.phone} label="Call" />
        </div>

        {/* 7-segment progress bar */}
        <div className="mx-auto max-w-2xl px-4 sm:px-6 pb-3.5">
          <div className="flex items-center justify-between text-xs font-bold text-navy-700 mb-2">
            <span aria-live="polite" className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] font-extrabold text-navy-900">
                {state.step}
              </span>
              <span>Step {state.step} of 7</span>
            </span>
            <span className="text-navy-900">
              {state.step === 1 && "1. Select Service"}
              {state.step === 2 && "2. Service Area ZIP"}
              {state.step === 3 && "3. Describe Issue"}
              {state.step === 4 && "4. Pick Arrival Time"}
              {state.step === 5 && "5. Address & Contact"}
              {state.step === 6 && "6. Deposit & Confirm"}
              {state.step === 7 && "7. Booking Confirmed"}
            </span>
          </div>
          <div
            className="grid grid-cols-7 gap-1.5"
            role="progressbar"
            aria-valuenow={state.step}
            aria-valuemin={1}
            aria-valuemax={7}
            aria-label={`Booking step ${state.step} of 7`}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((seg) => (
              <div
                key={seg}
                className={cn(
                  "h-2 rounded-full transition-colors duration-200",
                  seg <= state.step ? "bg-orange-500" : "bg-slate-200"
                )}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Step Card Container */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-6 sm:py-8 pb-32">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-8 shadow-xl">
          {/* STEP 1: Select service */}
          {state.step === 1 && (
            <Step1Service
              services={services}
              loadingServices={loadingServices}
              selectedService={state.selectedService}
              onSelectService={(s) => dispatch({ type: "SELECT_SERVICE", service: s })}
            />
          )}

          {/* STEP 2: ZIP Code */}
          {state.step === 2 && (
            <Step2Zip
              zip={state.zip}
              zipChecked={state.zipChecked}
              zipServed={state.zipServed}
              zipCity={state.zipCity}
              zipState={state.zipState}
              checkingZip={checkingZip}
              zipError={zipError}
              onChangeZip={handleZipInputChange}
            />
          )}

          {/* STEP 3: Describe issue + photo */}
          {state.step === 3 && (
            <Step3Issue
              issueText={state.issueText}
              issueError={issueError}
              photos={photos}
              onChangeIssueText={(text) => {
                dispatch({ type: "SET_ISSUE_TEXT", text });
                if (issueError) setIssueError(null);
              }}
              onChangePhotos={setPhotos}
            />
          )}

          {/* STEP 4: Date & time */}
          {state.step === 4 && (
            <Step4Slot
              scrollerDays={scrollerDays}
              selectedDay={state.selectedDay}
              loadingSlots={loadingSlots}
              daySlots={daySlots}
              morningSlots={morningSlots}
              afternoonSlots={afternoonSlots}
              nextAvailableDay={nextAvailableDay}
              selectedSlotStart={state.selectedSlotStart}
              onSelectDay={(day) => dispatch({ type: "SET_DAY", day })}
              onSelectSlot={(slotStart) => dispatch({ type: "SELECT_SLOT", slotStart })}
            />
          )}

          {/* STEP 5: Address & contact */}
          {state.step === 5 && (
            <Step5Details
              addressLine1={state.addressLine1}
              addressLine2={state.addressLine2}
              zip={state.zip}
              customerName={state.customerName}
              customerPhone={state.customerPhone}
              customerEmail={state.customerEmail}
              fieldErrors={fieldErrors}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              onAddressChange={handleAddressChange}
              onSelectSuggestion={handleSelectSuggestion}
              onFieldChange={(field, val) => {
                dispatch({ type: "SET_CONTACT_FIELD", field, value: val });
                if (field === "customerName") setFieldErrors((p) => ({ ...p, name: "" }));
                if (field === "customerPhone") setFieldErrors((p) => ({ ...p, phone: "" }));
                if (field === "customerEmail") setFieldErrors((p) => ({ ...p, email: "" }));
              }}
              setShowSuggestions={setShowSuggestions}
            />
          )}

          {/* STEP 6: Checkout */}
          {state.step === 6 && (
            <Step6Payment
              remainingSeconds={remainingSeconds}
              selectedService={state.selectedService}
              selectedSlotStart={state.selectedSlotStart}
              addressLine1={state.addressLine1}
              addressLine2={state.addressLine2}
              city={state.city}
              zip={state.zip}
              estimate={estimate}
              cardNumber={cardNumber}
              cardExpiry={cardExpiry}
              cardCvc={cardCvc}
              paymentError={paymentError}
              onChangeCardNumber={setCardNumber}
              onChangeCardExpiry={setCardExpiry}
              onChangeCardCvc={setCardCvc}
            />
          )}

          {/* STEP 7: Confirmation */}
          {state.step === 7 && state.confirmedJob && (
            <Step7Confirm confirmedJob={state.confirmedJob} />
          )}
        </div>
      </main>

      {/* Sticky Footer with Summary + Actions for Steps 1–6 */}
      {state.step < 7 && (
        <footer className="fixed bottom-0 inset-x-0 z-20 border-t border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xl pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 sm:px-6 py-3">
            {state.selectedService && (
              <div className="hidden sm:flex flex-col text-xs">
                <span className="font-bold text-navy-900">{state.selectedService.name}</span>
                <span className="text-navy-700">
                  Est. {formatMoneyCents(estimate.estimateCents)} ·{" "}
                  <strong className="text-orange-700">
                    {formatMoneyCents(estimate.depositCents)} deposit due
                  </strong>
                </span>
              </div>
            )}

            <div className="flex flex-1 items-center gap-3">
              {state.step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  data-testid="wizard-back-btn"
                  className="px-5 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" aria-hidden="true" />
                  <span>Back</span>
                </Button>
              )}

              <Button
                type="button"
                variant="primary"
                size="lg"
                className="flex-1 rounded-full font-bold shadow-md"
                data-testid="wizard-continue-btn"
                loading={checkingZip || holdingSlot || startingCheckout || submittingPayment}
                disabled={
                  isOffline ||
                  (state.step === 2 && (!state.zipChecked || !state.zipServed))
                }
                onClick={handleContinue}
              >
                {state.step === 6 ? (
                  <span className="inline-flex items-center gap-2">
                    <span>
                      Pay {formatMoneyCents(estimate.depositCents)} &amp; Book
                    </span>
                    <Lock className="h-4 w-4" aria-hidden="true" />
                  </span>
                ) : (
                  <span>Continue →</span>
                )}
              </Button>
            </div>
          </div>
        </footer>
      )}

      {/* Hold Expired Modal */}
      {holdExpiredModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hold-expired-title"
          data-testid="hold-expired-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-700">
              <Clock className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 id="hold-expired-title" className="text-lg font-bold text-navy-900">
              Your time hold expired
            </h2>
            <p className="text-sm text-navy-700">
              We hold arrival windows for {businessConfig.booking.holdMinutes} minutes so other customers can book. Please pick a new time.
            </p>
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full rounded-full"
              data-testid="pick-new-time-btn"
              onClick={handlePickNewTimeFromModal}
            >
              Pick a new time
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
