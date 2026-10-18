import * as React from "react";

export default function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-navy-900">
      {children}
    </div>
  );
}
