/**
 * Calculates the payment for a loan based on constant payments and a constant interest rate.
 * Mimics Excel's PMT function.
 * @param rate - Annual interest rate (decimal, e.g., 0.05)
 * @param nper - Total number of payments (years)
 * @param pv - Present value (principal)
 * @returns Annual payment (positive number for simpler logic in this app, though Excel returns negative)
 */
export function calculatePMT(rate: number, nper: number, pv: number): number {
    if (rate === 0) return pv / nper;
    const pmt = (rate * pv) / (1 - Math.pow(1 + rate, -nper));
    return pmt;
}

/**
 * Calculates the Net Present Value of a series of cash flows.
 * @param rate - Discount rate (decimal)
 * @param cashFlows - Array of cash flow values (year 0 is usually initial investment, but here we treat index 0 as Year 1 for discounting if we pass strictly future flows. 
 * HOWEVER, standard NPV assumes index 0 is time 0. 
 * For this sim, we likely pass a stream of [Year 1, Year 2...]. 
 * So we will discount index `i` by `(1+r)^(i+1)`.
 */
export function calculateNPV(rate: number, cashFlows: number[]): number {
    return cashFlows.reduce((acc, val, index) => {
        return acc + val / Math.pow(1 + rate, index + 1);
    }, 0);
}
