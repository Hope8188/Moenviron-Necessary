import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { label: 'All Products', href: '/shop' },
      { label: 'Clothing', href: '/shop/clothing' },
      { label: 'Accessories', href: '/shop/accessories' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Impact', href: '/impact' },
      { label: 'For Brands', href: '/partners' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Returns Policy', href: '/returns' },
    ],
  };

  return (
    <footer className="bg-[#FBF9F4] border-t border-border">
      <div className="container px-4 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Logo and Contact Info Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2274ce5a-a92d-4b73-b73e-99562f585de3-moenviron-netlify-app/assets/icons/1768031742643-final_logo-01-removebg-preview-1.png"
                alt="Moenviron - Nurturing Nature, Nurturing Life"
                className="h-20 w-auto"
              />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#847062]">
              Transforming textile waste into sustainable fashion. UK collection, Kenya processing, global impact.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#847062]">
                <Mail className="h-4 w-4 text-[#2D5A43]" />
                <a
                  href="mailto:info@moenviron.com"
                  className="hover:text-[#2D5A43] transition-colors"
                >
                  info@moenviron.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#847062]">
                <Phone className="h-4 w-4 text-[#2D5A43]" />
                <a
                  href="tel:+447394382060"
                  className="hover:text-[#2D5A43] transition-colors"
                >
                  +44 7394 382060
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#847062]">
                <MapPin className="h-4 w-4 mt-0.5 text-[#2D5A43]" />
                <span>SP11 9GP, Wiltshire</span>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <a
                href="https://www.linkedin.com/in/moses-onyuro-98336837b/?originalSubdomain=uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/moenviron/?e=26e96327-3a9b-410e-8c0c-6f706b123a22&g=5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@moenviron"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.89-.39-2.8-.09-.94.24-1.85.91-2.29 1.75-.47.88-.43 2.02.12 2.87.61.9 1.76 1.45 2.84 1.25 1.24-.14 2.29-1.15 2.54-2.36.03-2.6.03-5.21.03-7.81V.02z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
                {title}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#847062] transition-colors hover:text-[#2D5A43]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col gap-6 items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-[#847062]">
            © {currentYear} Moenviron. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src="https://flagcdn.com/w20/gb.png"
                alt="UK Flag"
                className="h-3 w-auto"
              />
              <span className="text-[12px] font-medium text-[#847062]">
                Registered in England & Wales
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2274ce5a-a92d-4b73-b73e-99562f585de3-moenviron-netlify-app/assets/svgs/255px-Flag_of_Europe_svg-1.png"
                alt="EU Flag"
                className="h-4 w-auto rounded-[1px]"
              />
              <span className="text-[12px] font-medium text-[#847062]">
                SCA Compliant • GDPR Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
