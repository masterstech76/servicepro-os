import * as React from "react";
import { BookingWizard } from "@/components/booking/BookingWizard";

export default function BookPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-navy-900 text-sm font-medium">
          Loading booking wizard…
        </div>
      }
    >
      <BookingWizard />
    </React.Suspense>
  );
}
