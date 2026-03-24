import { useFilters } from '../hooks/useFilters';
import { PageHeader } from '../components/shared/PageHeader';
import { StatCard } from '../components/shared/StatCard';
import { InsightCard } from '../components/shared/InsightCard';
import { Pill } from '../components/shared/Pill';
import { CHIPS } from '../data/chips';
import { GEN_COLORS, TIER_COLORS, GENS, fmt, fD, label } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';

/* ---------- Data ---------- */
const CLAUDE_RESOURCES = [
  { step: 'Prompt processing', bottleneck: 'Network latency', metric: 'Wi-Fi / Ethernet' },
  { step: 'MCP server startup', bottleneck: 'Node.js cold start', metric: 'SSD speed' },
  { step: 'File indexing', bottleneck: 'Disk I/O', metric: 'SSD speed' },
  { step: 'Large context windows', bottleneck: 'RAM', metric: 'Available memory' },
  { step: 'Code execution (Bash)', bottleneck: 'CPU single-core', metric: 'Geekbench Single' },
  { step: 'Parallel tool calls', bottleneck: 'CPU multi-core', metric: 'Geekbench Multi' },
];

const LLM_MODELS = [
  { tier: '24GB (M5 Base/Pro)', models: 'Qwen 2.5 7B, Llama 3.1 8B, DeepSeek-R1 8B, Phi-4 14B (Q4)', headroom: '~10-14GB for model', notes: 'Comfortable for 7B, tight for 14B' },
  { tier: '36GB (M5 Max 32G)', models: 'Qwen 2.5 14B, Llama 3.1 14B, DeepSeek-R1 14B, CodeLlama 34B (Q4)', headroom: '~22-26GB for model', notes: 'Sweet spot for 14B, viable for 30B Q4' },
  { tier: '48GB (M5 Max 40G)', models: 'Qwen 2.5 32B, DeepSeek-R1 32B, Llama 3.1 70B (Q2)', headroom: '~34-38GB for model', notes: 'Comfortable 32B, experimental 70B' },
  { tier: '64GB (M2 Max used)', models: 'Llama 3.1 70B (Q4), Qwen 72B (Q3), DeepSeek 67B', headroom: '~50-54GB for model', notes: 'Best for maximum model size' },
];

const MEMORY_BUDGET = [
  { name: 'OS + System', size: 7, color: 'var(--color-muted)' },
  { name: 'IDE (Cursor)', size: 2, color: 'var(--color-accent)' },
  { name: 'Ghostty', size: 0.5, color: 'var(--color-gen-m4)' },
  { name: 'Docker', size: 3, color: 'var(--color-gen-m5)' },
  { name: 'Browser', size: 2.5, color: 'var(--color-gen-m3)' },
  { name: 'Model Headroom', size: 9, color: 'var(--color-green)' },
];

