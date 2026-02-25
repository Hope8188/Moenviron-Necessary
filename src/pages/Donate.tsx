import { safeToastError } from '@/lib/error-handler';
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, Leaf, Users, Globe, Loader2, CreditCard, Shirt, Package, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { getStripeFallbackUrl, redirectToStripeFallback } from "@/utils/stripeFallback";

// Import payment logos
import stripeLogo from "@/assets/stripe-logo.webp";
import { CURRENCY_CONFIG, COUNTRY_CURRENCY, COUNTRIES, getCurrencyForCountry, formatPrice } from "@/lib/currency";

// Base donation amounts in GBP
const BASE_DONATION_AMOUNTS_GBP = [10, 25, 50, 100];

const CLOTHES_CATEGORIES = [
  {
    id: "everyday",
    title: "Everyday Wear",
    description: "T-shirts, jeans, casual dresses, sweaters, and everyday clothing items",
    icon: Shirt,
    examples: ["T-shirts", "Jeans", "Sweaters", "Casual dresses", "Shorts"],
  },
  {
    id: "formal",
    title: "Formal & Workwear",
    description: "Suits, blazers, formal dresses, office attire, and professional clothing",
    icon: Users,
    examples: ["Suits", "Blazers", "Formal dresses", "Dress shirts", "Skirts"],
  },
  {
    id: "accessories",
    title: "Accessories & Others",
    description: "Shoes, bags, scarves, belts, and other textile accessories",
    icon: Package,
    examples: ["Shoes", "Bags", "Scarves", "Belts", "Hats"],
  },
];

