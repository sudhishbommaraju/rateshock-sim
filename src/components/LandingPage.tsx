import { motion } from 'framer-motion';
import { ArrowRight, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
    onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
            {/* Background Gradient Mesh */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-6 py-12 md:py-24 max-w-6xl">
                {/* HERO SECTION */}
                <div className="flex flex-col items-center text-center space-y-8 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-200/20 bg-indigo-500/10 text-indigo-300 text-xs font-medium uppercase tracking-wider"
                    >
                        Financial Simulation V1.0
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300"
                    >
                        Survive the <br />
                        <span className="text-indigo-400">Rate Shock</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
                    >
                        Visualize how interest rate hikes impact business viability, cash flow, and valuation.
                        A professional "what-if" simulator for founders and investors.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Button
                            onClick={onStart}
                            size="lg"
                            className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105"
                        >
                            Launch Simulator <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>

                {/* FEATURES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <FeatureCard
                        icon={<Activity className="w-8 h-8 text-indigo-400" />}
                        title="Stress Test Cash Flow"
                        delay={0.4}
                        description="See exactly when debt service crushes your margins. Model gradual or instant rate hikes."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="w-8 h-8 text-violet-400" />}
                        title="Valuation Sensitivity"
                        delay={0.5}
                        description="Interactive NPV curves show how your company's value changes with the cost of capital."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
                        title="Solvency Check"
                        delay={0.6}
                        description="Instant feedback on debt service coverage ratios and runway sustainability."
                    />
                </div>

                {/* FOOTER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center text-slate-600 text-sm"
                >
                    <p>© 2026 RateShock Labs. Built for educational purposes.</p>
                </motion.div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-colors backdrop-blur-sm"
        >
            <div className="mb-4 p-3 bg-white/5 rounded-xl inline-block">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {description}
            </p>
        </motion.div>
    )
}