export default function WorkflowNotes() {
  const { filtered } = useFilters();

  return (
    <div className="space-y-8">
      <PageHeader
        icon="\u{1F6E0}\uFE0F"
        title="Workflow Notes"
        subtitle="Optimization tips for engineering and development workflows"
      />

      {/* Ghostty section */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-sub)' }}>
          Ghostty Terminal
        </h3>
        <div
          className="rounded-xl p-4 mb-4"
          style={{
            background: 'color-mix(in srgb, var(--color-green) 8%, var(--color-surface))',
            border: '1px solid color-mix(in srgb, var(--color-green) 30%, var(--color-border))',
          }}
        >
          <p className="text-sm font-medium" style={{ color: 'var(--color-green)' }}>
            Any Apple Silicon chip is massive overkill for terminal rendering.
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-sub)' }}>
            Ghostty uses GPU-accelerated rendering but terminal emulation is trivially lightweight.
            Even the base M1 renders terminals at 120fps without breaking a sweat. Your chip choice
            should never be influenced by terminal performance.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text)' }}>Performance Tip: Cursor Blink</h4>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Disable cursor blink to reduce unnecessary GPU redraws. Saves ~0.1% GPU on integrated displays.
            </p>
          </div>
          <div
            className="rounded-lg p-4 font-mono text-xs overflow-x-auto"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            <pre>{`# ~/.config/ghostty/config
cursor-style = block
cursor-style-blink = false
font-family = JetBrains Mono
font-size = 13
window-padding-x = 8
window-padding-y = 4
theme = dark:catppuccin-mocha
background-opacity = 0.95`}</pre>
          </div>
        </div>
      </section>

      {/* Claude Code section */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-sub)' }}>
          Claude Code Resource Usage
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: 'var(--color-muted)' }}>
                <th className="text-left pb-2 font-medium">Workflow Step</th>
                <th className="text-left pb-2 font-medium">Bottleneck</th>
                <th className="text-left pb-2 font-medium">Best Metric</th>
              </tr>
            </thead>
            <tbody>
              {CLAUDE_RESOURCES.map((row) => (
                <tr key={row.step} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="py-2 font-medium" style={{ color: 'var(--color-text)' }}>{row.step}</td>
                  <td className="py-2" style={{ color: 'var(--color-sub)' }}>{row.bottleneck}</td>
                  <td className="py-2" style={{ color: 'var(--color-accent)' }}>{row.metric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="mt-4 rounded-lg p-3 text-xs"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
          }}
        >
          <span className="font-semibold" style={{ color: 'var(--color-amber)' }}>MCP Servers: </span>
          Each MCP server (context7, chrome-devtools, claude-mem, etc.) runs as a separate process consuming
          50-100MB RAM. With 5+ servers active, budget 250-500MB for MCP overhead. On 24GB machines, close
          unused servers to maximize headroom.
        </div>
      </section>

      {/* Local LLM setup */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-sub)' }}>
          Local LLM Setup
        </h3>

        {/* Stack diagram */}
        <div className="flex flex-col gap-2 mb-6">
          {[
            { label: 'Application Layer', desc: 'Cursor, Continue, Open WebUI, CLI', color: 'var(--color-accent)' },
            { label: 'Inference Engine', desc: 'Ollama (llama.cpp backend)', color: 'var(--color-gen-m5)' },
            { label: 'Model Format', desc: 'GGUF quantized (Q4_K_M, Q5_K_M, Q8_0)', color: 'var(--color-gen-m4)' },
            { label: 'Compute', desc: 'Metal GPU + Neural Engine', color: 'var(--color-gen-m3)' },
            { label: 'Memory', desc: 'Unified Memory (shared CPU/GPU)', color: 'var(--color-gen-m2)' },
          ].map((layer, i) => (
            <div
              key={layer.label}
              className="flex items-center gap-4 rounded-lg px-4 py-3"
              style={{
                background: 'var(--color-surface)',
                borderLeft: `3px solid ${layer.color}`,
              }}
            >
              <div className="w-6 text-center text-xs font-mono" style={{ color: 'var(--color-muted)' }}>{i + 1}</div>
              <div>
                <span className="text-xs font-semibold" style={{ color: layer.color }}>{layer.label}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--color-muted)' }}>{layer.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Model recommendations */}
        <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Recommended Models by Chip Tier</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ color: 'var(--color-muted)' }}>
                <th className="text-left pb-2 font-medium">Chip Tier</th>
                <th className="text-left pb-2 font-medium">Recommended Models</th>
                <th className="text-left pb-2 font-medium">Headroom</th>
                <th className="text-left pb-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {LLM_MODELS.map((row) => (
                <tr key={row.tier} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="py-2 font-medium" style={{ color: 'var(--color-text)' }}>{row.tier}</td>
                  <td className="py-2" style={{ color: 'var(--color-sub)' }}>{row.models}</td>
                  <td className="py-2 font-mono" style={{ color: 'var(--color-green)' }}>{row.headroom}</td>
                  <td className="py-2" style={{ color: 'var(--color-muted)' }}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Memory budget chart */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-sub)' }}>
          Memory Budget on 24GB Machine
        </h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
          How 24GB of unified memory gets consumed during a typical development session
        </p>
        <ResponsiveContainer width="100%" height={60}>
          <BarChart
            data={[{ name: 'Memory', ...Object.fromEntries(MEMORY_BUDGET.map((m) => [m.name, m.size])) }]}
            layout="horizontal"
            barSize={40}
          >
            <XAxis type="category" dataKey="name" hide />
            <YAxis type="number" hide />
            <RTooltip
              contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: 'var(--color-text)' }}
              itemStyle={{ color: 'var(--color-sub)' }}
            />
            {MEMORY_BUDGET.map((m) => (
              <Bar key={m.name} dataKey={m.name} stackId="a" fill={m.color} radius={0} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3">
          {MEMORY_BUDGET.map((m) => (
            <div key={m.name} className="flex items-center gap-1.5 text-[10px]">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: m.color }} />
              <span style={{ color: 'var(--color-text)' }}>{m.name}</span>
              <span style={{ color: 'var(--color-muted)' }}>({m.size}GB)</span>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-lg p-3 text-xs"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
        >
          <span className="font-semibold" style={{ color: 'var(--color-amber)' }}>Total: 24GB</span> --
          Model headroom of ~9GB fits a 7B Q4_K_M model (~4.5GB) comfortably with swap buffer.
          Running a 14B model requires closing Docker or limiting browser tabs. For 14B+ models
          without compromise, 36GB minimum is recommended.
        </div>
      </section>

      {/* Parsec tips */}
      <section
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-sub)' }}>
          Parsec Remote Desktop Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Wi-Fi Band',
              content: 'Always use 5GHz or 6GHz (Wi-Fi 7). 2.4GHz adds 15-30ms latency and causes frame drops. Verify band in System Settings > Wi-Fi > Details.',
              color: 'var(--color-accent)',
            },
            {
              title: 'Codec Selection',
              content: 'Use H.265 (HEVC) codec for Apple Silicon. Hardware decode is native and low-power. Avoid AV1 -- software decode on macOS wastes CPU and battery.',
              color: 'var(--color-gen-m5)',
            },
            {
              title: 'Display Resolution',
              content: 'Match host resolution to client for pixel-perfect rendering. On Retina displays, set Parsec to "Full" resolution with "Matched" quality. Lower resolution reduces bandwidth but introduces scaling artifacts.',
              color: 'var(--color-gen-m4)',
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl p-4"
              style={{ background: 'var(--color-surface)', borderLeft: `3px solid ${tip.color}` }}
            >
              <h4 className="text-xs font-semibold mb-2" style={{ color: tip.color }}>{tip.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>{tip.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
