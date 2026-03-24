import { useState, useEffect } from 'react';

export function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="flex items-center gap-2 w-full px-3 py-2.5 text-[12px] font-semibold cursor-pointer transition-colors bg-transparent border-none"
      style={{ color: 'var(--color-sub)' }}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-[16px]">{dark ? '\u2600\uFE0F' : '\uD83C\uDF19'}</span>
      {!collapsed && <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  );
}
