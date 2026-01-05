export interface BusinessParams {
    revenue: number;
    growthRate: number; // percentage (e.g., 0.10 for 10%)
    expenseMargin: number; // percentage of revenue (e.g. 0.30 for 30%)
    fixedCosts: number;
}

export interface DebtParams {
    initialPrincipal: number;
    interestRate: number; // annual rate (e.g. 0.05)
    termYears: number;
}

export interface ShockParams {
    hasShock: boolean;
    shockYear: number; // Year the shock starts (1-based)
    shockedRate: number; // New interest rate
    isGradual: boolean; // If true, ramps up over 3 years
}

export interface YearResult {
    year: number;
    revenue: number;
    opex: number;
    ebitda: number;

    // Debt
    interestRate: number;
    interestExpense: number;
    principalPayment: number;
    remainingPrincipal: number;
    totalDebtService: number;

    // Net
    netCashFlow: number;
    cumulativeCashFlow: number;
}

export interface SimulationResult {
    yearlyData: YearResult[];
    npvBefore: number;
    npvAfter: number;
    npvDifference: number;
    isSolvent: boolean;
    insolvencyYear: number | null; // null if solvent
}
