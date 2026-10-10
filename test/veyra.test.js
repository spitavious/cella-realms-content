"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const content = require("..");
test("Veyra Hunt content remains canonical and safe to clone", () => {
  assert.equal(Object.keys(content.VEYRA_ENCOUNTERS).length, 10);
  assert.deepEqual(content.getVeyraEncounter("mossback_grazer").rewards, { xp: { min: 44, max: 105 }, credits: { min: 20, max: 70 }, scrap: { min: 2, max: 7 } });
  assert.deepEqual(content.getVeyraEncounter("briar_matron").rewards, { xp: { min: 99, max: 138 }, credits: { min: 55, max: 90 }, scrap: { min: 8, max: 18 } });
  assert.deepEqual(content.getVeyraEncounter("old_ironroot").rewards, { xp: { min: 127, max: 171 }, credits: { min: 70, max: 110 }, scrap: { min: 8, max: 18 } });
  assert.deepEqual(content.getVeyraEncounter("warder_khelt").rewards, { xp: { min: 154, max: 204 }, credits: { min: 90, max: 130 }, scrap: { min: 8, max: 18 } });
  assert.equal(content.getVeyraEncounter("mossback_grazer").rewards.scrap.max, 7);
  assert.equal(content.getVeyraEncounter("briar_matron").rewards.scrap.max, 18);
  assert.equal(content.VEYRA_HUNT_DROP_DEFINITIONS.length, 16);
  assert.equal(content.VEYRA_HUNT_DROP_BY_KEY.veyra_verdant_edge.displayName, "Verdant Edge");
  const clone = content.getVeyraEncounter("mossback_grazer"); clone.stats.hp = 0;
  assert.equal(content.getVeyraEncounter("mossback_grazer").stats.hp, 72);
});
