import type { BusinessParams, DebtParams, ShockParams, SimulationResult, YearResult } from '../types';
import { calculatePMT, calculateNPV } from './financial';

export const SIMULATION_YEARS = 10;

export function runSimulation(
    business: BusinessParams,
    debt: DebtParams,
    shock: ShockParams
): SimulationResult {
    const yearlyData: YearResult[] = [];

    let currentRevenue = business.revenue;
    let remainingPrincipal = debt.initialPrincipal;
    let cumulativeCashFlow = 0;

    // We track insolvency
    let isSolvent = true;
    let insolvencyYear: number | null = null;

    // Loop for predefined horizon (e.g. 10 years)
    for (let year = 1; year <= SIMULATION_YEARS; year++) {
        // 1. Determine Interest Rate for this year
        let effectiveRate = debt.interestRate;

        if (shock.hasShock && year >= shock.shockYear) {
            if (shock.isGradual) {
                // Gradual: Phase in over 3 years
                const phase = Math.min(year - shock.shockYear + 1, 3); // 1, 2, or 3
                // Interpolate: e.g. Base=5%, Shock=10%. 
                // Year 1 of shock: 5 + (5/3)*1 = 6.66% ?? 
                // Better: Linear interpolation.
                const totalDelta = shock.shockedRate - debt.interestRate;
                const currentDelta = (totalDelta / 3) * phase;
                effectiveRate = debt.interestRate + currentDelta;
            } else {
                // Instant
                effectiveRate = shock.shockedRate;
            }
        }

        // 2. Business Metrics
        // Growth applies to Previous Year's revenue.
        if (year > 1) {
            currentRevenue = currentRevenue * (1 + business.growthRate);
        }

        const variableCosts = currentRevenue * business.expenseMargin;
        const opex = variableCosts + business.fixedCosts;
        const ebitda = currentRevenue - opex;

        // 3. Debt Service (Standard Mortgage Style Amortization Logic, RE-CALCULATED if rate changes??)
        // Real-world floating rate loans often recalculate payment to amortize remaining principal over remaining term.
        // Let's assume:
        // - Term matches the simulation or is fixed.
        // - If rate changes, we recalculate payment for the *remaining* term to clear the debt.

        const remainingYears = Math.max(debt.termYears - (year - 1), 1);

        // Safety check: if principal is already 0, no payment.
        let payment = 0;
        let interestExpense = 0;
        let principalPayment = 0;

        if (remainingPrincipal > 0) {
            // Recalculate PMT based on NEW effective rate and REMAINING principal/term
            payment = calculatePMT(effectiveRate, remainingYears, remainingPrincipal);

            // Calculate interest portion
            interestExpense = remainingPrincipal * effectiveRate;

            // Cap payment if it exceeds total debt + interest (unlikely with this formula but good for last year)
            // Actually PMT formula handles full amortization.

            // Principal portion
            principalPayment = payment - interestExpense;

            // Update Principal
            remainingPrincipal -= principalPayment;

            // Handle precision drift or tiny remainders
            if (remainingPrincipal < 1) remainingPrincipal = 0;
        }

        const totalDebtService = interestExpense + principalPayment;
        const netCashFlow = ebitda - totalDebtService;
        cumulativeCashFlow += netCashFlow;

        // Check Solvency: strict definition -> if Net Cash Flow is negative? Or if Cumulative is negative?
        // Let's definition: If Cash Flow < 0, they are burning cash. 
        // If we assume they have NO cash reserves (worst case), negative cash flow = trouble.
        // But usually businesses have some buffer.
        // Let's mark insolvency if Cumulative Cash Flow goes < -debt.initialPrincipal * 0.2 (20% buffer)?? 
        // OR simpler: Just flag years with negative cash flow.
        // User requirement: "survival vs failure".
        // Let's say: Failure if Net Cash Flow < 0 for 2 consecutive years? 
        // Or just simple: Net Cash Flow < 0 is "Cash Burn".
        // For the "Result", let's say Insolvency = Cumulative Cash Flow < 0 (meaning you haven't made back your investment? No, that's Break Even).
        // Let's define SOLVENCY as: Can pay debt service. 
        // If EBITDA < InterestExpense, that's a hard default usually.
        // If EBITDA < TotalDebtService, that's a liquidity crunch.
        // Let's call "Insolvency" if (Net Cash Flow < -0.1 * Revenue) (burning >10% of rev). 
        // Let's keep it simple: returns Solvency as boolean based on if they ever run out of cash? 
        // actually, let's just track "Cash Balance" starting at 0. If it goes negative, they need external funding.
        // Let's stick to "Is Solvent" = "Net Cash Flow >= 0" for simplicity in this MVP, 
        // or maybe "Cumulative Cash Flow never drops below start-up cost".
        // Let's use a "Runway" concept but we don't have "Starting Cash" input.
        // Pivot: Let's assume specific Solvency rule: "EBITDA >= Interest Expense" (Interest Coverage Ratio >= 1.0).
        const icr = interestExpense > 0 ? ebitda / interestExpense : 100;
        if (icr < 1.0) {
            isSolvent = false;
            if (insolvencyYear === null) insolvencyYear = year;
        }

        yearlyData.push({
            year,
            revenue: currentRevenue,
            opex,
            ebitda,
            interestRate: effectiveRate,
            interestExpense,
            principalPayment,
            remainingPrincipal,
            totalDebtService,
            netCashFlow,
            cumulativeCashFlow
        });
    }

    // NPV Calculations
    // Baseline for NPV: usually 10% discount rate for SaaS, maybe 5% for Real Estate.
    // We can calculate NPV using a standard WACC or just the Baseline Rate as the discount rate?
    // Let's use the Baseline Interest Rate as the Discount Rate (Cost of Debt) for simplicity, 
    // or maybe add a "Discount Rate" inputs? 
    // For now, use 8% as default market discount rate or just use the Baseline Rate.
    // Requirement says "Cost of capital", which usually implies we should calculate it or ask for it.
    // Let's just use debt.interestRate as the discount rate for "Before" and "After" comparison? 
    // No, that changes. Let's fix a "Market Discount Rate" of 8% for the NPV calculation to be comparable.
    const DISCOUNT_RATE = 0.08;

    const cashFlows = yearlyData.map(y => y.netCashFlow);
    const npv = calculateNPV(DISCOUNT_RATE, cashFlows);

    // To calculate "NPV Before Shock", we need to run a simulation WITHOUT shock.
    // This function assumes one run. 
    // We will run this function TWICE in the hook.

    return {
        yearlyData,
        npvBefore: 0, // Filled by parent
        npvAfter: npv, // This run's NPV
        npvDifference: 0,
        isSolvent,
        insolvencyYear
    };
}
