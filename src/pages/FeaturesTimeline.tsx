import { PageHeader } from '../components/shared/PageHeader';
import { InsightCard } from '../components/shared/InsightCard';
import { Pill } from '../components/shared/Pill';

interface FeatureRow {
  feature: string;
  values: [string, string, string, string]; // M2, M3, M4, M5
  improved: [boolean, boolean, boolean]; // M3 vs M2, M4 vs M3, M5 vs M4
}

const FEATURES: FeatureRow[] = [
  {
    feature: 'Thunderbolt',
    values: ['TB4', 'TB3/TB4', 'TB4/TB5', 'TB4/TB5'],
    improved: [false, true, false],
  },
  {
    feature: 'WiFi',
    values: ['6E', '6E', '6E', '6E/7'],
    improved: [false, false, true],
  },
  {
    feature: 'Camera',
    values: ['1080p', '1080p', '12MP', '12MP'],
    improved: [false, true, false],
  },
  {
    feature: 'Display SDR (nits)',
    values: ['500', '600', '1000', '1000'],
    improved: [true, true, false],
  },
  {
    feature: 'SSD Speed (MB/s)',
    values: ['5200', '5200', '5100', '6725/14500'],
    improved: [false, false, true],
  },
  {
    feature: 'Battery (Pro)',
    values: ['18h', '18h', '22h', '22h'],
    improved: [false, true, false],
  },
];

const GENS_LABELS = ['M2', 'M3', 'M4', 'M5'] as const;
const GEN_HEADER_COLORS = [
  'var(--color-gen-m2)',
  'var(--color-gen-m3)',
  'var(--color-gen-m4)',
  'var(--color-gen-m5)',
];

interface Milestone {
  title: string;
  gen: string;
  color: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    title: 'Thunderbolt 5',
    gen: 'M4/M5',
    color: 'var(--color-gen-m4)',
    description:
      'Up to 120 Gb/s bandwidth. First appeared on M4 Pro/Max, continued on M5. Enables faster external storage and eGPU throughput.',
  },
  {
    title: 'WiFi 7',
    gen: 'M5',
    color: 'var(--color-gen-m5)',
    description:
      'MLO (Multi-Link Operation), 320MHz channels, up to 46 Gb/s theoretical. Only available on M5 generation machines.',
  },
  {
    title: '12MP Center Stage Camera',
    gen: 'M4',
    color: 'var(--color-gen-m4)',
    description:
      'Massive upgrade from 1080p FaceTime camera. 12MP with Center Stage for automatic framing during video calls.',
  },
  {
    title: '1000 nit SDR Display',
    gen: 'M4',
    color: 'var(--color-gen-m4)',
    description:
      'Doubled SDR brightness from 500/600 nits to 1000 nits. Significantly improves outdoor and bright-room usability.',
  },
  {
    title: '14.5 GB/s SSD',
    gen: 'M5 Max',
    color: 'var(--color-gen-m5)',
    description:
      'Nearly 3x faster than previous generations. M5 Pro gets 6725 MB/s, M5 Max pushes to 14,500 MB/s sequential read.',
  },
];

const UNCHANGED = [
  { item: 'Chassis Design', detail: 'Same unibody aluminum since 2021 redesign' },
  { item: 'Port Selection', detail: '3x TB, HDMI, SD slot, MagSafe, headphone jack' },
  { item: 'Keyboard', detail: 'Full-size with Touch ID, same layout and travel' },
  { item: 'ProMotion Display', detail: '120Hz adaptive refresh, same since M1 Pro' },
  { item: 'Weight', detail: '14": ~3.4 lbs, 16": ~4.7 lbs across all generations' },
];

export default function FeaturesTimeline() {
  return (
    <div className="space-y-8">
      <PageHeader
        icon="#"
        title="Features Timeline"
        subtitle="Hardware evolution across M2 through M5 generations"
      />

      {/* Timeline Grid */}
      <section
        className="rounded-2xl p-6 border overflow-x-auto"
        style={{
          background: 'var(--color-card)',
          borderColor: 'var(--color-border)',
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Generation Comparison
        </h2>
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr>
              <th
                className="text-left py-3 px-4"
                style={{ color: 'var(--color-muted)' }}
              >
                Feature
              </th>
              {GENS_LABELS.map((g, i) => (
                <th
                  key={g}
                  className="text-center py-3 px-4 font-bold"
                  style={{ color: GEN_HEADER_COLORS[i] }}
                >
                  {g}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((row) => (
              <tr
                key={row.feature}
                className="border-t"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <td
                  className="py-3 px-4 font-medium"
                  style={{ color: 'var(--color-text)' }}
                >
                  {row.feature}
                </td>
                {row.values.map((val, colIdx) => {
                  const isImproved = colIdx > 0 && row.improved[colIdx - 1];
                  return (
                    <td key={colIdx} className="py-3 px-4 text-center">
                      <span
                        className="inline-flex items-center gap-1.5"
                        style={{ color: 'var(--color-sub)' }}
                      >
                        {val}
                        {isImproved && (
                          <span
                            className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{
                              background: 'var(--color-green)',
                              color: '#000',
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Key Milestones */}
      <section>
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          Key Milestones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MILESTONES.map((m) => (
            <div
              key={m.title}
              className="rounded-xl p-5 border-l-4 border space-y-2"
              style={{
                background: 'var(--color-card)',
                borderLeftColor: m.color,
                borderColor: 'var(--color-border)',
                borderLeftWidth: '4px',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: 'var(--color-text)' }}
                >
                  {m.title}
                </span>
                <Pill label={m.gen} active={false} color={m.color} onClick={() => {}} />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-sub)' }}>
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What Didn't Change */}
      <section
        className="rounded-2xl p-6 border"
        style={{
          background: 'var(--color-card)',
          borderColor: 'var(--color-border)',
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: 'var(--color-text)' }}
        >
          What Didn't Change
        </h2>
        <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
          These aspects have remained consistent across all four generations (M2 through M5):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {UNCHANGED.map((u) => (
            <div
              key={u.item}
              className="rounded-lg p-4 space-y-1"
              style={{ background: 'var(--color-surface)' }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {u.item}
              </div>
              <div
                className="text-xs"
                style={{ color: 'var(--color-muted)' }}
              >
                {u.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      <InsightCard
        title="The Upgrade Cadence"
        body="Apple has settled into a pattern: major feature upgrades (camera, display, ports) happen every other generation, while silicon performance improves every generation. If you're on M2, the M4/M5 jump is transformative. If you're on M3, the M5 is a nice-to-have but not essential unless you need WiFi 7 or faster SSD speeds."
        accent="var(--color-accent)"
      />
    </div>
  );
}
