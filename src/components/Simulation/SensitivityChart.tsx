import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { runSimulation } from '../../lib/rateShock';
import type { BusinessParams, DebtParams, ShockParams } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { formatMoney, formatPercent } from '../../lib/utils';

interface SensitivityChartProps {
    business: BusinessParams;
    debt: DebtParams;
    shock: ShockParams;
}

export function SensitivityChart({ business, debt, shock }: SensitivityChartProps) {

    const data = useMemo(() => {
        // Generate data points for Interest Rate from 0% to 20%
        const points = [];
        for (let r = 0; r <= 0.20; r += 0.01) {
            // Run simulation with this interest rate as the BASELINE (or Shocked? Likely Shocked rate or Base rate?)
            // Requirement: "NPV vs interest rate". 
            // Usually this means "How does the value of the business change if the cost of debt changes?"

            // We will vary the BASELINE interest rate for this curve.
            // Or if we are looking at specific shock sensitivity?
            // Let's vary the `debt.interestRate` (Baseline) and see how it affects NPV.
            // We ignore the "Shock" parameter for this sensitivity curve to just show "Value vs Rate".
            // OR we show "With Shock" vs "Without Shock"?

            // Let's show: NPV at different *Baseline* Interest Rates.
            const simDebt = { ...debt, interestRate: r };
            // We disable shock for this curve to show pure sensitivity to the base rate.
            const res = runSimulation(business, simDebt, { ...shock, hasShock: false });

            points.push({
                rate: r,
                npv: res.npvAfter
            });
        }
        return points;
    }, [business, debt, shock]);

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle>Rate Sensitivity</CardTitle>
                <CardDescription>Estimated NPV at different interest rates</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="rate"
                            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                            type="number"
                            domain={[0, 0.20]}
                        />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            formatter={(value: number | undefined) => [formatMoney(value || 0), "NPV"]}
                            labelFormatter={(label) => `Interest Rate: ${formatPercent(label)}`}
                        />
                        <Legend />
                        {/* Mark current rate */}
                        <ReferenceLine x={debt.interestRate} stroke="blue" label="Current" />

                        <Line type="monotone" dataKey="npv" stroke="hsl(var(--primary))" name="NPV" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
