import { test, expect } from "@playwright/test";

test.describe("Phase 2 — Real API Booking Flow with Photo Move & Payment Simulation", () => {
  test("Completes booking in API_MODE=real against /api/* routes, uploads photo, simulates payment, and displays Job #", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/book?apiMode=real");
    await expect(page.getByRole("heading", { name: "What do you need help with?" })).toBeVisible();

    // Step 1: Select AC Repair
    await page.getByTestId("service-card-svc-ac-repair").click();
    await page.getByTestId("wizard-continue-btn").click();

    // Step 2: Enter served ZIP 33133 (verified via /api/service-area)
    await page.getByTestId("zip-input").fill("33133");
    await expect(page.getByTestId("zip-served-msg")).toContainText("Great — we serve Miami, FL");
    await page.getByTestId("wizard-continue-btn").click();

    // Step 3: Enter issue description and attach a 1x1 PNG photo
    await page.getByTestId("issue-textarea").fill("AC compressor is humming and warm air is coming out.");
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "ac-unit.png",
      mimeType: "image/png",
      buffer: Buffer.from(pngBase64, "base64"),
    });
    await expect(page.getByAltText("Issue photo 1 of 1")).toBeVisible();
    await page.getByTestId("wizard-continue-btn").click();

    // Step 4: Pick an available slot from /api/slots
    await expect(page.getByRole("heading", { name: "Pick a time" })).toBeVisible();
    const firstSlotChip = page.locator('[data-testid^="slot-chip-"]').first();
    await expect(firstSlotChip).toBeVisible();
    await firstSlotChip.click();
    await page.getByTestId("wizard-continue-btn").click();

    // Step 5: Fill address & contact -> calls /api/jobs/checkout
    await expect(page.getByRole("heading", { name: "Service address & contact" })).toBeVisible();
    await page.getByTestId("address-line1").fill("123 Brickell Ave");
    await page.getByTestId("customer-name").fill("Maria Rivera");
    await page.getByTestId("customer-phone").fill("(305) 555-0142");
    await page.getByTestId("customer-email").fill("maria@example.com");
    await page.getByTestId("wizard-continue-btn").click();

    // Step 6: Verify deposit & pay -> calls /api/dev/simulate-payment and polls /api/jobs/by-intent
    await expect(page.getByRole("heading", { name: "Your booking" })).toBeVisible();
    await expect(page.getByTestId("checkout-deposit")).toHaveText("$19.80");
    await page.getByTestId("wizard-continue-btn").click();

    // Step 7: Confirmation displays Job #
    await expect(page.getByTestId("booking-confirmed-step")).toBeVisible();
    await expect(page.getByTestId("confirmed-job-number")).toContainText(/Job #\d+/);
  });
});
