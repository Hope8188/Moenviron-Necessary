import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("newsletter-popup-seen");
    if (hasSeenPopup) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 15000); // 15s — let visitors browse before asking for email
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("newsletter-popup-seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, is_active: true, source: "popup" });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed",
            description: "This email is already on our list!",
          });
        } else {
          throw error;
        }
      } else {
        // Try to sync to MailerLite in the background
        try {
          await supabase.functions.invoke("sync-to-mailerlite", {
            body: { action: "sync" },
          });
        } catch (syncError) {
          console.log("MailerLite sync skipped:", syncError);
        }

        toast({
          title: "Welcome to the movement",
          description: "You've successfully joined our newsletter.",
        });
      }
      handleClose();
    } catch (err) {
      console.error("Newsletter signup error:", err);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-[800px] p-0 overflow-hidden border-none bg-transparent"
        aria-labelledby="newsletter-title"
        aria-describedby="newsletter-description"
        aria-label="Newsletter Signup"
      >
        <div className="flex flex-col md:flex-row h-full bg-white rounded-xl md:rounded-none overflow-hidden">
          {/* Image Section — hidden on very small phones, shorter on medium */}
          <div className="hidden sm:block w-full md:w-1/2 relative h-48 sm:h-56 md:h-[500px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop&q=80&auto=format"
              alt="Artisan Craftsmanship"
              width={400}
              height={500}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">Vol. 01 Edition</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center relative bg-[#F9F7F2]">
            <div className="space-y-4 md:space-y-6">
              <div>
                <DialogTitle id="newsletter-title" className="sr-only">Join Our Newsletter</DialogTitle>
                <DialogDescription id="newsletter-description" className="sr-only">
                  Sign up to receive updates on circular fashion collection drops and artisan stories.
                </DialogDescription>
                <h3 className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#2D5A43] mb-3 md:mb-4">Newsletter</h3>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display leading-tight mb-3 md:mb-4">Join Our <br className="hidden sm:block" />Circular World</h2>
                <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                  Get exclusive access to collection drops, artisan stories, and circular economy insights.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-black/20 group-focus-within:text-black transition-colors" />
                  <label htmlFor="popup-newsletter-email" className="sr-only">Your email address</label>
                  <Input
                    id="popup-newsletter-email"
                    name="email"
                    type="email"
                    placeholder="YOUR EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent border-0 border-b border-black/10 rounded-none pl-7 h-11 md:h-12 py-3 text-[10px] sm:text-xs font-bold tracking-widest focus-visible:ring-0 focus-visible:border-black transition-all placeholder:text-black/20"
                    required
                    autoComplete="email"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 md:h-14 bg-black text-white rounded-none font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-black/90 transition-all group disabled:opacity-50"
                  aria-label="Join the movement and subscribe to newsletter"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Join the Movement
                      <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-[8px] md:text-[9px] text-muted-foreground uppercase tracking-widest">
                No spam. Only high-impact updates. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
