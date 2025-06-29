import { expect, type Page, type Locator } from '@playwright/test';

export const testSelectors = {
  searchInput: 'Search Pokémon...',
  searchResultsText: (query: string) => `Showing search results for "${query}"`,
  noResultsText: (query: string) => `No Pokémon found matching "${query}"`,
};

export const assertPokemonCard = async (card: Locator) => {
  await expect(card).toBeVisible();
  
  const name = card.getByRole('heading', { level: 3 });
  await expect(name).toBeVisible();
  await expect(name).not.toBeEmpty();
  
  const image = card.getByRole('img');
  await expect(image).toBeVisible();
  const imageSrc = await image.getAttribute('src');
  expect(imageSrc).toContain('raw.githubusercontent.com');
  
  // Verify image is properly loaded
  await expect(image).toHaveJSProperty('complete', true);
  const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
  const naturalHeight = await image.evaluate((img: HTMLImageElement) => img.naturalHeight);
  expect(naturalWidth).toBeGreaterThan(0);
  expect(naturalHeight).toBeGreaterThan(0);
  
  const idElement = card.getByText(/^#\d+$/);
  await expect(idElement).toBeVisible();
  
  const typeBadges = card.getByRole('listitem');
  const typeBadgeCount = await typeBadges.count();
  expect(typeBadgeCount).toBeGreaterThanOrEqual(1);
  
  for (let j = 0; j < typeBadgeCount; j++) {
    const badge = typeBadges.nth(j);
    await expect(badge).toBeVisible();
    await expect(badge).not.toBeEmpty();
  }
};

export const testSearchFunctionality = async (page: Page, searchTerm: string, expectedResult: string | null) => {
  const searchInput = page.getByPlaceholder(testSelectors.searchInput);
  await searchInput.fill(searchTerm);
  
  if (expectedResult) {
    await expect(
      page.getByText(testSelectors.searchResultsText(searchTerm))
    ).toBeVisible();
    
    const pokemonNames = page.getByRole('heading', { level: 3 });
    await expect(pokemonNames).toHaveCount(1);
    await expect(pokemonNames.first()).toHaveText(expectedResult);
  } else {
    await expect(
      page.getByText(testSelectors.noResultsText(searchTerm))
    ).toBeVisible();
    
    const pokemonNames = page.getByRole('heading', { level: 3 });
    await expect(pokemonNames).toHaveCount(0);
  }
};
