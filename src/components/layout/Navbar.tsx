import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useCMSContent } from "@/hooks/useCMSContent";

interface NavLink {
  href: string;
  label: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();

  const { data: settingsCms } = useCMSContent("global", "settings");
  const { data: navCms } = useCMSContent("global", "navigation");

  const siteSettings = (settingsCms?.content as Record<string, string>) || {
    siteName: "Moenviron",
    logoUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/2274ce5a-a92d-4b73-b73e-99562f585de3/moenviron-logo-resized-1768037588209.webp?width=400&height=200&resize=contain"
  };

  const navLinks = (navCms?.content as { links: NavLink[] })?.links || [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Initiatives" },
    { href: "/impact", label: "Impact" },
    { href: "/library", label: "Library" },
    { href: "/donate", label: "Donate" },
    { href: "/partners", label: "For Brands" },
    { href: "/shop", label: "Shop" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/80">
      <div className="container flex h-24 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={siteSettings.logoUrl}
            alt={siteSettings.siteName}
            width={356}
            height={200}

            className="h-[6rem] w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.href
                ? "text-primary"
                : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary/80">
              Admin
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>
          </Link>
          {user ? (
            <>
              <Link to="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link to="/contact">
            <Button>Contact Us</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`py-3 text-base font-medium transition-colors hover:text-primary ${location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <Link to="/cart" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Cart
                  {itemCount > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              {user && (
                <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Button>
                </Link>
              )}
              <Link to="/contact" onClick={() => setIsOpen(false)}>
                <Button size="sm">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
