import { motion } from "motion/react";
import { Recycle, Search, Scissors, CheckCircle, Package, Truck } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Collection",
        description: "Ethically sourced from UK textile waste streams",
    },
    {
        icon: Scissors,
        title: "Upcycling",
        description: "Artisan-crafted into unique, high-quality circular pieces",
    },
    {
        icon: CheckCircle,
        title: "Quality Hub",
        description: "Inspected for durability and premium finish",
    },
    {
        icon: Package,
        title: "Eco-Packed",
        description: "Wrapped in 100% biodegradable materials",
    },
    {
        icon: Truck,
        title: "Delivered",
        description: "Shipped directly to you via carbon-neutral partners",
    },
];

export const SustainableJourney = () => {
    return (
        <div className="mt-12 space-y-8">
            <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-[#7CC38A]" />
                <h3 className="text-xl font-display font-medium">The Sustainable Journey</h3>
            </div>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-100 md:left-0 md:top-6 md:h-0.5 md:w-full" />

                <div className="grid gap-8 md:grid-cols-5 md:gap-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-4 md:flex-col md:items-center md:text-center md:gap-6"
                        >
                            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-zinc-100 shadow-sm transition-all duration-500 hover:border-[#7CC38A] hover:bg-[#7CC38A]/5 group">
                                <step.icon className="h-5 w-5 text-zinc-400 group-hover:text-[#2D5A43] transition-colors" />
                            </div>

                            <div className="space-y-1">
                                <h4 className="font-bold text-sm uppercase tracking-widest text-[#1A1A1A]">
                                    {step.title}
                                </h4>
                                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
