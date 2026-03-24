import { useState, useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import { GEN_COLORS, fmt, fD, label } from '../utils/format';
import { PageHeader } from '../components/shared/PageHeader';
import type { ChipConfig } from '../data/chips';

type SortKey = 'chip' | 'ram' | 'bw' | 'g6s' | 'g6m' | 'g6g' | 'l7' | 'l14' | 'tops' | 'msrp' | 'st' | 'bat' | 'ssd' | 'tb' | 'wifi';

interface Column {
  key: SortKey;
  label: string;
  format: (c: ChipConfig) => string;
  numeric: boolean;
  higherBetter: boolean;
}

const COLUMNS: Column[] = [
  { key: 'chip', label: 'Chip', format: c => label(c), numeric: false, higherBetter: true },
  { key: 'ram', label: 'RAM', format: c => `${c.ram} GB`, numeric: true, higherBetter: true },
  { key: 'bw', label: 'BW', format: c => `${c.bw}`, numeric: true, higherBetter: true },
  { key: 'g6s', label: 'SC', format: c => fmt(c.g6s), numeric: true, higherBetter: true },
  { key: 'g6m', label: 'MC', format: c => fmt(c.g6m), numeric: true, higherBetter: true },
  { key: 'g6g', label: 'GPU', format: c => fmt(c.g6g), numeric: true, higherBetter: true },
  { key: 'l7', label: '7B', format: c => c.l7 != null ? `${c.l7}` : '\u2014', numeric: true, higherBetter: true },
  { key: 'l14', label: '14B', format: c => c.l14 != null ? `${c.l14}` : '\u2014', numeric: true, higherBetter: true },
  { key: 'tops', label: 'TOPS', format: c => `${c.tops}`, numeric: true, higherBetter: true },
  { key: 'msrp', label: 'MSRP', format: c => fD(c.msrp), numeric: true, higherBetter: false },
  { key: 'st', label: 'Street', format: c => fD(c.st), numeric: true, higherBetter: false },
  { key: 'bat', label: 'Bat', format: c => `${c.bat}h`, numeric: true, higherBetter: true },
  { key: 'ssd', label: 'SSD', format: c => fmt(c.ssd), numeric: true, higherBetter: true },
  { key: 'tb', label: 'TB', format: c => c.tb, numeric: false, higherBetter: true },
  { key: 'wifi', label: 'WiFi', format: c => c.wifi, numeric: false, higherBetter: true },
];

function getNumericVal(c: ChipConfig, key: SortKey): number {
  const v = (c as Record<string, unknown>)[key];
  if (v == null) return -Infinity;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    // sort TB3 < TB4 < TB5, WiFi 6E < 7
    const n = parseFloat(v.replace(/[^\d.]/g, ''));
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export default function DataTable() {
  const { filtered } = useFilters();
  const [sortKey, setSortKey] = useState<SortKey>('g6s');
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(a => !a);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const rows = useMemo(() => {
    let list = filtered;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => label(c).toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }

    const sorted = [...list].sort((a, b) => {
      if (sortKey === 'chip') {
        const cmp = label(a).localeCompare(label(b));
        return sortAsc ? cmp : -cmp;
      }
      const va = getNumericVal(a, sortKey);
      const vb = getNumericVal(b, sortKey);
      return sortAsc ? va - vb : vb - va;
    });
    return sorted;
  }, [filtered, sortKey, sortAsc, search]);

  // Calculate maxes for conditional coloring
  const maxes = useMemo(() => {
    const m: Partial<Record<SortKey, number>> = {};
    const numericKeys: SortKey[] = ['bw', 'g6s', 'g6m', 'g6g', 'l7', 'l14', 'tops', 'bat', 'ssd'];
    numericKeys.forEach(k => {
      m[k] = Math.max(...filtered.map(c => getNumericVal(c, k)).filter(v => v > -Infinity));
    });
    return m;
  }, [filtered]);

  return (
    <div className="animate-slide-up">
      <PageHeader
        icon="\uD83D\uDCCA"
        title="Data Table"
        subtitle={`${rows.length} configurations -- click column headers to sort`}
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by chip name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-[13px] w-[280px] outline-none focus:border-accent transition-colors"
          style={{
            color: 'var(--color-text)',
            fontFamily: 'var(--font-display)',
            background: 'var(--color-card-alt)',
          }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-[11px]" style={{ borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-2)' }}>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-2.5 py-2.5 font-bold uppercase tracking-wider cursor-pointer select-none transition-colors hover:text-accent whitespace-nowrap"
                  style={{
                    color: sortKey === col.key ? 'var(--color-accent)' : 'var(--color-muted)',
                    textAlign: col.key === 'chip' ? 'left' : 'right',
                    fontSize: 9,
                  }}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-0.5">{sortAsc ? '\u25B2' : '\u25BC'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => (
              <tr
                key={c.id}
                className="transition-colors"
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  background: i % 2 === 0 ? 'transparent' : 'var(--color-surface)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-card-alt)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--color-surface)')}
              >
                {COLUMNS.map(col => {
                  const isChip = col.key === 'chip';
                  const isMax = col.numeric && col.higherBetter && maxes[col.key] != null && getNumericVal(c, col.key) === maxes[col.key];
                  let cellColor = 'var(--color-text)';
                  if (isChip) cellColor = GEN_COLORS[c.gen];
                  else if (isMax) cellColor = 'var(--color-green)';

                  return (
                    <td
                      key={col.key}
                      className="px-2.5 py-2 font-mono whitespace-nowrap"
                      style={{
                        textAlign: isChip ? 'left' : 'right',
                        color: cellColor,
                        fontWeight: isChip || isMax ? 700 : 400,
                        fontFamily: isChip ? 'var(--font-display)' : 'var(--font-mono)',
                        fontSize: 11,
                      }}
                    >
                      {col.format(c)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="p-8 text-center text-[13px]" style={{ color: 'var(--color-muted)' }}>
            No chips match your search or filters.
          </div>
        )}
      </div>
    </div>
  );
}
