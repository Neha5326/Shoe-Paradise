export function recommendShoes(shoes, preferences) {
  const size = Number(preferences.size);
  const budget = Number(preferences.budget);
  const useCase = preferences.useCase;
  const width = preferences.width;

  if (!Number.isFinite(size) || !Number.isFinite(budget) || budget <= 0)
    return [];

  return shoes
    .filter((shoe) => shoe.sizes.includes(size) && shoe.price <= budget)
    .map((shoe) => ({
      ...shoe,
      fitScore:
        (shoe.widths.includes(width) ? 2 : 0) +
        (shoe.uses.includes(useCase) ? 2 : 0) +
        shoe.comfort,
    }))
    .sort(
      (first, second) =>
        second.fitScore - first.fitScore || first.price - second.price,
    );
}
