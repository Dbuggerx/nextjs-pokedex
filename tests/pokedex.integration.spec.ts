import { test as base, expect, type Route } from "@playwright/test";
import {
  handlePokemonList,
  handlePokemonDetail,
} from "./__mocks__/api/handlers";

// Create a test with API mocks
const test = base.extend<{ mockRequests: void }>({
  mockRequests: [
    async ({ page }, use) => {
      // Catch all unhandled requests to PokeAPI
      await page.route(/pokeapi.co\/api/, (route) => {
        const url = route.request().url();
        console.error(`❌ Unhandled PokeAPI request: ${url}`);
        route.abort("failed");
      });

      // Mock Pokémon list endpoint
      await page.route(
        /pokeapi.co\/api\/v2\/pokemon\//,
        async (route: Route) => {
          try {
            const url = new URL(route.request().url());
            const response = handlePokemonList(url);
            await route.fulfill(response);
          } catch (error) {
            console.error("Error handling Pokémon list request:", error);
            await route.fulfill({ status: 500 });
          }
        }
      );

      // Mock Pokémon detail endpoint
      await page.route(
        /pokeapi.co\/api\/v2\/pokemon\/.+\/$/,
        async (route: Route) => {
          try {
            const url = new URL(route.request().url());
            const response = handlePokemonDetail(url);
            await route.fulfill(response);
          } catch (error) {
            console.error("Error handling Pokémon detail request:", error);
            await route.fulfill({ status: 500 });
          }
        }
      );

      await use();
    },
    { auto: true },
  ],
});

test.describe("Pokedex with Mocks", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");
  });

  test('should display the main heading and search input', async ({ page }) => {
    // Check if the main heading is visible
    const heading = page.getByText('Discover and explore the world of Pokémon!');
    await expect(heading).toBeVisible();
    
    // Check if the search input is visible and has the correct placeholder
    const searchInput = page.getByPlaceholder('Search Pokémon...');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEmpty();
  });

  test('should display Pokémon cards with all expected elements', async ({ page }) => {
    // Wait for Pokémon cards to load using the article role (each card is an article)
    const pokemonCards = page.getByRole('article').first();
    await expect(pokemonCards.getByRole('article')).toHaveCount(24);
    
    
    // For each card, verify it has all the expected elements
    for (let i = 0; i < await pokemonCards.getByRole('article').count(); i++) {
      const card = pokemonCards.getByRole('article').nth(i);
      
      // Card should be visible
      await expect(card).toBeVisible();
      
      // Should have a name (h3)
      const name = card.getByRole('heading', { level: 3 });
      await expect(name).toBeVisible();
      const nameText = await name.textContent();
      expect(nameText).toBeTruthy();
      
      // Should have an image
      const image = card.getByRole('img');
      await expect(image).toBeVisible();
      const imageSrc = await image.getAttribute('src');
      expect(imageSrc).toContain('raw.githubusercontent.com');
      
      // Should have a Pokémon ID
      const idElement = card.getByText(/^#\d+$/);
      await expect(idElement).toBeVisible();
      const idText = await idElement.textContent();
      expect(idText).toMatch(/^#\d+$/);
      
      // Should have at least one type badge
      const typeBadges = card.getByRole('listitem');
      const typeBadgeCount = await typeBadges.count();
      expect(typeBadgeCount).toBeGreaterThanOrEqual(1);
      
      // Verify each type badge has text
      for (let j = 0; j < typeBadgeCount; j++) {
        const badge = typeBadges.nth(j);
        await expect(badge).toBeVisible();
        const badgeText = await badge.textContent();
        expect(badgeText).toBeTruthy();
      }
    }
  });

  test.describe("Pokemon Search", () => {
    test("should filter Pokémon by search", async ({ page }) => {
      
      // Type in the search input
      const searchInput = page.getByPlaceholder("Search Pokémon...");
      await searchInput.fill("pokemon-7");

      // Check if the search results message is displayed
      await expect(
        page.getByText('Showing search results for "pokemon-7"')
      ).toBeVisible();

      // Verify that there's exactly one matching Pokémon and check its name
      const pokemonNames = page.getByRole("heading", { level: 3 });
      
      // Check there's exactly one result
      await expect(pokemonNames).toHaveCount(1);
      
      // Verify the name matches the search query (all lowercase as per mock data)
      await expect(pokemonNames.first()).toHaveText("pokemon-7");
    });

    test("should not find any Pokémon that don't match the search", async ({ page }) => {
      
      // Type in the search input
      const searchInput = page.getByPlaceholder("Search Pokémon...");
      await searchInput.fill("aaa");

      // Check if the no search results message is displayed
      await expect(page.getByText("No Pokémon found matching \"aaa\""))
        .toBeVisible();

      // Verify that there's exactly one matching Pokémon and check its name
      const pokemonNames = page.getByRole("heading", { level: 3 });
      
      // Check there's exactly one result
      await expect(pokemonNames).toHaveCount(0);
    });
  });
});
