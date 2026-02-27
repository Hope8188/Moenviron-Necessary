import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageTracker } from "@/components/PageTracker";
import ScrollToTop from "@/components/layout/ScrollToTop";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Index from "./pages/Index";
import HoverReceiver from "@/visual-edits/VisualEditsMessenger";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Impact from "./pages/Impact";
import Projects from "./pages/Projects";
import Partners from "./pages/Partners";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Donate from "./pages/Donate";
import Wishlist from "./pages/Wishlist";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Returns from "./pages/Returns";
import NotFound from "./pages/NotFound";
import OrderTracking from "./pages/OrderTracking";
import StaffAuth from "./pages/StaffAuth";
import StaffDashboard from "./pages/StaffDashboard";

import Library from "./pages/Library";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HoverReceiver />
            <BrowserRouter>
              <ScrollToTop />
              <WhatsAppButton />
              <PageTracker />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/library" element={<Library />} />
                <Route path="/about" element={<About />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin-login" element={<AdminAuth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/orders/:id" element={<OrderTracking />} />
                <Route path="/staff-login" element={<StaffAuth />} />
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;