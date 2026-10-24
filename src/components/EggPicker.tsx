import type { EggType } from '../eggs';

interface EggPickerProps {
  eggs: EggType[];
  selected: EggType;
  onSelect: (egg: EggType) => void;
  disabled: boolean;
}

// Cross-section of the egg: yolk "drips" more the runnier it is
function EggIcon({ white, yolk }: Pick<EggType, 'white' | 'yolk'>) {
  return (
    <svg viewBox="0 0 60 70" className="egg-icon">
      <path
        d="M30 4 C12 4 4 30 4 44 a26 24 0 0 0 52 0 C56 30 48 4 30 4z"
        fill={white}
        stroke="#e8dcc8"
        strokeWidth="2"
      />
      <circle cx="30" cy="40" r={12 - yolk.runny * 2} fill={yolk.color} />
      {yolk.runny > 0 && <path d={`M26 40 q4 ${10 * yolk.runny + 4} 8 0 z`} fill={yolk.color} />}
    </svg>
  );
}

export default function EggPicker({ eggs, selected, onSelect, disabled }: EggPickerProps) {
  return (
    <div className="egg-types" role="radiogroup">
      {eggs.map((egg) => (
        <button
          key={egg.id}
          className="egg-card"
          role="radio"
          aria-checked={egg.id === selected.id}
          disabled={disabled}
          onClick={() => onSelect(egg)}
        >
          <EggIcon {...egg} />
          <strong>{egg.name}</strong>
          <span className="minutes">{egg.seconds / 60} min</span>
          <small>{egg.tagline}</small>
        </button>
      ))}
    </div>
  );
}
