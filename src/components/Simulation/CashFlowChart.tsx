import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import type { SimulationResult } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { formatMoney } from '../../lib/utils';

interface CashFlowChartProps {
    results: SimulationResult;
    shockYear: number;
}

export function CashFlowChart({ results, shockYear }: CashFlowChartProps) {

    const data = results.yearlyData;

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle>Cash Flow Projections</CardTitle>
                <CardDescription>Revenue vs Costs vs Debt Service</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            formatter={(value: number | undefined) => [formatMoney(value || 0), ""]}
                            labelFormatter={(label) => `Year ${label}`}
                        />
                        <Legend />
                        <ReferenceLine x={shockYear} stroke="red" strokeDasharray="3 3" label={{ value: "Shock", position: 'top', fill: 'red' }} />

                        <Bar dataKey="revenue" stackId="a" fill="hsl(var(--primary))" name="Revenue" />
                        <Bar dataKey="opex" stackId="b" fill="hsl(var(--muted-foreground))" name="OpEx" />
                        <Bar dataKey="totalDebtService" stackId="b" fill="hsl(var(--destructive))" name="Debt Service" />

                        {/* Net Cash Flow Line? Or just separate chart. Let's stack Revenue vs Expenses (OpEx + Debt). The difference is Net. */}

                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
