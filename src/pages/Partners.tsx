"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Package, Recycle, TrendingUp, Globe, Handshake, Users, Building2, Briefcase, Mail, Leaf, Globe2, Factory, Truck, ShoppingBag, Network } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

gsap.registerPlugin(ScrollTrigger);

const partnerCategories = [
  {
    id: "collection",
    icon: Package,
    title: "Textile Collection & Waste Organizations",
    description: "We partner with organizations managing post-consumer textiles.",
    collaborations: [
        "Streamlining textile flows",
        "Connecting materials to reuse markets",
        "Improving value recovery"
    ]
  },
  {
    id: "exporters",
    icon: Truck,
    title: "Exporters & Traders",
    description: "We work with established players in the second-hand textile trade.",
    collaborations: [
        "Aligning supply with demand",
        "Enhancing quality-based distribution",
        "Expanding market access"
    ]
  },
  {
    id: "fashion",
    icon: ShoppingBag,
    title: "Fashion Brands & Retailers",
    description: "We support brands transitioning toward circular models.",
    collaborations: [
        "Circular strategy development",
        "Textile recovery programs",
        "Supply chain integration"
    ]
  },
  {
    id: "recycling",
    icon: Factory,
    title: "Recycling & Innovation Partners",
    description: "We engage with organizations developing textile recycling technologies.",
    collaborations: [
        "Feedstock sourcing",
        "Pilot collaborations",
        "Infrastructure development"
    ]
  },
  {
    id: "ecosystem",
    icon: Network,
    title: "Ecosystem & Institutional Partners",
    description: "We connect with networks, programs, and institutions shaping the circular economy.",
    collaborations: [
        "Cross-border initiatives",
        "Research and pilot programs",
        "Market development efforts"
    ]
  }
];

const opportunities = [
    "Textile sourcing and aggregation",
    "Reuse market expansion",
    "Circular supply chain development",
    "Recycling and material innovation",
    "Market entry and regional expansion"
];

const partnershipValues = [
    "Mutual value creation",
    "Clear commercial alignment",
    "Scalable collaboration structures",
    "Long-term ecosystem thinking"
];

const benefits = [
    {
        title: "Access to emerging circular markets",
        description: "Be part of growing markets for post-consumer textiles and recycled materials."
    },
    {
        title: "Integration into structured textile value chains",
        description: "Connect with organized channels that maximize material value and efficiency."
    },
    {
        title: "Strategic positioning within a growing industry",
        description: "Establish your brand at the forefront of textile circularity."
    },
    {
        title: "Collaboration with a forward-looking circular platform",
        description: "Work with a partner committed to long-term industry transformation."
    }
];

