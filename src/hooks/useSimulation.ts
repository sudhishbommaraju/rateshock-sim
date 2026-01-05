import { useState, useMemo } from 'react';
import type { BusinessParams, DebtParams, ShockParams, SimulationResult } from '../types';
import { runSimulation } from '../lib/rateShock';

const DEFAULT_BUSINESS: BusinessParams = {
    revenue: 1000000,
    growthRate: 0.10,
    expenseMargin: 0.60,
    fixedCosts: 200000,
};

const DEFAULT_DEBT: DebtParams = {
    initialPrincipal: 500000,
    interestRate: 0.05,
    termYears: 10,
};

const DEFAULT_SHOCK: ShockParams = {
    hasShock: true,
    shockYear: 3,
    shockedRate: 0.08,
    isGradual: true,
};

export function useSimulation() {
    const [business, setBusiness] = useState<BusinessParams>(DEFAULT_BUSINESS);
    const [debt, setDebt] = useState<DebtParams>(DEFAULT_DEBT);
    const [shock, setShock] = useState<ShockParams>(DEFAULT_SHOCK);

    const results = useMemo<SimulationResult>(() => {
        // 1. Run Baseline (No Shock) to get NPV Before
        // We force hasShock = false for the baseline run
        const baselineResult = runSimulation(
            business,
            debt,
            { ...shock, hasShock: false }
        );

        // 2. Run Shocked Scenario
        const shockedResult = runSimulation(business, debt, shock);

        // 3. Merge Results
        return {
            ...shockedResult,
            npvBefore: baselineResult.npvAfter, // The "After" of the baseline run is our "Before"
            npvDifference: shockedResult.npvAfter - baselineResult.npvAfter
        };
    }, [business, debt, shock]);

    return {
        business,
        setBusiness,
        debt,
        setDebt,
        shock,
        setShock,
        results
    };
}
