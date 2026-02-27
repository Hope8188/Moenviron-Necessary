import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";

const Terms = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO 
        title="Terms & Conditions"
        description="Read our terms and conditions governing your use of the Moenviron website and purchase of our sustainable fashion products."
      />
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold text-foreground">Terms & Conditions</h1>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString("en-GB")}</p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms and conditions govern your use of the Moenviron website and 
                  your purchase of products from us. By using our website or making a purchase, 
                  you agree to these terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Orders and Payment</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All orders are subject to availability. Prices are displayed in GBP and include 
                  VAT where applicable. Payment is processed securely through Stripe.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. Delivery</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We aim to dispatch orders within 2-3 business days. UK delivery typically takes 
                  3-5 working days. International shipping times vary by destination.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website, including text, images, and logos, is the property 
                  of Moenviron and protected by copyright law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms are governed by the laws of England and Wales. Any disputes will be 
                  subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
