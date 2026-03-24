interface PillProps {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
  small?: boolean;
}

export function Pill({ label, active, color, onClick, small }: PillProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-full font-semibold cursor-pointer transition-all duration-150 whitespace-nowrap"
      style={{
        padding: small ? '4px 10px' : '6px 14px',
        border: `1px solid ${active ? color : 'var(--color-border)'}`,
        background: active ? color + '18' : 'transparent',
        color: active ? color : 'var(--color-muted)',
        fontSize: small ? 10 : 11,
      }}
    >
      {label}
    </button>
  );
}
