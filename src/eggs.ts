export interface EggType {
  id: string;
  name: string;
  seconds: number;
  tagline: string;
  white: string;
  /** `runny` goes from 0 (fully set) to 1 (liquid) */
  yolk: { color: string; runny: number };
  /** Last instruction step, once the timer rings */
  serve: { title: string; detail: string };
  /** Starter "type" in the hatching game: decides which creatures can hatch */
  starter: { type: string; color: string };
}

export interface SizeOffset {
  id: string;
  label: string;
  seconds: number;
}

// Times assume a medium egg straight from the fridge, lowered into water
// that is already at a rolling boil. Tweak freely while prototyping.
export const EGG_TYPES: EggType[] = [
  {
    id: 'coque',
    name: 'À la coque',
    seconds: 3 * 60,
    tagline: 'Jaune coulant, parfait pour les mouillettes',
    white: '#fffaf0',
    yolk: { color: '#ffb300', runny: 1 },
    starter: { type: 'Coulant', color: '#4fc3f7' },
    serve: {
      title: 'Sers aussitôt',
      detail: 'Pose-le dans un coquetier, décalotte-le et trempe tes mouillettes.',
    },
  },
  {
    id: 'mollet',
    name: 'Mollet',
    seconds: 6 * 60,
    tagline: 'Blanc pris, jaune crémeux',
    white: '#ffffff',
    yolk: { color: '#ffa000', runny: 0.5 },
    starter: { type: 'Crémeux', color: '#f48fb1' },
    serve: {
      title: "Plonge-le dans l'eau froide",
      detail: "Un bol d'eau glacée stoppe la cuisson. Écale-le ensuite délicatement : il est fragile.",
    },
  },
  {
    id: 'dur',
    name: 'Dur',
    seconds: 10 * 60,
    tagline: 'Tout est pris — salades & pique-niques',
    white: '#ffffff',
    yolk: { color: '#ffca28', runny: 0 },
    starter: { type: 'Costaud', color: '#81c784' },
    serve: {
      title: "Plonge-le dans l'eau froide",
      detail: "Laisse-le refroidir quelques minutes dans l'eau glacée : il s'écalera plus facilement.",
    },
  },
];

export const SIZE_OFFSETS: SizeOffset[] = [
  { id: 'petit', label: 'Petit', seconds: -30 },
  { id: 'moyen', label: 'Moyen', seconds: 0 },
  { id: 'gros', label: 'Gros', seconds: 60 },
];
