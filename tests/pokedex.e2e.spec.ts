import { test, expect } from "@playwright/test";
import { assertPokemonCard, testSearchFunctionality } from "./test-utils";

test.describe("Pokedex", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Discover and explore the world of Pokémon!")
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display Pokémon cards with all expected elements", async ({ page }) => {
    const pokemonCards = page.getByRole("article").first();
    await expect(pokemonCards.getByRole("article")).toHaveCount(24);

    for (let i = 0; i < (await pokemonCards.getByRole("article").count()); i++) {
      const card = pokemonCards.getByRole("article").nth(i);
      await assertPokemonCard(card);
    }
  });

  test.describe("Pokemon Search", () => {
    test("should filter Pokémon by search", async ({ page }) => {
      await testSearchFunctionality(page, "pikachu", "pikachu");
    });

    test("should not find any Pokémon that don't match the search", async ({ page }) => {
      await testSearchFunctionality(page, "aaa", null);
    });
  });

  test.describe("Infinite Scroll", () => {
    test("should load more Pokémon when scrolling to the bottom", async ({
      page,
    }) => {
      // Use consistent selector for Pokemon cards
      const pokemonCardSelector = page
        .getByRole("link")
        .filter({ has: page.getByRole("heading", { level: 3 }) });
    
      // Initial load should show the first page of Pokémon
      await expect(pokemonCardSelector.first()).toBeVisible();
    
      // Get the initial count of loaded Pokémon
      const initialCount = await pokemonCardSelector.count();
      expect(initialCount).toBeGreaterThan(0);
    
      // Scroll to the bottom of the page to trigger loading more Pokémon
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    
      // Wait for more Pokemon cards to be loaded instead of skeleton elements
      await expect(pokemonCardSelector).toHaveCount(initialCount * 2, {
        timeout: 15000,
      });
    
      // Verify all loaded cards have the expected content
      const count = await pokemonCardSelector.count();
      for (let i = 0; i < count; i++) {
        const card = pokemonCardSelector.nth(i);
        await assertPokemonCard(card);
      }
    });
  
    test("should maintain scroll position when navigating back to the page", async ({
      page,
    }) => {
      // Load initial page and scroll to trigger loading more Pokémon
      const pokemonCardSelector = page
        .getByRole("link")
        .filter({ has: page.getByRole("heading", { level: 3 }) });
      await expect(pokemonCardSelector.first()).toBeVisible();
    
      // Get initial count
      const initialCount = await pokemonCardSelector.count();
    
      // Scroll to the bottom to load more Pokémon
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
    
      // Wait for more Pokemon to be loaded
      await expect(pokemonCardSelector).toHaveCount(initialCount * 2, {
        timeout: 15000,
      });
    
      // Store the scroll position before navigation
      const originalScrollY = await page.evaluate(() => window.scrollY);
    
      // Click the first card that is visible in the viewport
      await pokemonCardSelector.evaluateAll((cards) => {
        const viewportHeight = window.innerHeight;
    
        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          // Check if card is at least partially visible in viewport
          if (rect.top < viewportHeight && rect.bottom > 0) {
            (card as HTMLElement).click();
            break;
          }
        }
      });
    
      // Wait for the details page to load
      await expect(
        page.getByRole("button", { name: /back to pokédex/i })
      ).toBeVisible();
  
      // Use the back button instead of browser navigation
      await page.getByRole("button", { name: /back to pokédex/i }).click();
  
      // Wait for the page to fully load and restore
      await expect(pokemonCardSelector.first()).toBeVisible();
  
      // Verify the scroll position is maintained (allow some tolerance)
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(originalScrollY * 0.8); // Allow 20% tolerance
  
      // Verify the previously loaded Pokémon are still visible
      const count = await pokemonCardSelector.count();
      expect(count).toBeGreaterThan(24); // Expect more than initial load
    });
  });  
});
