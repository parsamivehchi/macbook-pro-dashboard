import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { ThemeToggle } from '../shared/ThemeToggle';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    label: 'Compare',
    items: [
      { path: '/', label: 'Dashboard', icon: '\u2302' },
      { path: '/compare/head-to-head', label: 'Head-to-Head', icon: '\u2694\uFE0F' },
      { path: '/compare/data-table', label: 'Data Table', icon: '\uD83D\uDCCA' },
      { path: '/compare/features', label: 'Features', icon: '\uD83D\uDD32' },
    ],
  },
  {
    label: 'Analyze',
    items: [
      { path: '/analyze/llm', label: 'LLM Performance', icon: '\uD83E\uDDE0' },
      { path: '/analyze/benchmarks', label: 'Benchmarks', icon: '\uD83C\uDFAF' },
      { path: '/analyze/cost', label: 'Cost Analysis', icon: '\uD83D\uDCB5' },
      { path: '/analyze/perf-dollar', label: 'Perf / Dollar', icon: '\uD83D\uDCC8' },
      { path: '/analyze/llm-bandwidth', label: 'LLM x BW', icon: '\uD83D\uDD2C' },
      { path: '/analyze/features-timeline', label: 'Timeline', icon: '\u23F3' },
    ],
  },
  {
    label: 'Guide',
    items: [
      { path: '/guide/budget', label: 'Budget Picker', icon: '\uD83D\uDCB0' },
      { path: '/guide/use-cases', label: 'Use Cases', icon: '\uD83C\uDFAF' },
      { path: '/guide/buying-guide', label: 'Buying Guide', icon: '\uD83D\uDED2' },
      { path: '/guide/decision-matrix', label: 'Decision Matrix', icon: '\u2696\uFE0F' },
      { path: '/guide/workflow', label: 'Workflow', icon: '\uD83D\uDEE0\uFE0F' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { path: '/reference/sources', label: 'Data Sources', icon: '\uD83D\uDCCB' },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="h-screen sticky top-0 flex flex-col border-r border-border transition-all duration-200 shrink-0 overflow-y-auto overflow-x-hidden"
      style={{
        width: collapsed ? 56 : 220,
        background: 'var(--color-card)',
      }}
    >
      <div className="p-4 pb-2">
        <div className="text-[10px] font-extrabold tracking-[0.15em] uppercase" style={{ color: 'var(--color-accent)' }}>
          {collapsed ? 'MBP' : 'MBP Observatory'}
        </div>
      </div>

      <nav className="flex-1 px-2 pb-4">
        {NAV.map(group => (
          <div key={group.label} className="mt-4 first:mt-2">
            {!collapsed && (
              <div className="text-[8px] font-bold uppercase tracking-[0.12em] px-2 mb-1" style={{ color: 'var(--color-muted)' }}>
                {group.label}
              </div>
            )}
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg text-[12px] font-semibold transition-all duration-150 no-underline ${
                    collapsed ? 'justify-center px-2 py-2 my-0.5' : 'px-2.5 py-1.5 my-0.5'
                  } ${isActive
                    ? 'text-accent'
                    : 'hover:bg-[var(--color-surface)]'
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-accent)' : 'var(--color-sub)',
                  background: isActive ? 'var(--color-accent)' + '15' : undefined,
                  borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                })}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-[14px] shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-border">
        <ThemeToggle collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full p-3 border-t border-border text-[11px] font-semibold cursor-pointer transition-colors bg-transparent"
          style={{ color: 'var(--color-muted)' }}
        >
          {collapsed ? '\u25B6' : '\u25C0 Collapse'}
        </button>
      </div>
    </aside>
  );
}
