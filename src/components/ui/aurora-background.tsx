"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children: ReactNode;
    showRadialGradient?: boolean;
}

export const AuroraBackground = ({
    className,
    children,
    showRadialGradient = true,
    ...props
}: AuroraBackgroundProps) => {
    return (
        <main>
            <div
                className={cn(
                    "relative flex flex-col  h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900  transition-bg",
                    className
                )}
                {...props}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className={cn(
                            `
            [--white-gradient:linear-gradient(to_bottom,white,transparent)]
            [--dark-gradient:linear-gradient(to_bottom,black,transparent)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_0%,var(--blue-500)_7%,var(--sky-300)_10%,var(--indigo-300)_12%,var(--blue-300)_16%)]
            [--dark-aurora:repeating-linear-gradient(100deg,var(--blue-900)_0%,var(--blue-900)_7%,var(--sky-800)_10%,var(--indigo-900)_12%,var(--blue-800)_16%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--dark-aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--dark-aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
                            showRadialGradient &&
                            `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
                        )}
                    ></div>
                </div>
                {children}
            </div>
        </main>
    );
};
