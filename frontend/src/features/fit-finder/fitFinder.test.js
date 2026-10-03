import assert from "node:assert/strict";
import test from "node:test";
import { recommendShoes } from "./fitFinder.js";

const shoes = [
  {
    id: "wide-runner",
    sizes: [40],
    widths: ["wide"],
    uses: ["running"],
    comfort: 5,
    price: 700,
  },
  {
    id: "daily-slim",
    sizes: [40],
    widths: ["narrow"],
    uses: ["casual"],
    comfort: 4,
    price: 500,
  },
  {
    id: "too-small",
    sizes: [39],
    widths: ["wide"],
    uses: ["running"],
    comfort: 5,
    price: 300,
  },
  {
    id: "over-budget",
    sizes: [40],
    widths: ["wide"],
    uses: ["running"],
    comfort: 5,
    price: 1200,
  },
];

test("ranks matching size, width and activity ahead of other suitable options", () => {
  const matches = recommendShoes(shoes, {
    size: "40",
    budget: "1000",
    width: "wide",
    useCase: "running",
  });
  assert.deepEqual(
    matches.map((shoe) => shoe.id),
    ["wide-runner", "daily-slim"],
  );
});

test("does not recommend shoes outside the requested size or budget", () => {
  const matches = recommendShoes(shoes, {
    size: "39",
    budget: "400",
    width: "wide",
    useCase: "running",
  });
  assert.deepEqual(
    matches.map((shoe) => shoe.id),
    ["too-small"],
  );
});

test("returns no matches for invalid or empty preferences", () => {
  assert.deepEqual(
    recommendShoes(shoes, {
      size: "",
      budget: "900",
      width: "wide",
      useCase: "running",
    }),
    [],
  );
});
