"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Smartphone, ArrowRight, ShieldCheck, CheckCircle2, RotateCw, Phone } from "lucide-react";
import { toast } from "sonner";
import { businessConfig } from "@config/business.config";
import { Button } from "@/components/ui/button";

function VerifyPhoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneParam = searchParams.get("phone") || "(305) 555-0144";

  const [otp, setOtp] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = React.useState(45);
  const [verifying, setVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split("");
    const newOtp = ["", "", "", "", "", ""];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtp(newOtp);
    const nextFocus = Math.min(digits.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(45);
    setOtp(["", "", "", "", "", ""]);
    toast.success(`New 6-digit code sent to ${phoneParam}`);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/auth/demo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "customer" }),
      });

      if (!res.ok) {
        toast.error("Verification failed. Please check the code and try again.");
        return;
      }

      setVerified(true);
      toast.success("Mobile number verified successfully!");
      setTimeout(() => {
        router.push("/account");
      }, 1000);
    } catch {
      toast.error("Network error during verification. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-9 shadow-xl space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-navy-950 text-orange-400 mb-3 sm:mb-4 shadow-md ring-4 ring-orange-500/10">
          <Smartphone className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-navy-950 tracking-tight">
          Verify Mobile Number
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
          Enter the 6-digit security code sent via SMS to{" "}
          <strong className="text-navy-950 font-bold">{phoneParam}</strong>
        </p>
      </div>

      {verified ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-2">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
          <h3 className="font-heading font-black text-base text-emerald-950">
            Phone Number Verified!
          </h3>
          <p className="text-xs text-emerald-700">
            Redirecting to your customer portal...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Uber-Style 6-Digit Code Boxes */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={`h-11 w-9 sm:h-14 sm:w-12 rounded-xl sm:rounded-2xl border text-center font-mono text-lg sm:text-2xl font-black transition-all ${
                  digit
                    ? "border-navy-950 bg-slate-50 text-navy-950 ring-2 ring-navy-950/20"
                    : "border-slate-300 bg-white text-navy-950 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                } focus:outline-none`}
              />
            ))}
          </div>

          {/* Resend & Quick Test Helper */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              type="button"
              disabled={timer > 0}
              onClick={handleResend}
              className={`flex items-center gap-1 font-bold ${
                timer > 0
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-orange-600 hover:text-orange-700 hover:underline"
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>{timer > 0 ? `Resend code in ${timer}s` : "Resend 6-Digit Code"}</span>
            </button>

            {process.env.NODE_ENV !== "production" ? (
              <button
                type="button"
                onClick={() => setOtp(["1", "2", "3", "4", "5", "6"])}
                className="text-slate-400 hover:text-slate-600 text-[11px] underline"
              >
                Use demo code (123456)
              </button>
            ) : null}
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            disabled={otp.some((d) => !d) || verifying}
            className="w-full bg-orange-500 hover:bg-orange-600 text-navy-950 font-black h-12 text-sm rounded-xl shadow-md transition-all"
          >
            {verifying ? (
              "Verifying Code..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Verify &amp; Continue</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
        <Link href="/login" className="hover:text-navy-950 font-semibold transition-colors">
          ← Back to Sign In
        </Link>
        <Link href="/contact" className="hover:text-orange-600 font-semibold transition-colors">
          Need Help?
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPhonePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <React.Suspense
        fallback={
          <div className="w-full max-w-md h-96 rounded-3xl bg-white animate-pulse" />
        }
      >
        <VerifyPhoneContent />
      </React.Suspense>
    </div>
  );
}
