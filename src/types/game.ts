export type GameScreen = 'main-menu' | 'campaign' | 'game' | 'victory' | 'defeat';
export type GamePanel = 'map' | 'economy' | 'tech' | 'units' | 'politics' | 'diplomacy';
export type TerrainType = 'plains' | 'forest' | 'mountain' | 'coast' | 'desert' | 'swamp';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type UnitType = 'infantry' | 'archer' | 'cavalry' | 'siege' | 'navy' | 'mage';
export type BuildingType = 'farm' | 'mine' | 'barracks' | 'market' | 'temple' | 'fortress' | 'library';
export type RelationType = 'ally' | 'neutral' | 'war' | 'vassal';

export interface Resources {
  gold: number;
  food: number;
  iron: number;
  wood: number;
  faith: number;
  influence: number;
}

export interface Unit {
  id: string;
  type: UnitType;
  name: string;
  attack: number;
  defense: number;
  hp: number;
  maxHp: number;
  movement: number;
  cost: Partial<Resources>;
  upkeep: number;
  count: number;
  level: number;
  emoji: string;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  category: 'military' | 'economy' | 'science' | 'culture' | 'politics';
  cost: number;
  turns: number;
  researched: boolean;
  inProgress: boolean;
  progress: number;
  requires: string[];
  unlocks: string[];
  effect: string;
  era: 1 | 2 | 3;
}

export interface Province {
  id: string;
  name: string;
  terrain: TerrainType;
  owner: string;
  population: number;
  happiness: number;
  defense: number;
  buildings: BuildingType[];
  resources: Partial<Resources>;
  units: string[];
  x: number;
  y: number;
  connected: string[];
}

export interface Faction {
  id: string;
  name: string;
  color: string;
  flag: string;
  leader: string;
  relation: RelationType;
  strength: number;
  provinces: number;
  isPlayer: boolean;
  attitude: number;
  treaties: string[];
}

export interface Mission {
  id: number;
  name: string;
  description: string;
  objective: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  unlocked: boolean;
  completed: boolean;
  rewards: string;
  era: string;
}

export interface GameState {
  screen: GameScreen;
  activePanel: GamePanel;
  turn: number;
  year: number;
  season: Season;
  currentMission: number;
  resources: Resources;
  resourcesDelta: Resources;
  provinces: Province[];
  units: Unit[];
  technologies: Technology[];
  factions: Faction[];
  selectedProvince: string | null;
  selectedUnit: string | null;
  notifications: string[];
  score: number;
  researchQueue: string | null;
}
