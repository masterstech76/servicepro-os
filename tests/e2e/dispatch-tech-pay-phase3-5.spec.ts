import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoCriticalOrSeriousAxeViolations(
  page: import("@playwright/test").Page
) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const criticalOrSerious = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious"
  );
  expect(criticalOrSerious).toEqual([]);
}

test.describe("Phases 3, 4 & 5 — Dispatch Board, Tech PWA, Customer Pay Link, Reports & Demo Hub", () => {
  test("1. Auth guard redirects unauthenticated /admin to /login, then Owner Dispatch Board & JobDrawer work end-to-end", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // Unauthenticated access redirects to /login
    await page.goto("/admin/dispatch");
    await expect(page).toHaveURL(/\/login/);
    await expectNoCriticalOrSeriousAxeViolations(page);

    // Sign in as Owner via 1-click Demo Access
    await page.getByTestId("demo-login-owner").click();
    await expect(page).toHaveURL(/\/admin/);
    await expect(
      page.getByRole("heading", { name: "Operations Overview" })
    ).toBeVisible();

    // Navigate to Dispatch Board
    await page.goto("/admin/dispatch");
    await expect(page.getByTestId("dispatch-kanban-board")).toBeVisible();
    await expect(page.getByTestId("technician-rail")).toBeVisible();
    await expectNoCriticalOrSeriousAxeViolations(page);

    // Switch to Map and Calendar views and back to Kanban
    await page.getByTestId("view-mode-map").click();
    await expect(page.getByTestId("dispatch-map-view")).toBeVisible();
    await page.getByTestId("view-mode-calendar").click();
    await expect(page.getByTestId("dispatch-calendar-view")).toBeVisible();
    await page.getByTestId("view-mode-kanban").click();

    // Click an unassigned job card to open the 4-tab JobDrawer and inspect smart suggestions
    const firstUnassignedCard = page
      .getByTestId("kanban-col-unassigned")
      .locator('[data-testid^="dispatch-job-card-"]')
      .first();
    await firstUnassignedCard.click();

    await expect(page.getByTestId("job-drawer")).toBeVisible();
    await expect(page.getByTestId("drawer-tab-details")).toBeVisible();
    await expect(page.getByTestId("drawer-tab-photos")).toBeVisible();
    await expect(page.getByTestId("drawer-tab-invoice")).toBeVisible();
    await expect(page.getByTestId("drawer-tab-history")).toBeVisible();

    await page.getByTestId("close-job-drawer").click();
  });

  test("2. Technician Mobile PWA walks assigned -> on_the_way -> in_progress -> 3-step Parts + Tip + Card on File completion", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/login");
    await page.getByTestId("demo-login-tech").click();
    await expect(page).toHaveURL(/\/tech/);
    await expectNoCriticalOrSeriousAxeViolations(page);

    // Verify Next Up card is visible for Carlos Mendez
    await expect(page.getByTestId("tech-next-job-card")).toBeVisible();

    // Click Start Route & Text ETA
    await page.getByTestId("tech-start-next-job-btn").click();
    await expect(page).toHaveURL(/\/tech\/jobs\//);

    // Capture a before photo
    await page.getByTestId("capture-before-photo-btn").click();

    // Advance from on_the_way -> in_progress
    await page.getByTestId("tech-action-start-job").click();

    // Open 3-Step Completion & Payment Modal
    await page.getByTestId("tech-action-open-checkout").click();
    await expect(page.getByTestId("tech-checkout-modal")).toBeVisible();

    // Step 1: Add a $120.00 replacement part (taxable at 7% = $8.40)
    await page.getByTestId("tech-part-name-input").fill("Dual Run Capacitor");
    await page.getByTestId("tech-part-price-input").fill("120");
    await page.getByTestId("tech-add-part-btn").click();
    await expect(page.getByTestId("tech-live-tax")).toHaveText("$8.40");

    // Proceed to Step 2 (Customer Tip)
    await page.getByTestId("tech-checkout-next-step2").click();
    await page.getByTestId("tip-preset-20").click();

    // Proceed to Step 3 (Collect Payment) & Charge Saved Card
    await page.getByTestId("tech-checkout-next-step3").click();
    await page.getByTestId("tech-pay-card-on-file").click();

    // Verify Job Completed Banner appears
    await expect(page.getByTestId("tech-job-completed-banner")).toBeVisible();
  });

  test("3. Customer Payment Link (/pay/[token]) & Revenue Reports & Interactive /demo Hub", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Open an unpaid customer invoice link (/pay/pay_tok_1035)
    await page.goto("/pay/pay_tok_1035");
    await expect(page.getByTestId("pay-link-amount-due")).toBeVisible({
      timeout: 15000,
    });
    await expectNoCriticalOrSeriousAxeViolations(page);

    // Select 20% tip and pay invoice
    await page.getByTestId("tip-preset-20").click();
    await page.getByTestId("pay-link-submit-btn").click();
    await expect(page.getByTestId("invoice-paid-receipt")).toBeVisible({
      timeout: 15000,
    });

    // Visit /demo interactive walkthrough hub
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/demo");
    await expect(
      page.getByRole("heading", {
        name: "Explore All 4 Live Surfaces with One Click",
      })
    ).toBeVisible();
    await expectNoCriticalOrSeriousAxeViolations(page);

    // Launch Owner Dispatch from /demo and check Revenue Reports
    await page.getByTestId("demo-launch-admin").click();
    await expect(page).toHaveURL(/\/admin\/dispatch/);

    await page.goto("/admin/reports");
    await expect(page.getByTestId("report-gross-revenue")).toBeVisible();
    await page.getByTestId("report-tab-service").click();
    await page.getByTestId("report-tab-day").click();
  });
});
