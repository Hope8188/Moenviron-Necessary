import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Loader2, Send } from "lucide-react";
import { useCMSContent } from "@/hooks/useCMSContent";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NavLink {
  href: string;
  label: string;
}

export function Footer() {
  const navigate = useNavigate();
  const { data: settingsCms } = useCMSContent("global", "settings");
  const { data: navCms } = useCMSContent("global", "navigation");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error">("idle");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, source: "footer" });

      if (error) {
        if (error.code === "23505") {
          setSubscribeStatus("success");
        } else {
          throw error;
        }
      } else {
        setSubscribeStatus("success");
      }
      setEmail("");
    } catch {
      setSubscribeStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    }
  };

  interface SiteSettings {
    siteName?: string;
    logoUrl?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    footerText?: string;
  }

  interface NavContent {
    links?: NavLink[];
  }

  const settingsContent = (settingsCms?.content || {}) as SiteSettings;

  const cmsContactEmailRaw = (settingsContent.contactEmail || "").trim();
  const cmsContactEmail = cmsContactEmailRaw.toLowerCase();
  const contactEmail =
    !cmsContactEmailRaw || cmsContactEmail === "moses@moenviron.com"
      ? "info@moenviron.com"
      : cmsContactEmailRaw;

  const siteSettings = {
    siteName: settingsContent.siteName || "Moenviron",
    logoUrl:
      settingsContent.logoUrl ||
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/2274ce5a-a92d-4b73-b73e-99562f585de3/moenviron-logo-resized-1768037588209.webp?width=400&height=200&resize=contain",
    contactEmail,
    contactPhone: settingsContent.contactPhone || "+44 7394 382060",
    address: settingsContent.address || "Wiltshire, SP11 9GP, United Kingdom",
    footerText:
      settingsContent.footerText ||
      "Pioneering the circular economy through sustainable fashion. Ethical UK collection, advanced Kenya processing, and measurable global impact.",
  };

  const navContent = (navCms?.content || {}) as NavContent;
  const navLinks: NavLink[] = navContent.links || [
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About Us" },
    { href: "/impact", label: "Our Impact" },
    { href: "/partners", label: "For Brands" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLinkClick = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              {siteSettings.siteName}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {siteSettings.footerText}
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:info@moenviron.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                info@moenviron.com
              </a>
              <a href={`tel:${siteSettings.contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                {siteSettings.contactPhone}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {siteSettings.address}
              </span>
            </div>
            <div className="flex gap-4 pt-4">
              <a
                href="https://www.linkedin.com/in/moses-onyuro-98336837b/?originalSubdomain=uk"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 text-muted-foreground hover:text-primary transition-all inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/20 hover:scale-110 active:scale-95"
                aria-label="Follow Moenviron on LinkedIn"
              >
                <Linkedin className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/moenviron/?e=26e96327-3a9b-410e-8c0c-6f706b123a22&g=5"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 text-muted-foreground hover:text-primary transition-all inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/20 hover:scale-110 active:scale-95"
                aria-label="Follow Moenviron on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.tiktok.com/@moenviron"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 text-muted-foreground hover:text-primary transition-all inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/20 hover:scale-110 active:scale-95"
                aria-label="Follow Moenviron on TikTok"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.89-.39-2.8-.09-.94.24-1.85.91-2.29 1.75-.47.88-.43 2.02.12 2.87.61.9 1.76 1.45 2.84 1.25 1.24-.14 2.29-1.15 2.54-2.36.03-2.6.03-5.21.03-7.81V.02z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@moenvironlimited?si=S9WWNrgmvRWN962T"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 text-muted-foreground hover:text-primary transition-all inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/20 hover:scale-110 active:scale-95"
                aria-label="Follow Moenviron on YouTube"
              >
                <Youtube className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Navigation</h4>
              <ul className="space-y-2">
                {navLinks.map((link: NavLink) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleLinkClick("/privacy")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => handleLinkClick("/terms")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</button></li>
                <li><button onClick={() => handleLinkClick("/returns")} className="text-sm text-muted-foreground hover:text-primary transition-colors">Returns Policy</button></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="mb-4 font-semibold text-foreground">Newsletter</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Get updates on sustainable fashion and exclusive offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <label htmlFor="footer-newsletter-email" className="sr-only">Email for newsletter</label>
                <input
                  id="footer-newsletter-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  autoComplete="email"
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
              {subscribeStatus === "success" && (
                <p className="text-xs text-green-500 mt-2">Subscribed successfully!</p>
              )}
              {subscribeStatus === "error" && (
                <p className="text-xs text-red-500 mt-2">Something went wrong. Try again.</p>
              )}
              <div className="mt-4 flex items-center gap-4">
                <img
                  src="https://flagcdn.com/w160/eu.png"
                  alt="UK/EU Partnership"
                  width="20"
                  height="14"
                  className="h-3.5 w-auto opacity-70 grayscale hover:grayscale-0 transition-all"
                />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                  SCA Compliant • GDPR Ready
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground italic">
            Nurturing Nature, Nurturing Life.
          </p>
        </div>
      </div>
    </footer>
  );
}
