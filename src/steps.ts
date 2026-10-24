import type { EggType } from './eggs';

// Prep covers the first two steps: the cook does them at the stove, then starts the timer
export type Stage = 'prep' | 'cook' | 'serve';

export interface Step {
  stage: Stage;
  title: string;
  detail: string;
}

export const STAGES: Stage[] = ['prep', 'cook', 'serve'];

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  const min = Math.floor(s / 60);
  const sec = s % 60;
  if (!min) return `${sec} s`;
  return sec ? `${min} min ${sec}` : `${min} min`;
}

export function getSteps(egg: EggType, totalMs: number): Step[] {
  return [
    {
      stage: 'prep',
      title: "Porte l'eau à ébullition",
      detail: "Une casserole avec assez d'eau pour couvrir l'œuf.",
    },
    {
      stage: 'prep',
      title: "Dépose l'œuf dans l'eau frémissante",
      detail: "Baisse le feu pour que l'eau frémisse, puis glisse l'œuf avec une cuillère, tout en douceur.",
    },
    {
      stage: 'cook',
      title: `Laisse cuire ${formatDuration(totalMs)}`,
      detail: "Garde un léger frémissement : pas de gros bouillons qui cognent l'œuf contre la casserole.",
    },
    { stage: 'serve', ...egg.serve },
  ];
}
