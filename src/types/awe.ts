/** AWE RPG System – character and rules types */

export type Tier = 'Pathetic' | 'Average' | 'Adept' | 'Master' | 'Inhuman';

export type StartType = 'vanilla' | 'push';

export interface AWEAttributes {
  agility: number;
  wit: number;
  endurance: number;
}

export interface AWECharacter {
  id: string;
  name: string;
  startType: StartType;
  attributes: AWEAttributes;
  pushCurrent: number;
  pushMax: number;
  pushDescription?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export const VANILLA_POINTS = 10;
export const VANILLA_PUSH = 2;
export const PUSH_START_POINTS = 6;
export const PUSH_START_PUSH = 4;

export const MIN_ATTR = 1;
export const MAX_ATTR = 10;
