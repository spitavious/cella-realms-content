"use strict";

const PHASE4D_CLASS_CONTENT_VERSION = 3;
const PHASE4D_CLASS_CONTENT_KEY = "phase4d_classes_v1";
const PHASE4D_CLASS_CONTENT_HASH_EXPECTED = "16d51ab02205b9d8745a8821ee902571ebaf585b39d1637e504f81c235d923b7";
const STAT_KEYS = Object.freeze(["hp", "power", "defense", "crit_chance", "crit_damage", "accuracy", "dodge", "lifesteal", "resistance", "potency", "luck", "armor_penetration", "damage_reduction", "status_chance", "cooldown_reduction", "execute_threshold", "block"]);

function freeze(value) { if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; Object.freeze(value); for (const child of Object.values(value)) freeze(child); return value; }
function contributions(values = {}) { return Object.fromEntries(STAT_KEYS.map((key) => [key, values[key] || 0])); }
function specialization(key, parentClassKey, displayName, description, combatIdentity, futureStatDirection, skillThemes, tradeoff) { return { key, parent_class_key: parentClassKey, display_name: displayName, description, combat_identity: combatIdentity, future_stat_direction: futureStatDirection, skill_themes: skillThemes, tradeoff, contributions: contributions() }; }
function canonicalize(value) {
  if (value === null || typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number") { if (!Number.isFinite(value) || Object.is(value, -0)) throw new TypeError("Canonical content numbers must be finite."); return value; }
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object" && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  throw new TypeError("Canonical content supports only JSON-safe plain values.");
}
function canonicalSerialize(content) { return JSON.stringify(canonicalize(content)); }

const PHASE4D_CLASS_CONTENT = freeze({
  content_version: PHASE4D_CLASS_CONTENT_VERSION,
  content_key: PHASE4D_CLASS_CONTENT_KEY,
  classes: [
    { key: "vanguard", display_name: "Vanguard", description: "An aggressive frontline fighter built to keep pressure on the enemy.", weapon_affinities: ["sword", "hammer", "greatsword"], contributions: contributions({ hp: 12, power: 2, armor_penetration: 1 }), specializations: [
      specialization("breaker", "vanguard", "Breaker", "A Vanguard who turns openings into armor-breaking bursts.", "Physical burst and armor pressure.", ["power", "armor_penetration"], ["breach", "finisher"], "Gives up defensive reliability for pressure."),
      specialization("duelist", "vanguard", "Duelist", "A precise frontline combatant who wins focused engagements.", "Melee precision and critical pressure.", ["crit_chance", "dodge"], ["riposte", "precision"], "Less reliable against sustained group pressure."),
    ] },
    { key: "guardian", display_name: "Guardian", description: "A defensive frontline protector centered on mitigation and survival.", weapon_affinities: ["hammer", "sword"], contributions: contributions({ hp: 18, defense: 2, block: 2, damage_reduction: 1 }), specializations: [
      specialization("bulwark", "guardian", "Bulwark", "A Guardian who anchors the line with block and mitigation.", "Maximum personal durability.", ["block", "damage_reduction"], ["guard", "fortify"], "Sacrifices proactive damage."),
      specialization("warden", "guardian", "Warden", "A Guardian who protects through resistance and battlefield control.", "Resistance and protective control.", ["resistance", "status_chance"], ["ward", "taunt"], "Has less personal burst."),
    ] },
    { key: "ranger", display_name: "Ranger", description: "A precision physical attacker using accuracy, critical pressure, and positioning.", weapon_affinities: ["bow", "dagger"], contributions: contributions({ power: 1, accuracy: 3, crit_chance: 2, dodge: 1 }), specializations: [
      specialization("deadeye", "ranger", "Deadeye", "A Ranger focused on exact shots and decisive finishes.", "Accuracy, critical pressure, and execute direction.", ["accuracy", "crit_chance", "execute_threshold"], ["aim", "execute"], "Trades evasive flexibility for finishing power."),
      specialization("skirmisher", "ranger", "Skirmisher", "A Ranger built to move, evade, and reposition.", "Dodge and future mobility cadence.", ["dodge", "cooldown_reduction"], ["disengage", "volley"], "Has a lower single-hit ceiling."),
    ] },
    { key: "arcanist", display_name: "Arcanist", description: "An arcane combatant focused on potency, utility, and future status interactions.", weapon_affinities: ["staff"], contributions: contributions({ power: 1, potency: 4, status_chance: 1 }), specializations: [
      specialization("stormcaller", "arcanist", "Stormcaller", "An Arcanist who builds arcane momentum into chained effects.", "Potency, status chains, and future energy use.", ["potency", "status_chance"], ["arc", "overload"], "Needs setup before reaching full pressure."),
      specialization("runebinder", "arcanist", "Runebinder", "An Arcanist who shapes wards and battlefield control.", "Control, wards, and cooldown direction.", ["resistance", "cooldown_reduction"], ["rune", "barrier"], "Has a lower burst ceiling."),
    ] },
    { key: "alchemist", display_name: "Alchemist", description: "A hybrid utility specialist using sustain, resistance, and manipulation.", weapon_affinities: ["staff", "dagger"], contributions: contributions({ hp: 6, resistance: 2, potency: 3, luck: 1, status_chance: 1 }), specializations: [
      specialization("chirurgeon", "alchemist", "Chirurgeon", "An Alchemist focused on recovery, cleansing, and support.", "Sustain and protective utility.", ["hp", "resistance"], ["remedy", "cleanse"], "Applies less direct offensive pressure."),
      specialization("plaguewright", "alchemist", "Plaguewright", "An Alchemist who turns formulas into debilitating effects.", "Potency, debuffs, and corrosion direction.", ["potency", "status_chance", "armor_penetration"], ["blight", "corrode"], "Has less immediate sustain."),
    ] },
    { key: "reaver", display_name: "Reaver", description: "A dangerous aggressor who converts commitment into sustain and finishing pressure.", weapon_affinities: ["greatsword", "dagger", "sword"], contributions: contributions({ power: 2, crit_damage: 5, lifesteal: 2, execute_threshold: 1 }), specializations: [
      specialization("bloodreaver", "reaver", "Bloodreaver", "A Reaver who sustains through relentless offense.", "Lifesteal and low-health momentum.", ["lifesteal", "hp"], ["rend", "frenzy"], "Struggles when denied healing opportunities."),
      specialization("executioner", "reaver", "Executioner", "A Reaver who converts weakness into a decisive finish.", "Power, critical damage, and execute direction.", ["power", "crit_damage", "execute_threshold"], ["mark", "execute"], "Has less stable long-fight sustain."),
    ] },
  ],
});

const CLASS_KEYS = freeze(PHASE4D_CLASS_CONTENT.classes.map((entry) => entry.key));
const SPECIALIZATION_KEYS = freeze(PHASE4D_CLASS_CONTENT.classes.flatMap((entry) => entry.specializations.map((entry) => entry.key)));
const PHASE4D_CLASS_CONTENT_CANONICAL = canonicalSerialize(PHASE4D_CLASS_CONTENT);
const PHASE4D_CLASS_CONTENT_HASH = PHASE4D_CLASS_CONTENT_HASH_EXPECTED;

module.exports = { STAT_KEYS, CLASS_KEYS, SPECIALIZATION_KEYS, PHASE4D_CLASS_CONTENT_VERSION, PHASE4D_CLASS_CONTENT_KEY, PHASE4D_CLASS_CONTENT_HASH, PHASE4D_CLASS_CONTENT_CANONICAL, PHASE4D_CLASS_CONTENT, contributions, canonicalSerialize };
