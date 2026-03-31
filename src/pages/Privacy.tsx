import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO 
        title="Privacy Policy"
        description="Learn how Moenviron collects, uses, and protects your personal data in compliance with UK GDPR and Data Protection Act 2018."
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
                Privacy Policy
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
                    Moenviron ("we", "our", "us") is committed to protecting your personal data. 
                    This privacy policy explains how we collect, use, and protect your information 
                    in compliance with the UK General Data Protection Regulation (UK GDPR) and the 
                    Data Protection Act 2018.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    2. Data We Collect
                  </h2>
                  <p className="text-muted-foreground mb-4 text-lg">We collect:</p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-3 text-lg">
                    <li>Contact information (name, email, phone) when you make purchases or enquiries</li>
                    <li>Payment information processed securely by Stripe</li>
                    <li>Delivery addresses for order fulfilment</li>
                    <li>Website usage data through cookies</li>
                  </ul>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    3. How We Use Your Data
                  </h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-3 text-lg">
                    <li>Process and fulfil your orders</li>
                    <li>Respond to your enquiries</li>
                    <li>Improve our products and services</li>
                    <li>Send marketing communications (with your consent)</li>
                  </ul>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    4. Your Rights
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Under UK GDPR, you have the right to access, rectify, erase, restrict processing, 
                    data portability, and object to processing of your personal data. Contact us at 
                    privacy@moenviron.com to exercise these rights.
                  </p>
                </section>

                <section className="mb-2">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    5. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    For privacy-related enquiries, contact our Data Protection Officer at 
                    privacy@moenviron.com or write to us at our London office.
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

export default Privacy;
