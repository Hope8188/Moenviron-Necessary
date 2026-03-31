"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Send, ArrowRight, Globe, Phone, Building2, User, MessageSquare, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

gsap.registerPlugin(ScrollTrigger);

const inquiryTypes = [
    "Partnership",
    "Investment",
    "Services",
    "General Inquiry"
];

const locations = [
    "Europe",
    "Africa",
    "Emerging textile trade corridors"
];

export default function Contact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        organization: "",
        email: "",
        inquiryType: "",
        message: ""
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

        gsap.fromTo(".contact-info-card",
            { y: 40, opacity: 0 },
            {
                y: 0, 
                opacity: 1,
                duration: 0.6,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: infoRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(".form-container",
            { y: 50, opacity: 0 },
            {
                y: 0, 
                opacity: 1,
                duration: 0.8,
                scrollTrigger: {
                    trigger: formRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        gsap.fromTo(".cta-content",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, { scope: containerRef });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectInquiry = (type: string) => {
        setFormData(prev => ({ ...prev, inquiryType: type }));
        setDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setSubmitted(true);
    };

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
                        Get in Touch
                    </h1>
                    <p 
                        className="text-base md:text-lg lg:text-xl text-dark-green/80 leading-relaxed max-w-3xl mx-auto font-medium mb-8"
                    >
                        Let's Build the Future of Circularity Together
                    </p>
                    <p className="text-lg md:text-xl text-text-dark/80 max-w-4xl mx-auto font-medium leading-relaxed">
                        Whether you are exploring partnership opportunities, investment, or collaboration, we'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Information Cards */}
            <section ref={infoRef} className="py-16 px-6 relative z-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Email */}
                        <div className="contact-info-card group bg-white border border-light-green rounded-3xl p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
                            <div className="w-16 h-16 rounded-2xl bg-light-green text-forest flex items-center justify-center mb-5 group-hover:bg-neon-accent/20 transition-all duration-300">
                                <Mail className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "#183D32" }}>Email Us</h3>
                            <a href="mailto:info@moenviron.com" className="text-lg font-bold text-forest hover:text-dark-green transition-colors break-words">
                                info@moenviron.com
                            </a>
                        </div>

                        {/* Partnerships */}
                        <div className="contact-info-card group bg-white border border-light-green rounded-3xl p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
                            <div className="w-16 h-16 rounded-2xl bg-light-green text-forest flex items-center justify-center mb-5 group-hover:bg-neon-accent/20 transition-all duration-300">
                                <Building2 className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "#183D32" }}>Partnerships</h3>
                            <a href="mailto:partnerships@moenviron.com" className="text-lg font-bold text-forest hover:text-dark-green transition-colors break-words">
                                partnerships@moenviron.com
                            </a>
                        </div>

                        {/* Operations */}
                        <div className="contact-info-card group bg-white border border-light-green rounded-3xl p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(30,58,47,0.08)] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(30,58,47,0.1)] hover:border-mint transition-all duration-400">
                            <div className="w-16 h-16 rounded-2xl bg-light-green text-forest flex items-center justify-center mb-5 group-hover:bg-neon-accent/20 transition-all duration-300">
                                <Globe className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "#183D32" }}>Operations</h3>
                            <div className="space-y-1">
                                {locations.map((loc, index) => (
                                    <p key={index} className="text-text-dark font-medium opacity-80">{loc}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section ref={formRef} className="py-24 px-6 relative z-10">
                <div className="max-w-[1200px] mx-auto">
                    <div className="form-container relative bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 lg:p-20 shadow-2xl border border-mint/30 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--color-mint),transparent_50%)] opacity-30 pointer-events-none" />
                        
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-5xl font-bold text-dark-green mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                                    Send Us a Message
                                </h2>
                                <div className="w-24 h-1.5 bg-neon-accent mx-auto rounded-full" />
                            </div>

                            {submitted ? (
                                <div className="bg-forest/5 rounded-[2.5rem] p-12 text-center border border-forest/10">
                                    <div className="w-20 h-20 rounded-full bg-neon-accent flex items-center justify-center mx-auto mb-8 shadow-lg">
                                        <Send className="w-10 h-10 text-dark-green" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>Message Sent!</h3>
                                    <p className="text-xl text-text-dark font-medium">Thank you for reaching out. Our team will get back to you within 24-48 hours.</p>
                                    <button 
                                        onClick={() => setSubmitted(false)}
                                        className="mt-8 text-forest font-bold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Full Name */}
                                    <div className="space-y-3">
                                        <label htmlFor="fullName" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                                            <input
                                                type="text"
                                                id="fullName"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-14 pr-6 py-5 bg-sand/50 border border-mint/50 rounded-2xl focus:border-forest focus:ring-4 focus:ring-forest/5 focus:outline-none transition-all font-medium text-text-dark"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-3">
                                        <label htmlFor="email" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-14 pr-6 py-5 bg-sand/50 border border-mint/50 rounded-2xl focus:border-forest focus:ring-4 focus:ring-forest/5 focus:outline-none transition-all font-medium text-text-dark"
                                                placeholder="john@organization.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Organization */}
                                    <div className="space-y-3">
                                        <label htmlFor="organization" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                                            Organization
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                                            <input
                                                type="text"
                                                id="organization"
                                                name="organization"
                                                value={formData.organization}
                                                onChange={handleInputChange}
                                                className="w-full pl-14 pr-6 py-5 bg-sand/50 border border-mint/50 rounded-2xl focus:border-forest focus:ring-4 focus:ring-forest/5 focus:outline-none transition-all font-medium text-text-dark"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                    </div>

                                    {/* Inquiry Type */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                                            Inquiry Type
                                        </label>
                                        <div className="relative">
                                            <div 
                                                className="w-full pl-14 pr-12 py-5 bg-sand/50 border border-mint/50 rounded-2xl focus:border-forest focus:ring-4 focus:ring-forest/5 focus:outline-none transition-all cursor-pointer flex items-center font-medium"
                                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                            >
                                                <MessageSquare className="absolute left-5 w-5 h-5 text-forest/40" />
                                                <span className={formData.inquiryType ? "text-text-dark" : "text-text-dark/40"}>
                                                    {formData.inquiryType || "Select Type"}
                                                </span>
                                                <ChevronDown className={`absolute right-5 w-5 h-5 text-forest/40 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                            </div>
                                            
                                            {dropdownOpen && (
                                                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-mint/30 rounded-[1.5rem] shadow-2xl z-20 overflow-hidden py-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                                    {inquiryTypes.map((type, index) => (
                                                        <div
                                                            key={index}
                                                            className="px-6 py-4 hover:bg-forest/5 cursor-pointer transition-colors font-bold text-dark-green border-b border-forest/5 last:border-0"
                                                            onClick={() => handleSelectInquiry(type)}
                                                        >
                                                            {type}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="md:col-span-2 space-y-3">
                                        <label htmlFor="message" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                                            Message
                                        </label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-5 top-6 w-5 h-5 text-forest/40" />
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                rows={6}
                                                className="w-full pl-14 pr-6 py-5 bg-sand/50 border border-mint/50 rounded-2xl focus:border-forest focus:ring-4 focus:ring-forest/5 focus:outline-none transition-all font-medium text-text-dark resize-none"
                                                placeholder="Tell us how we can help..."
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="md:col-span-2 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full group relative overflow-hidden px-10 py-6 bg-neon-accent text-dark-green font-heading font-extrabold text-xl rounded-2xl shadow-[0_4px_20px_rgba(62,229,142,0.3)] hover:shadow-[0_8px_40px_rgba(62,229,142,0.5)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Message
                                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Footer */}
            <section ref={ctaRef} className="py-20 md:py-32 relative z-10 mb-20 px-4">
                <div className="max-w-[1200px] mx-auto text-center">
                    <div className="cta-content">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-dark-green mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                            Let's Start the Conversation
                        </h2>
                        <div className="w-24 h-2 bg-neon-accent mx-auto rounded-full mb-8 shadow-sm" />
                        <p className="text-xl md:text-2xl text-text-dark font-medium max-w-2xl mx-auto opacity-70">
                            We aim to respond to all inquiries within 12 - 24 hours. 
                        </p>
                    </div>
                </div>
            </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}