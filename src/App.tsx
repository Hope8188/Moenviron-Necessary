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
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Impact = lazy(() => import("./pages/Impact"));
const Projects = lazy(() => import("./pages/Projects"));
const Partners = lazy(() => import("./pages/Partners"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const Admin = lazy(() => import("./pages/Admin"));
const Profile = lazy(() => import("./pages/Profile"));
const Donate = lazy(() => import("./pages/Donate"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Returns = lazy(() => import("./pages/Returns"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const StaffAuth = lazy(() => import("./pages/StaffAuth"));
const StaffDashboard = lazy(() => import("./pages/StaffDashboard"));
const Library = lazy(() => import("./pages/Library"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <Loader2 className="h-8 w-8 animate-spin text-[#7CC38A]" />
  </div>
);

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
              <Suspense fallback={<LoadingFallback />}>
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
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;