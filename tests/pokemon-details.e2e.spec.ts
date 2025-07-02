import { test, expect } from "@playwright/test";

test.describe("Pokemon Details Page", () => {
  test.beforeEach(async ({ page }) => {
    // Start from the Bulbasaur details page (ID: 1)
    await page.goto("/pokemon/1");
    await expect(page).toHaveURL(/\/pokemon\/1$/);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should display pokemon details correctly", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 3 }).first();
    await expect(heading).toHaveText("bulbasaur");
    await expect(page.getByText(/^#\d+$/)).toBeVisible();

    const image = page.getByRole("img").first();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute(
      "src",
      "/_next/image?url=https%3A%2F%2Fraw.githubusercontent.com%2FPokeAPI%2Fsprites%2Fmaster%2Fsprites%2Fpokemon%2Fother%2Fofficial-artwork%2F1.png&w=3840&q=75"
    );

    await expect(page.getByRole("heading", { name: "Types" })).toBeVisible();
    const typeItems = page.getByRole("listitem");
    await expect(typeItems).toHaveCount(2);
    await expect(typeItems.first()).toContainText("grass");
    await expect(typeItems.last()).toContainText("poison");

    await expect(page.getByText("Height")).toBeVisible();
    await expect(page.getByText("Weight")).toBeVisible();

    await expect(
      page
        .getByRole("heading", { name: "Description" })
        .locator("..")
        .getByRole("paragraph")
    ).toBeVisible();
  });

  test("should display stats tab content by default", async ({ page }) => {
    const aboutTab = page.getByRole("tab", { name: "Stats" });
    await expect(aboutTab).toHaveAttribute("aria-selected", "true");
  });

  test("should switch between tabs", async ({ page }) => {
    // Click on Stats tab
    const statsTab = page.getByRole("tab", { name: "Stats" });
    await statsTab.click();
    await expect(statsTab).toHaveAttribute("aria-selected", "true");

    // Verify stats are visible in the active tab panel
    const tabPanel = page.getByRole("tabpanel");
    await expect(tabPanel).toBeVisible();

    const statsList = page.getByRole("tab", { name: /stats/i });
    await expect(statsList).toBeVisible();

    const abilitiesTab = page.getByRole("tab", { name: "Abilities" });
    await abilitiesTab.click();
    await expect(abilitiesTab).toHaveAttribute("aria-selected", "true");
  });

  test("should navigate between pokemon using navigation buttons", async ({
    page,
  }) => {
    // Navigate to next Pokemon (Ivysaur)
    await page.getByRole("button", { name: "Next Pokemon" }).click();
    await page.waitForURL(/\/pokemon\/2$/);
    await expect(page.getByRole("heading", { level: 3 }).first()).toContainText(
      "ivysaur"
    );

    // Navigate back to previous Pokemon (Bulbasaur)
    await page.getByRole("button", { name: "Previous Pokemon" }).click();
    await page.waitForURL(/\/pokemon\/1$/);
    await expect(page.getByRole("heading", { level: 3 }).first()).toContainText(
      "bulbasaur"
    );
  });

  test("should disable previous button on first pokemon", async ({ page }) => {
    // On Bulbasaur (first pokemon), previous button should be disabled
    const prevButton = page.getByRole("button", { name: "Previous Pokemon" });
    await expect(prevButton).toBeDisabled();

    // Next button should be enabled
    const nextButton = page.getByRole("button", { name: "Next Pokemon" });
    await expect(nextButton).toBeEnabled();

    // Navigate to next pokemon and verify both buttons are enabled
    await nextButton.click();
    await expect(prevButton).toBeEnabled();
    await expect(nextButton).toBeEnabled();
  });

  test("should handle invalid pokemon ID", async ({ page }) => {
    // Navigate to non-existent pokemon
    await page.goto("/pokemon/9999");

    await expect(
      page.getByText("Failed to load Pokémon details")
    ).toBeVisible();
  });

  test("should navigate back to pokedex when back button is clicked", async ({ page }) => {
    // Start from the Bulbasaur details page (ID: 1)
    await page.goto("/pokemon/1");
    
    // Click the back button
    await page.getByRole("button", { name: /back to pokédex/i }).click();
    
    // Verify we're back on the main page
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByText("Discover and explore the world of Pokémon!")).toBeVisible();
  });
});
