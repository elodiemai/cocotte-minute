import type { SizeOffset } from '../eggs';

interface SizePickerProps {
  sizes: SizeOffset[];
  selected: SizeOffset;
  onSelect: (size: SizeOffset) => void;
  disabled: boolean;
}

export default function SizePicker({ sizes, selected, onSelect, disabled }: SizePickerProps) {
  return (
    <div className="sizes" role="radiogroup" aria-label="Taille de l'œuf">
      {sizes.map((size) => (
        <button
          key={size.id}
          className="chip"
          role="radio"
          aria-checked={size.id === selected.id}
          disabled={disabled}
          onClick={() => onSelect(size)}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}