const Donate = () => {
  const [donationType, setDonationType] = useState<"money" | "clothes">("money");
  const [selectedAmountIndex, setSelectedAmountIndex] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clothes donation state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [clothesStep, setClothesStep] = useState(1);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [clothesNotes, setClothesNotes] = useState("");
  const [isClothesSubmitting, setIsClothesSubmitting] = useState(false);

  // Get currency based on country
  const currencyKey = getCurrencyForCountry(country);
  const currencyConfig = CURRENCY_CONFIG[currencyKey];
  const { symbol: currencySymbol, rate: exchangeRate } = currencyConfig;

  // Reset amount selection when currency changes (prevents stale custom amounts across currencies)
  useEffect(() => {
    setSelectedAmountIndex(1);
    setCustomAmount("");
  }, [currencyKey]);
  // Convert base GBP amounts to selected currency and guard against Stripe minimums
  const rawDonationAmounts = BASE_DONATION_AMOUNTS_GBP.map((amt) => Math.round(amt * exchangeRate));
  const donationAmounts = rawDonationAmounts.map((amt) => Math.max(amt, currencyConfig.minAmount));

  // Calculate selected amount in the target currency
  const selectedAmount = customAmount
    ? parseFloat(customAmount)
    : donationAmounts[selectedAmountIndex] || donationAmounts[1];

  const stripePaymentLinkUrl = getStripeFallbackUrl(email, selectedAmount, currencyKey);

  const handleDonate = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!country) {
      toast.error("Please select your country");
      return;
    }
    if (selectedAmount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session via edge function
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{
            id: "donation",
            name: `Donation to Moenviron (${currencyConfig.code})`,
            price: selectedAmount,
            quantity: 1,
          }],
          customerEmail: email,
          customerName: name || undefined,
          customerLocation: `${city ? city + ", " : ""}${country}`,
          currency: currencyKey,
          mode: "checkout_session",
          isDonation: true,
        },
      });

      if (error || data?.fallback_required) {
        console.warn("Checkout session creation failed or fallback required:", error || data);
        redirectToStripeFallback(email, selectedAmount, currencyKey);
        return;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        redirectToStripeFallback(email, selectedAmount, currencyKey);
      }
    } catch (err) {
      console.error("Donation redirect error:", err);
      // Silent fallback redirect as requested
      redirectToStripeFallback(email, selectedAmount, currencyKey);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleClothesSubmit = async () => {
    if (!donorEmail || !donorName) {
      toast.error("Please fill in your name and email");
      return;
    }

    setIsClothesSubmitting(true);

    // Simulate submission - in production this would save to database
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Thank you! We'll contact you shortly to arrange collection.");
    setClothesStep(4); // Show success step
    setIsClothesSubmitting(false);
  };

  const renderClothesStep = () => {
    switch (clothesStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Select Clothing Categories</h3>
              <p className="text-muted-foreground">Choose the types of clothes you'd like to donate</p>
            </div>

            <div className="grid gap-4">
              {CLOTHES_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all ${isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                      }`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{category.title}</h4>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {category.examples.map((example) => (
                          <span key={example} className="text-xs bg-muted px-2 py-1 rounded-full">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setClothesStep(2)}
              disabled={selectedCategories.length === 0}
              className="w-full gap-2"
              size="lg"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Your Contact Details</h3>
              <p className="text-muted-foreground">We'll use these to arrange collection</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donor-name">Full Name *</Label>
                <Input
                  id="donor-name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor-email">Email Address *</Label>
                <Input
                  id="donor-email"
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor-phone">Phone Number</Label>
                <Input
                  id="donor-phone"
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setClothesStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setClothesStep(3)}
                disabled={!donorName || !donorEmail}
                className="flex-1 gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Collection Details</h3>
              <p className="text-muted-foreground">Where should we collect from?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donor-address">Collection Address *</Label>
                <Input
                  id="donor-address"
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  placeholder="Your full address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clothes-notes">Additional Notes</Label>
                <Input
                  id="clothes-notes"
                  value={clothesNotes}
                  onChange={(e) => setClothesNotes(e.target.value)}
                  placeholder="E.g., preferred collection times, number of bags..."
                />
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium text-foreground">Donation Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Categories:</strong> {selectedCategories.map(id =>
                  CLOTHES_CATEGORIES.find(c => c.id === id)?.title
                ).join(", ")}</p>
                <p><strong>Name:</strong> {donorName}</p>
                <p><strong>Email:</strong> {donorEmail}</p>
                {donorPhone && <p><strong>Phone:</strong> {donorPhone}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setClothesStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleClothesSubmit}
                disabled={!donorAddress || isClothesSubmitting}
                className="flex-1 gap-2"
              >
                {isClothesSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Thank You!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your clothes donation request has been received. Our team will contact you within 48 hours to arrange collection.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setClothesStep(1);
                setSelectedCategories([]);
                setDonorName("");
                setDonorEmail("");
                setDonorPhone("");
                setDonorAddress("");
                setClothesNotes("");
              }}
              className="mt-4"
            >
              Donate More Clothes
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Support Our Mission"
        description="Support sustainable fashion and circular economy initiatives. Donate money or clothes to help reduce textile waste and empower communities in East Africa."
      />
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          {/* Hero */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-foreground">Support Our Mission</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Your donation helps us create sustainable fashion opportunities, reduce textile waste,
              and empower communities across East Africa.
            </p>
          </div>

          {/* Impact Cards */}
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Leaf className="mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">Environmental Impact</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  £10 saves 5kg of textiles from landfill
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Users className="mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">Community Support</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  £25 provides a day's training for artisans
                </p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Globe className="mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold text-foreground">Global Reach</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  £100 funds shipping for partner donations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Donation Type Tabs */}
          <Tabs value={donationType} onValueChange={(v) => setDonationType(v as "money" | "clothes")} className="mx-auto max-w-lg">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="money" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Donate Money
              </TabsTrigger>
              <TabsTrigger value="clothes" className="gap-2">
                <Shirt className="h-4 w-4" />
                Donate Clothes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="money">
              <Card>
                <CardHeader>
                  <CardTitle>Make a Donation</CardTitle>
                  <CardDescription>Choose an amount and payment method. Currency auto-detected based on your country.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Selection */}
                  <div className="space-y-3">
                    <Label>Donation Amount ({currencyConfig.code})</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {donationAmounts.map((amt, index) => (
                        <Button
                          key={amt}
                          type="button"
                          variant={selectedAmountIndex === index && !customAmount ? "default" : "outline"}
                          onClick={() => {
                            setSelectedAmountIndex(index);
                            setCustomAmount("");
                          }}
                        >
                          {formatPrice(amt, currencyKey)}
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="pl-10"
                        min={currencyConfig.minAmount}
                      />
                    </div>
                  </div>

                  {/* Country Selection (determines currency) */}
                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Country * <span className="text-xs text-muted-foreground ml-2">(determines currency)</span>
                    </Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Where are you donating from?" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Payment Method - Simplified to just Stripe */}
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/5 p-3">
                      <img src={stripeLogo} alt="Stripe" className="h-5 w-auto" />
                      <span className="text-sm">Secure Checkout</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name (optional)</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City (optional)</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Your city"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleDonate}
                    disabled={isLoading || !email}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4" />
                        Donate {formatPrice(selectedAmount || 0, currencyKey)}
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Your donation is secure and helps support sustainable fashion initiatives. Payments processed by Stripe.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clothes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="h-5 w-5" />
                    Donate Your Clothes
                  </CardTitle>
                  <CardDescription>
                    Give your pre-loved clothes a second life. We'll collect them from your doorstep.
                  </CardDescription>
                  {clothesStep < 4 && (
                    <div className="flex items-center gap-2 mt-4">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${clothesStep >= step
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                            }`}>
                            {step}
                          </div>
                          {step < 3 && (
                            <div className={`h-0.5 w-8 ${clothesStep > step ? "bg-primary" : "bg-muted"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {renderClothesStep()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
