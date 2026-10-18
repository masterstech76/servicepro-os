import * as React from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhoneLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  phone: string;
  label?: string;
}

export function PhoneLink({ phone, label, className, ...props }: PhoneLinkProps) {
  const digits = phone.replace(/\D/g, "");
  const href = `tel:${digits.length === 10 ? `+1${digits}` : `+${digits}`}`;

  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-input px-3 py-2 text-sm font-semibold text-navy-900 hover:bg-slate-100 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 min-h-[44px]",
        className
      )}
      {...props}
    >
      <Phone className="h-4 w-4 text-orange-700" aria-hidden="true" />
      <span>{label ?? phone}</span>
    </a>
  );
}
