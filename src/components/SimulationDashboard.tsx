import { ControlPanel } from './Simulation/ControlPanel';
import { SummaryMetrics } from './Simulation/SummaryMetrics';
import { CashFlowChart } from './Simulation/CashFlowChart';
import { SensitivityChart } from './Simulation/SensitivityChart';
import { ResultsTable } from './Simulation/ResultsTable';
import { useSimulation } from '../hooks/useSimulation';
import { LineChart as LineChartIcon, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface SimulationDashboardProps {
  onBack: () => void;
}

export function SimulationDashboard({ onBack }: SimulationDashboardProps) {
  const { business, setBusiness, debt, setDebt, shock, setShock, results } = useSimulation();

  return (
    <div className="min-h-screen bg-muted/20 animate-in fade-in duration-500">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b h-16 flex items-center px-6 sticky top-0 z-50 justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <LineChartIcon className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight font-heading">RateShock</h1>
        </div>
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
            <ControlPanel
              business={business} setBusiness={setBusiness}
              debt={debt} setDebt={setDebt}
              shock={shock} setShock={setShock}
            />
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-9 space-y-6 pb-20">

            {/* Top Metrics */}
            <SummaryMetrics results={results} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CashFlowChart results={results} shockYear={shock.shockYear} />
              <SensitivityChart business={business} debt={debt} shock={shock} />
            </div>

            {/* Detailed Table */}
            <ResultsTable results={results} />

            {/* Footer / Disclaimers */}
            <div className="text-center text-sm text-muted-foreground pt-8 pb-4">
              <p>This is a simulation for educational purposes only. Does not constitute financial advice.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
