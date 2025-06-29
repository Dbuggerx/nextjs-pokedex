import { test, expect } from '@playwright/test';

test.describe('Pokedex', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test with networkidle to ensure page is fully loaded
    await page.goto('/');
    
    // Wait for the main content to be visible
    await expect(page.getByText('Discover and explore the world of Pokémon!')).toBeVisible({ timeout: 10000 });
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

  test('should filter Pokémon by search query', async ({ page }) => {
    // Type in the search input
    const searchInput = page.getByPlaceholder('Search Pokémon...');
    await searchInput.fill('pikachu');
    
    // Wait for the search results to update
    await page.waitForTimeout(1000);
    
    // Check if the search results message is displayed
    await expect(page.getByText('Showing search results for "pikachu"')).toBeVisible();
    
    // Verify that the displayed Pokémon matches the search query
    const pokemonNames = page.getByRole('heading', { level: 3 }); // Pokémon names are in h3 elements
    const count = await pokemonNames.count();
    
    for (let i = 0; i < count; i++) {
      const name = await pokemonNames.nth(i).textContent();
      expect(name?.toLowerCase()).toContain('pikachu');
    }
  });
});
