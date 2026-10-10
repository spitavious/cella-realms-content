"use strict";

const { createHash } = require("node:crypto");
function freeze(value) { if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; Object.freeze(value); for (const child of Object.values(value)) freeze(child); return value; }
function canonicalize(value) { if (value === null || typeof value === "string" || typeof value === "boolean") return value; if (typeof value === "number") { if (!Number.isFinite(value) || Object.is(value, -0)) throw new TypeError("Canonical content numbers must be finite."); return value; } if (Array.isArray(value)) return value.map(canonicalize); if (value && typeof value === "object" && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])])); throw new TypeError("Canonical content supports only JSON-safe plain values."); }
function canonicalSerialize(content) { return JSON.stringify(canonicalize(content)); }
const SKILL_CONTENT_VERSION = 1;
const SKILL_CONTENT_KEY = "phase4a_skills_v1";
const SKILL_CONTENT = freeze({ content_version: SKILL_CONTENT_VERSION, content_key: SKILL_CONTENT_KEY, skills: [
  { key: "breach", display_name: "Breach", description: "A committed strike that punches through an enemy's defenses.", theme: "physical burst / armor pressure", unlock_level: 5, class_key: "vanguard", specialization_key: null },
  { key: "guarded_strike", display_name: "Guarded Strike", description: "Strike while maintaining a defensive stance against the enemy's response.", theme: "defensive exchange", unlock_level: 5, class_key: "guardian", specialization_key: null },
  { key: "precise_shot", display_name: "Precise Shot", description: "A carefully aimed attack built around accuracy and critical pressure.", theme: "precision / critical pressure", unlock_level: 5, class_key: "ranger", specialization_key: null },
  { key: "arc_bolt", display_name: "Arc Bolt", description: "Condense arcane power into a focused offensive bolt.", theme: "potency / arcane damage", unlock_level: 5, class_key: "arcanist", specialization_key: null },
  { key: "corrosive_flask", display_name: "Corrosive Flask", description: "Hurl a volatile mixture designed to weaken an enemy's defenses.", theme: "corrosion / utility", unlock_level: 5, class_key: "alchemist", specialization_key: null },
  { key: "rend", display_name: "Rend", description: "A vicious attack that turns aggression into finishing pressure.", theme: "pressure / finishing damage", unlock_level: 5, class_key: "reaver", specialization_key: null },
] });
const SKILL_CONTENT_CANONICAL = canonicalSerialize(SKILL_CONTENT);
const SKILL_CONTENT_HASH = createHash("sha256").update(SKILL_CONTENT_CANONICAL).digest("hex");
function getUnlockedSkills({ level, classKey, specializationKey = null }) { if (!Number.isInteger(level) || level < 1 || typeof classKey !== "string" || specializationKey !== null && typeof specializationKey !== "string") return Object.freeze([]); return Object.freeze(SKILL_CONTENT.skills.filter((skill) => skill.class_key === classKey && skill.specialization_key === null && level >= skill.unlock_level).map((skill) => freeze({ ...skill }))); }
module.exports = { SKILL_CONTENT_VERSION, SKILL_CONTENT_KEY, SKILL_CONTENT_HASH, SKILL_CONTENT_CANONICAL, SKILL_CONTENT, getUnlockedSkills, canonicalSerialize };
