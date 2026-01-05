import type { SimulationResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatMoney, formatPercent } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface ResultsTableProps {
    results: SimulationResult;
}

export function ResultsTable({ results }: ResultsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detailed Schedule</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 font-medium text-muted-foreground">Year</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Revenue</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">EBITDA</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Interest Rate</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Debt Pmt</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Net Cash Flow</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Cumulative</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.yearlyData.map((row) => (
                            <tr key={row.year} className="border-b last:border-0 hover:bg-muted/50">
                                <td className="py-2">{row.year}</td>
                                <td className="text-right py-2">{formatMoney(row.revenue)}</td>
                                <td className="text-right py-2">{formatMoney(row.ebitda)}</td>
                                <td className="text-right py-2">{formatPercent(row.interestRate)}</td>
                                <td className="text-right py-2 text-destructive">{formatMoney(row.totalDebtService)}</td>
                                <td className={cn("text-right py-2 font-medium", row.netCashFlow < 0 ? "text-red-500" : "text-green-600")}>
                                    {formatMoney(row.netCashFlow)}
                                </td>
                                <td className={cn("text-right py-2", row.cumulativeCashFlow < 0 ? "text-red-500" : "text-muted-foreground")}>
                                    {formatMoney(row.cumulativeCashFlow)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
