import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Leaf,
  ShieldCheck,
  Globe,
  ArrowRight,
  CheckCircle2,
  Coins,
  MapPin,
  Mail,
  User,
  Zap,
  Loader2,
  ShoppingBag
} from "lucide-react";
import { toast } from "sonner";
import { redirectToStripeFallback } from "@/utils/stripeFallback";

interface CurrencyConfig {
  code: string;
  symbol: string;
  minAmount: number;
}

const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  gbp: { code: "GBP", symbol: "£", minAmount: 2 },
  kes: { code: "KES", symbol: "KSh", minAmount: 100 },
  usd: { code: "USD", symbol: "$", minAmount: 2 },
  eur: { code: "EUR", symbol: "€", minAmount: 2 },
};

const CATEGORIES = [
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'environment', name: 'Environment', icon: '🌱' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'poverty', name: 'Poverty', icon: '🤝' },
];

export function Donate() {
  const [searchParams] = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [currencyKey, setCurrencyKey] = useState<string>("gbp");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");

  const currencyConfig = CURRENCY_CONFIG[currencyKey];

  useEffect(() => {
    const amount = searchParams.get("amount");
    if (amount) {
      const parsed = parseFloat(amount);
      if (!isNaN(parsed)) {
        setSelectedAmount(parsed);
      }
    }
    const curr = searchParams.get("currency");
    if (curr && CURRENCY_CONFIG[curr.toLowerCase()]) {
      setCurrencyKey(curr.toLowerCase());
    }
  }, [searchParams]);

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      setSelectedAmount(parsed);
    }
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (selectedAmount < currencyConfig.minAmount) {
      toast.error(`Minimum donation is ${currencyConfig.symbol}${currencyConfig.minAmount}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        })
      });

      const data = await response.json();
      const error = !response.ok ? data.error : null;

      if (error || data?.fallback_required) {
        console.warn("Checkout session creation failed or fallback required:", error || data);
        redirectToStripeFallback(email, selectedAmount, currencyKey);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        redirectToStripeFallback(email, selectedAmount, currencyKey);
      }
    } catch (err) {
      console.error("Donation redirect error:", err);
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

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast.success("Thank you! We've received your request and will contact you soon.");
    setDonorEmail("");
    setDonorName("");
    setSelectedCategories([]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary/5 py-16 lg:py-24">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Make an <span className="text-primary">Impact</span> Today
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Every donation help us support sustainable projects and local communities.
              Join us in our mission to create a more sustainable future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-sm">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Global Impact</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-sm">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Community Driven</span>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Financial Donation Column */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl md:p-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Coins className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Monetary Donation</h2>
                    <p className="text-sm text-muted-foreground">Support our ongoing projects</p>
                  </div>
                </div>

                <form onSubmit={handleDonateSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base">Select Currency</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {Object.entries(CURRENCY_CONFIG).map(([key, config]) => (
                        <Button
                          key={key}
                          type="button"
                          variant={currencyKey === key ? "default" : "outline"}
                          className="h-11 font-semibold"
                          onClick={() => setCurrencyKey(key)}
                        >
                          {config.code}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Select Amount</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[10, 20, 50, 100, 250, 500].map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                          className="h-12 text-lg font-bold"
                          onClick={() => handleAmountClick(amount)}
                        >
                          {currencyConfig.symbol}{amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="custom-amount" className="text-base">Custom Amount</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                        {currencyConfig.symbol}
                      </span>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter amount"
                        className="h-14 pl-12 text-2xl font-bold"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Full Name"
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="e.g. United Kingdom"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City (Optional)</Label>
                      <Input
                        id="city"
                        placeholder="e.g. London"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-14 w-full text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Donate {currencyConfig.symbol}{selectedAmount} Now
                        <Zap className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    <ShieldCheck className="mr-1 inline h-3 w-3" />
                    Secure checkout by Stripe. Taxes may apply.
                  </p>
                </form>
              </div>

              {/* Clothes Donation Column */}
              <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-xl md:p-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/30">
                    <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Donate Clothes</h2>
                    <p className="text-sm text-muted-foreground">Give your items a second life</p>
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-base text-foreground font-semibold">What are you donating?</Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all hover:border-primary/50 group ${selectedCategories.includes(cat.id)
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-muted/30 hover:bg-muted/50'
                            }`}
                        >
                          <span className="text-2xl transition-transform group-hover:scale-110">{cat.icon}</span>
                          <span className="text-xs font-semibold text-foreground/80">{cat.name}</span>
                          {selectedCategories.includes(cat.id) && (
                            <div className="absolute top-1 right-1">
                              <CheckCircle2 className="h-3 w-3 text-primary fill-background" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base text-foreground font-semibold">Contact Information</Label>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="donor-name" className="text-sm">Name</Label>
                        <Input
                          id="donor-name"
                          placeholder="Your Name"
                          className="bg-muted/30"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donor-email" className="text-sm">Email</Label>
                        <Input
                          id="donor-email"
                          type="email"
                          placeholder="you@email.com"
                          className="bg-muted/30"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <h3 className="mb-2 text-sm font-bold text-primary flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      Why donate clothes?
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Textile waste is a major environmental issue. By donating your used clothes,
                      you help reduce landfill waste and support families in need within our community.
                    </p>
                  </div>

                  <Button
                    className="h-14 w-full text-lg font-bold shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.02] bg-orange-600 hover:bg-orange-700 mt-auto"
                    onClick={handleClothesSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Schedule Collection
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Your Impact in Numbers</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { label: "Trees Planted", value: "12,450", icon: Leaf, color: "text-green-600" },
                { label: "Community Projects", value: "85", icon: Globe, color: "text-blue-600" },
                { label: "Lives Touched", value: "45,000+", icon: Heart, color: "text-red-600" },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl bg-background p-8 text-center shadow-sm">
                  <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Donate;
