import { businessConfig } from "@config/business.config";

export default function TechTodayPlaceholder() {
  return (
    <main className="mx-auto max-w-md p-6 space-y-2">
      <h1 className="text-2xl font-bold text-navy-900">
        {businessConfig.businessName} — Technician App
      </h1>
      <p className="text-sm text-navy-700">
        My Jobs Today (Phase 3 deliverable).
      </p>
    </main>
  );
}
