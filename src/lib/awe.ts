/** AWE RPG System – tier, dice, and tolerance from the rules */

import type { Tier } from '../types/awe';

export function getTier(score: number): Tier {
  if (score <= 2) return 'Pathetic';
  if (score <= 4) return 'Average';
  if (score <= 6) return 'Adept';
  if (score <= 8) return 'Master';
  return 'Inhuman';
}

/** Number of dice = Attribute ÷ 2 (rounded down) */
export function getDice(attribute: number): number {
  return Math.floor(attribute / 2);
}

/** Tolerance = Endurance dice = Major Wounds before incapacitated */
export function getTolerance(endurance: number): number {
  return getDice(endurance);
}

export function tierLabel(tier: Tier): string {
  return tier;
}
