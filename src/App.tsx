import { useState, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CHIPS } from './data/chips';
import { GENS, TIERS } from './utils/format';
import { FilterContext } from './hooks/useFilters';
import { Sidebar } from './components/layout/Sidebar';
import { FilterBar } from './components/layout/FilterBar';

const DashboardOverview = lazy(() => import('./pages/DashboardOverview'));
const HeadToHead = lazy(() => import('./pages/HeadToHead'));
const DataTable = lazy(() => import('./pages/DataTable'));
const FeaturesMatrix = lazy(() => import('./pages/FeaturesMatrix'));
const LLMPerformance = lazy(() => import('./pages/LLMPerformance'));
const BenchmarkExplorer = lazy(() => import('./pages/BenchmarkExplorer'));
const CostAnalysis = lazy(() => import('./pages/CostAnalysis'));
const PerfDollar = lazy(() => import('./pages/PerfDollar'));
const LLMBandwidth = lazy(() => import('./pages/LLMBandwidth'));
const FeaturesTimeline = lazy(() => import('./pages/FeaturesTimeline'));
const BudgetPicker = lazy(() => import('./pages/BudgetPicker'));
const UseCaseRanker = lazy(() => import('./pages/UseCaseRanker'));
const BuyingGuide = lazy(() => import('./pages/BuyingGuide'));
const DecisionMatrix = lazy(() => import('./pages/DecisionMatrix'));
const WorkflowNotes = lazy(() => import('./pages/WorkflowNotes'));
const DataSources = lazy(() => import('./pages/DataSources'));

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>Loading...</div>
    </div>
  );
}

export default function App() {
  const [genFilter, setGenFilter] = useState(new Set<string>(GENS));
  const [tierFilter, setTierFilter] = useState(new Set<string>(TIERS));

  const toggleGen = (g: string) => {
    setGenFilter(prev => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
  };

  const toggleTier = (t: string) => {
    setTierFilter(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const filtered = useMemo(
    () => CHIPS.filter(c => genFilter.has(c.gen) && tierFilter.has(c.tier)),
    [genFilter, tierFilter]
  );

  return (
    <BrowserRouter>
      <FilterContext value={{ genFilter, tierFilter, toggleGen, toggleTier, filtered }}>
        <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <FilterBar />
            <main className="flex-1 p-6 max-w-[1320px] mx-auto w-full">
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route index element={<DashboardOverview />} />
                  <Route path="/compare/head-to-head" element={<HeadToHead />} />
                  <Route path="/compare/data-table" element={<DataTable />} />
                  <Route path="/compare/features" element={<FeaturesMatrix />} />
                  <Route path="/analyze/llm" element={<LLMPerformance />} />
                  <Route path="/analyze/benchmarks" element={<BenchmarkExplorer />} />
                  <Route path="/analyze/cost" element={<CostAnalysis />} />
                  <Route path="/analyze/perf-dollar" element={<PerfDollar />} />
                  <Route path="/analyze/llm-bandwidth" element={<LLMBandwidth />} />
                  <Route path="/analyze/features-timeline" element={<FeaturesTimeline />} />
                  <Route path="/guide/budget" element={<BudgetPicker />} />
                  <Route path="/guide/use-cases" element={<UseCaseRanker />} />
                  <Route path="/guide/buying-guide" element={<BuyingGuide />} />
                  <Route path="/guide/decision-matrix" element={<DecisionMatrix />} />
                  <Route path="/guide/workflow" element={<WorkflowNotes />} />
                  <Route path="/reference/sources" element={<DataSources />} />
                </Routes>
              </Suspense>
            </main>
            <footer className="text-center text-[10px] py-4 border-t border-border" style={{ color: 'var(--color-muted)' }}>
              Data: Geekbench Browser, Apple Tech Specs, LocalScore, Macworld, Swappa, Amazon. March 2026 USD.
            </footer>
          </div>
        </div>
      </FilterContext>
    </BrowserRouter>
  );
}
