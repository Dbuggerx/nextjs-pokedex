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
});
