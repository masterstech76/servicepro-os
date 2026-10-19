"use client";

import * as React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Booking page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
        </div>

        <h1 className="font-heading text-xl sm:text-2xl font-bold text-navy-900 mb-2">
          Unable to Load Booking
        </h1>

        <p className="text-sm text-navy-700 mb-6 leading-relaxed">
          {error.message || "An unexpected error occurred while loading the booking wizard. Please try again."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="rounded-full bg-orange-500 hover:bg-orange-600 text-navy-900 font-bold shadow-md"
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Try Again</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-slate-300 text-navy-900 font-semibold"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
