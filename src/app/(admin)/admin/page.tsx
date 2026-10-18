import { businessConfig } from "@config/business.config";

export default function AdminDashboardPlaceholder() {
  return (
    <main className="p-8 space-y-2">
      <h1 className="text-2xl font-bold text-navy-900">
        {businessConfig.businessName} — Owner Admin
      </h1>
      <p className="text-sm text-navy-700">
        Admin Dispatch &amp; Dashboard (Phase 3 deliverable).
      </p>
    </main>
  );
}
