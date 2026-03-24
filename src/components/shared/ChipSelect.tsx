import { CHIPS } from '../../data/chips';
import { GENS, GEN_COLORS, fD, label } from '../../utils/format';

interface ChipSelectProps {
  value: string;
  onChange: (id: string) => void;
  exclude?: string[];
}

export function ChipSelect({ value, onChange, exclude }: ChipSelectProps) {
  const opts = CHIPS.filter(c => !exclude?.includes(c.id));
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="rounded-lg border border-border bg-card-alt px-3 py-2 text-[13px] font-display text-text cursor-pointer min-w-[200px]"
    >
      <option value="">Select a chip...</option>
      {GENS.map(g => (
        <optgroup key={g} label={g} style={{ color: GEN_COLORS[g] }}>
          {opts.filter(c => c.gen === g).map(c => (
            <option key={c.id} value={c.id}>{label(c)} — {fD(c.st)}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
