"use client";

import { useState } from "react";
import { Mail, MapPin, Send, ArrowRight, Globe, Phone, Building2, User, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function ContactHero() {
  return (
    <section className="relative py-8 md:py-12 lg:py-16 flex flex-col items-center justify-center overflow-hidden bg-sand bg-[radial-gradient(circle_at_15%_50%,rgba(226,239,231,1),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(196,223,200,0.5),transparent_50%)]">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-[rgba(196,223,200,0.4)] rounded-full blur-[80px] -top-[30px] -right-[30px] lg:-top-[80px] lg:-right-[80px]" />
        <div className="absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[350px] lg:h-[350px] bg-[rgba(62,229,142,0.1)] rounded-full blur-[80px] bottom-0 -left-[30px] lg:-left-[80px]" />
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 text-center">
        <h1 
          className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-4 tracking-tight text-dark-green leading-[1.05]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Get in <span className="text-forest">Touch</span>
        </h1>
        <p 
          className="text-base md:text-lg lg:text-xl text-dark-green/80 leading-relaxed max-w-3xl mx-auto font-medium mb-4"
        >
          Let's Build the Future of Circular Textiles Together
        </p>
        <p className="text-lg md:text-xl text-text-dark/80 max-w-4xl mx-auto font-medium leading-relaxed">
          Whether you're interested in partnership, investment, or have a general inquiry, we'd love to hear from you.
        </p>
      </div>
    </section>
  );
}

function ContactInfo() {
  const contactMethods = [
    { icon: Mail, title: "Email", value: "info@moenviron.com", description: "For general inquiries" },
    { icon: Phone, title: "Phone", value: "+44 7394 382060", description: "Mon-Fri, 9am-5pm GMT" },
    { icon: MapPin, title: "Location", value: "Wiltshire, SP11 9GP, UK", description: "United Kingdom" },
    { icon: Globe, title: "Global Reach", value: "Europe & Africa", description: "Operating across key markets" }
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contactMethods.map((method, idx) => (
            <div key={idx} className="bg-sand border border-light-green rounded-xl p-4 text-center transition-all duration-300 hover:border-mint hover:shadow-md">
              <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center mx-auto mb-3">
                <method.icon className="w-5 h-5 text-forest" />
              </div>
              <h3 className="text-sm font-bold text-dark-green mb-1">{method.title}</h3>
              <p className="text-sm text-text-dark font-medium">{method.value}</p>
              <p className="text-xs text-text-muted">{method.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
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

  const inquiryTypes = ["Partnership", "Investment", "Services", "General Inquiry"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section className="py-8 md:py-10 bg-sand">
      <div className="max-w-[800px] mx-auto px-4 md:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-green mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Send Us a Message
          </h2>
          <p className="text-text-dark">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-neon-accent/20 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-forest" />
            </div>
            <h3 className="text-xl font-bold text-dark-green mb-2">Thank You!</h3>
            <p className="text-text-dark">We've received your message and will be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 md:p-6 shadow-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-sand/50 border border-mint/50 rounded-xl focus:border-forest focus:ring-2 focus:ring-forest/10 focus:outline-none transition-all font-medium text-text-dark"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-sand/50 border border-mint/50 rounded-xl focus:border-forest focus:ring-2 focus:ring-forest/10 focus:outline-none transition-all font-medium text-text-dark"
                    placeholder="john@organization.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label htmlFor="organization" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                Organization
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-sand/50 border border-mint/50 rounded-xl focus:border-forest focus:ring-2 focus:ring-forest/10 focus:outline-none transition-all font-medium text-text-dark"
                  placeholder="Your organization (optional)"
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label htmlFor="inquiryType" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                Inquiry Type
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/40" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full pl-12 pr-12 py-3 bg-sand/50 border border-mint/50 rounded-xl focus:border-forest focus:ring-2 focus:ring-forest/10 focus:outline-none transition-all font-medium text-text-dark text-left flex items-center justify-between"
                  >
                    <span>{formData.inquiryType || "Select inquiry type"}</span>
                    <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-mint/30 rounded-xl shadow-xl z-10 overflow-hidden">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, inquiryType: type }));
                            setDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 hover:bg-forest/5 cursor-pointer transition-colors font-bold text-dark-green text-left"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label htmlFor="message" className="text-sm font-bold text-dark-green uppercase tracking-wider ml-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full p-4 bg-sand/50 border border-mint/50 rounded-xl focus:border-forest focus:ring-2 focus:ring-forest/10 focus:outline-none transition-all font-medium text-text-dark resize-none"
                placeholder="Tell us about your inquiry..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 group relative overflow-hidden px-8 py-4 bg-neon-accent text-dark-green font-heading font-extrabold text-lg rounded-xl shadow-[0_4px_20px_rgba(62,229,142,0.3)] hover:shadow-[0_8px_40px_rgba(62,229,142,0.5)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="py-8 md:py-10 bg-[#183D32] bg-[radial-gradient(circle_at_top_right,var(--color-forest),transparent_60%)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="relative rounded-[2rem] p-6 md:p-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--color-forest),transparent_70%)] opacity-50" />
          <div className="absolute w-[300px] h-[300px] rounded-full blur-[100px] bg-neon-accent/10 bottom-0 right-0" />
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              Let's Connect
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-5 max-w-3xl mx-auto font-medium leading-relaxed">
              Ready to build the future of circular textiles? We're here to chat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="mailto:info@moenviron.com"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 font-heading font-semibold rounded-full bg-neon-accent text-dark-green shadow-[0_4px_20px_rgba(62,229,142,0.3)] hover:bg-white hover:text-dark-green hover:shadow-[0_8px_30px_rgba(62,229,142,0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                Email Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="tel:+447394382060"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 font-heading font-semibold rounded-full bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ContactHero />
        <ContactInfo />
        <ContactForm />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}