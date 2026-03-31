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
      <main className="flex-1">
        <div className="bg-sand bg-[radial-gradient(circle_at_15%_50%,rgba(226,239,231,1),transparent_50%),radial-gradient(circle_at_85%_30%,rgba(196,223,200,0.5),transparent_50%)] pt-20 pb-16 overflow-hidden">
          {/* Background Shapes */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] bg-[rgba(196,223,200,0.4)] rounded-full blur-[80px] -top-[30px] -right-[30px] lg:-top-[80px] lg:-right-[80px]" />
            <div className="absolute w-[150px] h-[150px] md:w-[250px] md:h-[250px] bg-[rgba(62,229,142,0.1)] rounded-full blur-[80px] bottom-0 -left-[30px] lg:-left-[80px]" />
          </div>
          
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl">
              <h1 
                className="mb-4 text-4xl md:text-5xl font-extrabold tracking-tight text-dark-green"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground mb-10 text-lg">
                Last updated: {new Date().toLocaleDateString("en-GB")}
              </p>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-soft border border-white/60">
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    1. Introduction
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    These terms and conditions govern your use of the Moenviron website and 
                    your purchase of products from us. By using our website or making a purchase, 
                    you agree to these terms.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    2. Orders and Payment
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    All orders are subject to availability. Prices are displayed in GBP and include 
                    VAT where applicable. Payment is processed securely through Stripe.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    3. Delivery
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    We aim to dispatch orders within 2-3 business days. UK delivery typically takes 
                    3-5 working days. International shipping times vary by destination.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    4. Intellectual Property
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    All content on this website, including text, images, and logos, is the property 
                    of Moenviron and protected by copyright law.
                  </p>
                </section>

                <section className="mb-2">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    5. Governing Law
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    These terms are governed by the laws of England and Wales. Any disputes will be 
                    subject to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
