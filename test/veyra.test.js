"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const content = require("..");
test("Veyra Hunt content remains canonical and safe to clone", () => {
  assert.equal(Object.keys(content.VEYRA_ENCOUNTERS).length, 10);
  assert.equal(content.getVeyraEncounter("mossback_grazer").rewards.scrap.max, 7);
  assert.equal(content.getVeyraEncounter("briar_matron").rewards.scrap.max, 18);
  assert.equal(content.VEYRA_HUNT_DROP_DEFINITIONS.length, 16);
  assert.equal(content.VEYRA_HUNT_DROP_BY_KEY.veyra_verdant_edge.displayName, "Verdant Edge");
  const clone = content.getVeyraEncounter("mossback_grazer"); clone.stats.hp = 0;
  assert.equal(content.getVeyraEncounter("mossback_grazer").stats.hp, 72);
});
