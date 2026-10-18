import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectZeroCriticalAxeIssues(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const criticalOrSerious = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious"
  );
  expect(criticalOrSerious).toEqual([]);
}

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(overflow).toBe(false);
}

test.describe("Phase 1 — Mobile Booking Wizard (390x844, Mock Mode)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
  });

  test("Landing page (/) and full 7-step booking wizard with axe checks, unserved ZIP, fully-booked day, SLOT_TAKEN, and deposit math", async ({
    page,
  }) => {
    // 1. Landing page check
    await page.goto("/?apiMode=mock");
    await expect(page.getByTestId("hero-book-cta")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectZeroCriticalAxeIssues(page);

    // Verify orange CTA button uses navy text (#0F172A -> rgb(15, 23, 42))
    const ctaColor = await page
      .getByTestId("hero-book-cta")
      .evaluate((el) => getComputedStyle(el).color);
    expect(ctaColor).toBe("rgb(15, 23, 42)");

    // Navigate to /book
    await page.goto("/book?apiMode=mock");
    await expect(page.getByRole("heading", { name: "What do you need help with?" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectZeroCriticalAxeIssues(page);

    // Step 1: Select AC Repair ($99 flat)
    await page.getByTestId("service-card-svc-ac-repair").click();
    await page.getByTestId("wizard-continue-btn").click();

    // Step 2: Test unserved ZIP 90210 blocks with error
    await expect(page.getByRole("heading", { name: "Where is the job?" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectZeroCriticalAxeIssues(page);

    await page.getByTestId("zip-input").fill("90210");
    await expect(page.getByTestId("zip-error-msg")).toContainText("Sorry, we don't serve 90210 yet.");
    await expect(page.getByTestId("wizard-continue-btn")).toBeDisabled();

    // Enter valid Miami ZIP 33133
    await page.getByTestId("zip-input").fill("33133");
    await expect(page.getByTestId("zip-served-msg")).toContainText("Great — we serve Miami, FL");
    await page.getByTestId("wizard-continue-btn").click();

    // Step 3: Issue description
    await expect(page.getByRole("heading", { name: "Tell us what's going on" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectZeroCriticalAxeIssues(page);

    await page.getByTestId("issue-textarea").fill("AC is blowing warm air since last night.");
    await page.getByTestId("wizard-continue-btn").click();

    // Step 4: Date & Time — verify morning/afternoon groups, "Only 1 left", fully booked day, and SLOT_TAKEN
    await expect(page.getByRole("heading", { name: "Pick a time" })).toBeVisible();
    await expect(page.getByText("Morning")).toBeVisible();
    await expect(page.getByText("Afternoon")).toBeVisible();
    await expect(page.getByText("Only 1 left").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectZeroCriticalAxeIssues(page);

    // Click fully-booked day tab (day-tab-2 or day-tab-3) and verify next available day link
    await page.getByTestId("day-tab-2").click();
    const isDay2Booked = await page.getByTestId("fully-booked-state").isVisible();
    if (!isDay2Booked) {
      await page.getByTestId("day-tab-3").click();
    }
    await expect(page.getByTestId("fully-booked-state")).toBeVisible();
    await page.getByTestId("next-available-day-link").click();
    await expect(page.getByText("Morning")).toBeVisible();

    // Simulate SLOT_TAKEN on 11:00 AM slot (slot-chip-11)
    await page.getByTestId("slot-chip-11").click();
    await page.getByTestId("wizard-continue-btn").click();
    await expect(page.getByText("That time was just taken")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pick a time" })).toBeVisible();

    // Pick valid 2:00 PM slot (slot-chip-14)
    await page.getByTestId("slot-chip-14").click();
    await page.getByTestId("wizard-continue-btn").click();

    // Step 5: Address & contact
    await expect(page.getByRole("heading", { name: "Service address & contact" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectZeroCriticalAxeIssues(page);

    await page.getByTestId("address-line1").fill("123 Brickell Ave");
    await page.getByTestId("customer-name").fill("Maria Rivera");
    await page.getByTestId("customer-phone").fill("(305) 555-0142");
    await page.getByTestId("customer-email").fill("maria@example.com");
    await page.getByTestId("wizard-continue-btn").click();

    // Step 6: Checkout & Deposit math ($99 -> $19.80 deposit, $79.20 remaining)
    await expect(page.getByRole("heading", { name: "Your booking" })).toBeVisible();
    await expect(page.getByTestId("checkout-estimate")).toHaveText("$99.00");
    await expect(page.getByTestId("checkout-deposit")).toHaveText("$19.80");
    await expect(page.getByTestId("checkout-remaining")).toHaveText("$79.20");
    await expect(page.getByTestId("hold-countdown")).toContainText("Hold expires in");
    await expectNoHorizontalOverflow(page);
    await expectZeroCriticalAxeIssues(page);

    // Pay & Book
    await page.getByTestId("wizard-continue-btn").click();

    // Step 7: Confirmation
    await expect(page.getByTestId("booking-confirmed-step")).toBeVisible();
    await expect(page.getByTestId("confirmed-job-number")).toContainText("Job #");
    await expectNoHorizontalOverflow(page);
    await expectZeroCriticalAxeIssues(page);
  });

  test("Hold countdown expiry opens the 'Pick a new time' modal", async ({ page }) => {
    await page.goto("/book?apiMode=mock&expireHoldIn=2");

    // Step 1
    await page.getByTestId("service-card-svc-ac-repair").click();
    await page.getByTestId("wizard-continue-btn").click();

    // Step 2
    await page.getByTestId("zip-input").fill("33133");
    await expect(page.getByTestId("zip-served-msg")).toBeVisible();
    await page.getByTestId("wizard-continue-btn").click();

    // Step 3
    await page.getByTestId("issue-textarea").fill("AC unit needs inspection.");
    await page.getByTestId("wizard-continue-btn").click();

    // Step 4 -> Hold slot with 2 second expiry override
    await page.getByTestId("slot-chip-14").click();
    await page.getByTestId("wizard-continue-btn").click();

    // Wait for modal to appear
    await expect(page.getByTestId("hold-expired-modal")).toBeVisible({ timeout: 5000 });
    await page.getByTestId("pick-new-time-btn").click();
    await expect(page.getByRole("heading", { name: "Pick a time" })).toBeVisible();
  });
});
