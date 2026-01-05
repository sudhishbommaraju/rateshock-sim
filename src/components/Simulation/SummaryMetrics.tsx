import type { SimulationResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatMoney } from '../../lib/utils';
import { AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';

interface SummaryMetricsProps {
    results: SimulationResult;
}

export function SummaryMetrics({ results }: SummaryMetricsProps) {
    // Calculate average DSCR (Debt Service Coverage Ratio)
    // Sum EBITDA / Sum Debt Service
    const totalEbitda = results.yearlyData.reduce((acc, y) => acc + y.ebitda, 0);
    const totalDebtService = results.yearlyData.reduce((acc, y) => acc + y.totalDebtService, 0);
    const avgDSCR = totalDebtService > 0 ? totalEbitda / totalDebtService : 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* NPV Impact */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">NPV Impact (Rate Shock)</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatMoney(results.npvDifference)}</div>
                    <p className="text-xs text-muted-foreground">
                        From {formatMoney(results.npvBefore)} to {formatMoney(results.npvAfter)}
                    </p>
                </CardContent>
            </Card>

            {/* Solvency Status */}
            <Card className={results.isSolvent ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Business Viability</CardTitle>
                    {results.isSolvent ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className={results.isSolvent ? "text-2xl font-bold text-green-700" : "text-2xl font-bold text-red-700"}>
                        {results.isSolvent ? "Sustainable" : "At Risk"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {results.isSolvent
                            ? "Debt service is covered by EBITDA."
                            : `Cash flow failure detected in Year ${results.insolvencyYear}.`}
                    </p>
                </CardContent>
            </Card>

            {/* Coverage Ratio */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Debt Coverage Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{avgDSCR.toFixed(2)}x</div>
                    <p className="text-xs text-muted-foreground">
                        Target &gt; 1.25x for safety
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
