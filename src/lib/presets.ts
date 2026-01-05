import type { BusinessParams, DebtParams } from '../types';

export interface Preset {
    id: string;
    name: string;
    description: string;
    business: BusinessParams;
    debt: DebtParams;
}

export const PRESETS: Preset[] = [
    {
        id: 'saas',
        name: 'SaaS Startup',
        description: 'High growth, high margin, but reliant on future cash flows. Sensitive to discount rates.',
        business: {
            revenue: 1000000,
            growthRate: 0.40, // 40% growth
            expenseMargin: 0.30, // 70% Gross Margin -> but includes Sales? Let's say 30% variable costs.
            fixedCosts: 800000, // High fixed costs (engineering team)
        },
        debt: {
            initialPrincipal: 2000000, // Venture Debt
            interestRate: 0.10, // Higher risk rate
            termYears: 4,
        }
    },
    {
        id: 'real_estate',
        name: 'Leveraged Real Estate',
        description: 'Stable income, highly leveraged. Extremely sensitive to interest rate hikes.',
        business: {
            revenue: 500000, // Rental Income
            growthRate: 0.03, // Inflation matching
            expenseMargin: 0.10, // Low variable costs
            fixedCosts: 50000, // Maintenance, Taxes
        },
        debt: {
            initialPrincipal: 4000000, // 80% LTV maybe?
            interestRate: 0.045,
            termYears: 25,
        }
    },
    {
        id: 'retail',
        name: 'Small Retail Business',
        description: 'Low margin, moderate growth. Rate shocks eat into thin profits quickly.',
        business: {
            revenue: 2000000,
            growthRate: 0.05,
            expenseMargin: 0.75, // COGS is high
            fixedCosts: 300000, // Rent, Staff
        },
        debt: {
            initialPrincipal: 300000, // Inventory loan / fitout
            interestRate: 0.07,
            termYears: 5,
        }
    }
];
