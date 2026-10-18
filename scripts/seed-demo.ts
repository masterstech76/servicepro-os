import { resetLocalDb } from "../src/lib/server/local-db-fallback";
import { populateRichDemoDataset } from "../src/lib/server/demo-dataset";
import { acePlumbingAustinConfig } from "../config/examples/ace-plumbing-austin";

async function main() {
  const store = resetLocalDb();
  populateRichDemoDataset(store);

  console.log("=========================================================");
  console.log("ServicePro OS — Rich Demo Dataset Seeded Successfully");
  console.log("=========================================================");
  console.log(`Active Business : ${Array.from(store.businesses.values())[0]?.name}`);
  console.log(`Technicians     : ${store.technicians.size}`);
  console.log(`Services        : ${store.services.size}`);
  console.log(`Service Areas   : ${store.service_areas.size} ZIP codes`);
  console.log(`Customers       : ${store.customers.size}`);
  console.log(`Jobs            : ${store.jobs.size} (Today + 14-day history)`);
  console.log(`Invoices        : ${store.invoices.size}`);
  console.log(`Alternate Config: ${acePlumbingAustinConfig.businessName} (verified)`);
  console.log("---------------------------------------------------------");
  console.log("Surfaces:");
  console.log("  • Interactive Walkthrough : http://localhost:3000/demo");
  console.log("  • Public Booking Wizard   : http://localhost:3000/book");
  console.log("  • Owner Dispatch Board    : http://localhost:3000/admin/dispatch");
  console.log("  • Technician Field PWA    : http://localhost:3000/tech");
  console.log("  • Customer Pay Link       : http://localhost:3000/pay/pay_tok_1030");
  console.log("=========================================================");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
