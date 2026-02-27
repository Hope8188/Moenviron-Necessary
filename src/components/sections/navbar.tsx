import React from 'react';
import { ShoppingBag, User, Menu } from 'lucide-react';

/**
 * Navbar component for Moenviron
 * Features a sticky glass-effect navigation with logo, centered links, and right-side action buttons.
 */
const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80">
      <div className="container flex h-24 items-center justify-between">
        {/* Logo Section */}
        <a className="flex items-center" href="/">
          <img 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/2274ce5a-a92d-4b73-b73e-99562f585de3-moenviron-netlify-app/assets/icons/1768031742643-final_logo-01-removebg-preview-1.png" 
            alt="Moenviron - Nurturing Nature, Nurturing Life" 
            className="h-20 w-auto"
            style={{ 
              display: 'block', 
              width: '352.875px', 
              height: '80px',
              objectFit: 'contain'
            }}
          />
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a 
            className="text-sm font-medium transition-colors hover:text-primary text-primary" 
            href="/"
          >
            Home
          </a>
          <a 
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground" 
            href="/about"
          >
            About
          </a>
          <a 
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground" 
            href="/donate"
          >
            Donate
          </a>
          <a 
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground" 
            href="/impact"
          >
            Impact
          </a>
          <a 
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground" 
            href="/partners"
          >
            For Brands
          </a>
        </div>

        {/* Action Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <a href="/cart" className="block">
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10 relative"
              style={{ borderRadius: '10px' }}
            >
              <ShoppingBag className="h-5 w-5" style={{ color: 'rgb(40, 29, 21)' }} />
            </button>
          </a>
          <a href="/auth" className="block">
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
              style={{ borderRadius: '10px' }}
            >
              <User className="h-5 w-5" style={{ color: 'rgb(40, 29, 21)' }} />
            </button>
          </a>
          <a href="/contact" className="block">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Contact Us
            </button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="flex h-10 w-10 items-center justify-center md:hidden" 
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" style={{ color: 'rgb(40, 29, 21)' }} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;