export default function Partnership() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const partnersRef = useRef<HTMLDivElement>(null);
    const opportunitiesRef = useRef<HTMLDivElement>(null);
    const howItWorksRef = useRef<HTMLDivElement>(null);
    const benefitsRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Background shapes floating animation
        gsap.to(".bg-shape-1", {
            y: -20,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        gsap.to(".bg-shape-2", {
            y: 20,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5
        });

        // Text entrance animation
        gsap.fromTo(textRef.current, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        gsap.fromTo(".partner-card",
            { y: 60, opacity: 0 },
            {
                y: 0, 
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: partnersRef.current,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(".opportunity-item",
            { x: -30, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: opportunitiesRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(".value-item",
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: howItWorksRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(".benefit-card",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.12,
                scrollTrigger: {
                    trigger: benefitsRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(".cta-content",
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, { scope: containerRef });

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <div ref={containerRef} className="bg-sand bg-[radial-gradient(circle_at_15%_50%,rgba(226,239,231,1),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(196,223,200,0.5),transparent_50%)] pt-20 overflow-hidden">
            {/* Hero Section */}
            <section 
                ref={heroRef}
                className="relative py-20 md:py-28 lg:py-32 flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Background Shapes */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="bg-shape-1 absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-[rgba(196,223,200,0.4)] rounded-full blur-[80px] -top-[30px] -right-[30px] lg:-top-[80px] lg:-right-[80px]" />
                    <div className="bg-shape-2 absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[350px] lg:h-[350px] bg-[rgba(62,229,142,0.1)] rounded-full blur-[80px] bottom-0 -left-[30px] lg:-left-[80px]" />
                </div>

                <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 text-center" ref={textRef}>
                    <h1 
                        className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight text-dark-green leading-[1.05]"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Work With <span className="text-forest">Moenviron</span>
                    </h1>
                    <p 
                        className="text-base md:text-lg lg:text-xl text-dark-green/80 leading-relaxed max-w-3xl mx-auto font-medium mb-8"
                    >
                        Building Circular Systems Together
                    </p>
                    <p className="text-lg md:text-xl text-text-dark/80 max-w-4xl mx-auto font-medium leading-relaxed">
                        Circularity in textiles cannot be achieved by a single organization. 
                        Moenviron works with partners across the value chain to create systems that are connected, scalable, and economically viable.
                    </p>
                </div>
            </section>

            {/* Who We Work With */}
            <section ref={partnersRef} className="py-24 px-6 relative z-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                            Who We Work With
                        </h2>
                        <div className="w-24 h-1.5 bg-neon-accent mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {partnerCategories.map((partner) => (
                            <div key={partner.id} className="partner-card group bg-white border border-light-green rounded-3xl p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
                                <div className="w-16 h-16 rounded-2xl bg-forest/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <partner.icon className="w-8 h-8 text-forest" />
                                </div>
                                <h3 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                                    {partner.title}
                                </h3>
                                <p className="text-lg text-text-dark mb-6 font-medium opacity-80">
                                    {partner.description}
                                </p>
                                <div className="border-t border-forest/10 pt-6">
                                    <p className="text-sm font-bold text-forest uppercase tracking-wider mb-4">How we collaborate:</p>
                                    <ul className="space-y-3">
                                        {partner.collaborations.map((collab, i) => (
                                            <li key={i} className="flex items-start gap-3 text-base text-text-dark font-medium">
                                                <ArrowRight className="w-5 h-5 text-neon-accent mt-0.5 flex-shrink-0" />
                                                {collab}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnership Opportunities */}
            <section ref={opportunitiesRef} className="py-24 px-6 relative z-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_70%)] opacity-30" />
                        
                        <div className="relative z-10">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                                    Partnership Opportunities
                                </h2>
                                <p className="text-xl text-white/70 max-w-2xl mx-auto font-medium">
                                    We are actively seeking partners in the following areas:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {opportunities.map((opp, index) => (
                                    <div key={index} className="opportunity-item flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-neon-accent/50 transition-all duration-300 group">
                                        <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center flex-shrink-0 group-hover:bg-neon-accent group-hover:scale-110 transition-all">
                                            <span className="text-white group-hover:text-dark-green font-bold text-xl">{index + 1}</span>
                                        </div>
                                        <span className="text-lg md:text-xl text-white font-medium">{opp}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How We Work */}
            <section ref={howItWorksRef} className="py-24 px-6 relative z-10">
                <div className="max-w-[1000px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                            How We Work
                        </h2>
                        <div className="w-24 h-1.5 bg-neon-accent mx-auto rounded-full" />
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 md:p-16 shadow-xl border border-mint/30">
                        <p className="text-center text-xl text-text-dark mb-12 font-medium">
                            Our partnership model is built on shared vision and structural alignment:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {partnershipValues.map((value, index) => (
                                <div key={index} className="value-item flex items-center gap-5 p-6 bg-forest/5 rounded-2xl border border-forest/10 hover:bg-forest/10 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-full bg-neon-accent/20 flex items-center justify-center flex-shrink-0">
                                        <Handshake className="w-6 h-6 text-forest" />
                                    </div>
                                    <span className="text-lg font-bold text-dark-green" style={{ fontFamily: "var(--font-heading)" }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Partner With Moenviron */}
            <section ref={benefitsRef} className="py-24 px-6 relative z-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                            Why Partner With Moenviron
                        </h2>
                        <div className="w-24 h-1.5 bg-neon-accent mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-card group bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-mint/30">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-forest/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                        <Leaf className="w-8 h-8 text-forest" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                                            {benefit.title}
                                        </h3>
                                        <p className="text-lg text-text-dark font-medium opacity-80 leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={ctaRef} className="py-16 md:py-20 lg:py-24 relative z-10 mb-20 px-4 md:px-8">
                <div className="max-w-[1200px] mx-auto relative bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)] rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-forest),transparent_70%)] opacity-50" />
                    <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] bg-neon-accent/10 bottom-0 right-0" />

                    <div className="cta-content relative z-10">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                            Start a Partnership
                        </h2>
                        <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                            We are building a global network of partners committed to transforming the textile industry.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <button className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 font-heading font-semibold rounded-full bg-neon-accent text-dark-green shadow-[0_4px_20px_rgba(62,229,142,0.3)] hover:bg-white hover:text-dark-green hover:shadow-[0_8px_30px_rgba(62,229,142,0.5)] hover:-translate-y-1 transition-all duration-300">
                                Become a Partner
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                            <button className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 font-heading font-semibold rounded-full bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300">
                                Schedule a Call
                                <Globe2 className="w-5 h-5 ml-2 text-neon-accent" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}