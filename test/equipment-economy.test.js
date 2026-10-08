"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const economy = require("..");
const item = (overrides = {}) => ({ rarity: "rare", durabilityCurrent: 100, durabilityMax: 190, enhancementLevel: 0, ...overrides });
test("shared equipment economy preserves the canonical Phase 3A balance values", () => {
  assert.deepEqual(economy.quoteEquipmentScrap({ rarity: "common", subtype: "weapon" }), { minimum: 5, maximum: 10, rarity: "common", subtype: "weapon" });
  assert.deepEqual(economy.quoteEquipmentScrap({ rarity: "celestial", subtype: "accessory" }), { minimum: 98, maximum: 162, rarity: "celestial", subtype: "accessory" });
  assert.equal(economy.quoteSelfRepair(item()).baseScrapCost, 13); assert.equal(economy.quoteForgeRepair(item()).walletCreditCost, 243);
  assert.deepEqual(economy.quoteEnhancement(item({ rarity: "common" })), { rarity: "common", currentEnhancement: 0, targetEnhancement: 1, maxed: false, walletCreditCost: 100 });
  assert.equal(economy.quoteEnhancement(item({ enhancementLevel: 10 })).maxed, true);
});
test("shared quote layer has no entropy and server callers inject validated rolls", () => {
  assert.equal(economy.rollEquipmentScrapYield({ rarity: "rare", subtype: "weapon", rng: () => 0 }), 18);
  assert.equal(economy.rollEquipmentScrapYield({ rarity: "rare", subtype: "weapon", rng: () => .999999 }), 32);
  assert.deepEqual(economy.selfRepairBoostOptions(item()).map((quote) => quote.extraScrap), [0, 3, 6, 9, 13]);
  assert.throws(() => economy.rollEquipmentScrapYield({ rarity: "rare", subtype: "weapon", rng: () => 1 }), (error) => error.code === "INVALID_RNG_ROLL");
});
