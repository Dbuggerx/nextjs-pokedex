import { test as base, expect, type Route } from "@playwright/test";
import {
  handlePokemonList,
  handlePokemonDetail,
} from "./__mocks__/api/handlers";
import { assertPokemonCard, testSearchFunctionality, testSelectors } from "./test-utils";

// Create a test with API mocks
const test = base.extend<{ mockRequests: void }>({
  mockRequests: [
    async ({ page }, use) => {
      // Catch all unhandled requests to PokeAPI
      await page.route(/pokeapi.co\/api/, async (route) => {
        const url = route.request().url();
        console.error(`❌ Unhandled PokeAPI request: ${url}`);
        await route.abort("failed");
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
    await page.goto("/");
  });

  test('should display the main heading and search input', async ({ page }) => {
    const heading = page.getByText('Discover and explore the world of Pokémon!');
    await expect(heading).toBeVisible();
    
    const searchInput = page.getByPlaceholder(testSelectors.searchInput);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEmpty();
  });

  test('should display Pokémon cards with all expected elements', async ({ page }) => {
    const pokemonCards = page.getByRole('article').first();
    await expect(pokemonCards.getByRole('article')).toHaveCount(24);
    
    for (let i = 0; i < await pokemonCards.getByRole('article').count(); i++) {
      const card = pokemonCards.getByRole('article').nth(i);
      await assertPokemonCard(card);
    }
  });

  test.describe("Pokemon Search", () => {
    test("should filter Pokémon by search", async ({ page }) => {
      await testSearchFunctionality(page, "pokemon-7", "pokemon-7");
    });

    test("should not find any Pokémon that don't match the search", async ({ page }) => {
      await testSearchFunctionality(page, "aaa", null);
    });
  });
});
