"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const content = require("..");

test("Phase 4D public class content preserves the approved catalog identity", () => {
  assert.equal(content.PHASE4D_CLASS_CONTENT_VERSION, 3);
  assert.equal(content.PHASE4D_CLASS_CONTENT_KEY, "phase4d_classes_v1");
  assert.equal(content.PHASE4D_CLASS_CONTENT_HASH, "16d51ab02205b9d8745a8821ee902571ebaf585b39d1637e504f81c235d923b7");
  assert.deepEqual(content.CLASS_KEYS, ["vanguard", "guardian", "ranger", "arcanist", "alchemist", "reaver"]);
  assert.equal(content.PHASE4D_CLASS_CONTENT.classes.length, 6);
  assert.equal(content.SPECIALIZATION_KEYS.length, 12);
  for (const realmClass of content.PHASE4D_CLASS_CONTENT.classes) for (const specialization of realmClass.specializations) assert.equal(specialization.parent_class_key, realmClass.key);
  assert.equal(crypto.createHash("sha256").update(content.canonicalSerialize(content.PHASE4D_CLASS_CONTENT), "utf8").digest("hex"), content.PHASE4D_CLASS_CONTENT_HASH);
});
