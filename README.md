# RateShock

RateShock is a financial reasoning simulator designed to help users understand how changes in interest rates ("rate shocks") affect business viability, cash flows, and valuation.

## Features

- **Dynamic Business Modeling**: Configure Revenue, Growth, Margins, and Debt structure.
- **Scenario Presets**: Instantly load SaaS, Real Estate, or Retail scenarios.
- **Rate Shock Simulator**: Visualize what happens if interest rates spike instantly or gradually.
- **Interactive Visualizations**:
  - **Cash Flow Projections**: See Revenue vs Debt Service over time.
  - **Sensitivity Analysis**: View NPV impact across a range of interest rates.
- **Viability Checking**: Automatic detection of solvency risks (Debt Service Coverage).

## Assumptions & Methodology

### Financial Formulas
- **Debt Service**: Standard Amortization (PMT) calculation. Payments are re-calculated annually based on the *current* interest rate and *remaining* principal/term.
- **NPV (Net Present Value)**: Calculated using a fixed market discount rate (8%) to allow comparison between "Before" and "After" scenarios without circular logic (i.e. we don't use the changing interest rate as the discount rate for value, though it affects the *cost* of debt).

### Limitations
- **Tax**: The model ignores corporate tax impacts (Tax Shield) for simplicity.
- **Prepayment**: Does not model early debt repayment or refinancing costs beyond the rate change.
- **Inflation**: Real vs Nominal rates are not distinguished; all inputs are assumed to be nominal.
- **Complexity**: Variable costs are linear; fixed costs are constant. Real businesses have steps and non-linearities.

## Running Locally

1. Install dependencies: \`npm install\`
2. Start dev server: \`npm run dev\`
