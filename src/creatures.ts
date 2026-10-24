export type SpeciesId =
  | 'axolotl'
  | 'pingouin'
  | 'grenouille'
  | 'singe'
  | 'licorne'
  | 'poussin'
  | 'dinosaure'
  | 'dragon'
  | 'tortue';

export interface Species {
  id: SpeciesId;
  name: string;
  emoji: string; // shown in the reveal card
  egg: string; // EggType id whose pool it belongs to
  color: string;
  shinyColor: string;
  quip: string; // Cocotte's reaction
}

export const SPECIES: Species[] = [
  { id: 'axolotl', name: 'Axolotl', emoji: '🦎', egg: 'coque', color: '#ff9ec7', shinyColor: '#ffd54f', quip: 'Un axolotl ! Il sourit tout le temps.' },
  { id: 'pingouin', name: 'Pingouin', emoji: '🐧', egg: 'coque', color: '#455a64', shinyColor: '#7e57c2', quip: "Un pingouin ! Il préfère l'eau froide…" },
  { id: 'grenouille', name: 'Grenouille', emoji: '🐸', egg: 'coque', color: '#7cb342', shinyColor: '#ffd54f', quip: 'Une grenouille ! Elle a sauté direct.' },
  { id: 'singe', name: 'Singe', emoji: '🐒', egg: 'mollet', color: '#a1887f', shinyColor: '#ffd54f', quip: 'Un singe ! Il cherche déjà des bananes.' },
  { id: 'licorne', name: 'Licorne', emoji: '🦄', egg: 'mollet', color: '#ffffff', shinyColor: '#ce93d8', quip: 'Une licorne ?! Personne ne va me croire.' },
  { id: 'poussin', name: 'Poussin', emoji: '🐥', egg: 'mollet', color: '#ffd54f', shinyColor: '#ff8a65', quip: "Un… poussin. Bon, ça, c'était prévisible." },
  { id: 'dinosaure', name: 'Dinosaure', emoji: '🦕', egg: 'dur', color: '#66bb6a', shinyColor: '#ffd54f', quip: 'Un dinosaure ! On est cousins, tu sais.' },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', egg: 'dur', color: '#9575cd', shinyColor: '#ffd54f', quip: 'Un dragon ! Il a rallumé le feu tout seul.' },
  { id: 'tortue', name: 'Tortue', emoji: '🐢', egg: 'dur', color: '#8bc34a', shinyColor: '#4dd0e1', quip: 'Une tortue ! Elle a pris son temps pour sortir.' },
];

export interface Hatch {
  species: Species;
  shiny: boolean;
  surprise: boolean; // came from another egg's pool
}

const SURPRISE_CHANCE = 0.15;

/** Shiny odds grow with the comfort the egg got while incubating */
export const shinyChance = (cuddles: number) => Math.min(0.5, 0.03 + cuddles * 0.01);

export function rollCreature(eggId: string, cuddles: number): Hatch {
  const surprise = Math.random() < SURPRISE_CHANCE;
  const pool = SPECIES.filter((s) => (surprise ? s.egg !== eggId : s.egg === eggId));
  return {
    species: pool[Math.floor(Math.random() * pool.length)],
    shiny: Math.random() < shinyChance(cuddles),
    surprise,
  };
}
