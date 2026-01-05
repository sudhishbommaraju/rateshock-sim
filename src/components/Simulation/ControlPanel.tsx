import type { BusinessParams, DebtParams, ShockParams } from '../../types';
import { PRESETS, type Preset } from '../../lib/presets';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { formatPercent } from '../../lib/utils'; // Assuming this exists or I'll use inline
import { RefreshCcw } from 'lucide-react';

interface ControlPanelProps {
    business: BusinessParams;
    setBusiness: React.Dispatch<React.SetStateAction<BusinessParams>>;
    debt: DebtParams;
    setDebt: React.Dispatch<React.SetStateAction<DebtParams>>;
    shock: ShockParams;
    setShock: React.Dispatch<React.SetStateAction<ShockParams>>;
}

export function ControlPanel({
    business,
    setBusiness,
    debt,
    setDebt,
    shock,
    setShock
}: ControlPanelProps) {

    const applyPreset = (preset: Preset) => {
        setBusiness(preset.business);
        setDebt(preset.debt);
    };

    return (
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] p-1">
            {/* PRESETS */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Scenario</CardTitle>
                    <CardDescription>Select a starting preset</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                    {PRESETS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => applyPreset(p)}
                            className="text-left px-4 py-3 rounded-lg border hover:bg-muted transition-colors text-sm"
                        >
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.description}</div>
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* BUSINESS INPUTS */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Model</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Annual Revenue</Label>
                        <Input
                            type="number"
                            value={business.revenue}
                            onChange={(e) => setBusiness({ ...business, revenue: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Growth Rate</Label>
                            <span className="text-sm">{formatPercent(business.growthRate)}</span>
                        </div>
                        <Slider
                            min="0" max="1" step="0.01"
                            value={business.growthRate}
                            onChange={(e) => setBusiness({ ...business, growthRate: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Expense Ratio (Variable Costs)</Label>
                            <span className="text-sm">{formatPercent(business.expenseMargin)}</span>
                        </div>
                        <Slider
                            min="0" max="1" step="0.01"
                            value={business.expenseMargin}
                            onChange={(e) => setBusiness({ ...business, expenseMargin: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Fixed Costs</Label>
                        <Input
                            type="number"
                            value={business.fixedCosts}
                            onChange={(e) => setBusiness({ ...business, fixedCosts: Number(e.target.value) })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* DEBT STRUCTURE */}
            <Card>
                <CardHeader>
                    <CardTitle>Debt Structure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Initial Principal</Label>
                        <Input
                            type="number"
                            value={debt.initialPrincipal}
                            onChange={(e) => setDebt({ ...debt, initialPrincipal: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Baseline Interest Rate</Label>
                            <span className="text-sm">{formatPercent(debt.interestRate)}</span>
                        </div>
                        <Slider
                            min="0" max="0.20" step="0.001"
                            value={debt.interestRate}
                            onChange={(e) => setDebt({ ...debt, interestRate: Number(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Term (Years)</Label>
                        <Input
                            type="number"
                            value={debt.termYears}
                            onChange={(e) => setDebt({ ...debt, termYears: Number(e.target.value) })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* SHOCK PARAMETERS */}
            <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" /> Rate Shock
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="hasShock"
                            checked={shock.hasShock}
                            onChange={(e) => setShock({ ...shock, hasShock: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="hasShock">Enable Rate Shock</Label>
                    </div>

                    {shock.hasShock && (
                        <>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>New Shocked Rate</Label>
                                    <span className="text-sm font-bold text-red-600">{formatPercent(shock.shockedRate)}</span>
                                </div>
                                <Slider
                                    min="0" max="0.30" step="0.001"
                                    value={shock.shockedRate}
                                    onChange={(e) => setShock({ ...shock, shockedRate: Number(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Shock Starts in Year</Label>
                                <Input
                                    type="number"
                                    min="1" max="10"
                                    value={shock.shockYear}
                                    onChange={(e) => setShock({ ...shock, shockYear: Number(e.target.value) })}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isGradual"
                                    checked={shock.isGradual}
                                    onChange={(e) => setShock({ ...shock, isGradual: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="isGradual">Gradual Increase (over 3 years)</Label>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
