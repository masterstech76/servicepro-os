export default function PayTokenPlaceholderPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <main className="mx-auto max-w-lg px-4 py-12 text-center space-y-3">
      <h1 className="text-2xl font-bold text-navy-900">Invoice Payment</h1>
      <p className="text-sm text-navy-700">
        Invoice reference: <span className="font-mono">{params.token}</span>
      </p>
      <p className="text-xs text-slate-500">
        Remaining balance payment links arrive in Phase 4.
      </p>
    </main>
  );
}
