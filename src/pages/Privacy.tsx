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
      <main className="flex-1 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold text-foreground">Privacy Policy</h1>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString("en-GB")}</p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Moenviron ("we", "our", "us") is committed to protecting your personal data. 
                  This privacy policy explains how we collect, use, and protect your information 
                  in compliance with the UK General Data Protection Regulation (UK GDPR) and the 
                  Data Protection Act 2018.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Data We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">We collect:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Contact information (name, email, phone) when you make purchases or enquiries</li>
                  <li>Payment information processed securely by Stripe</li>
                  <li>Delivery addresses for order fulfilment</li>
                  <li>Website usage data through cookies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Data</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Process and fulfil your orders</li>
                  <li>Respond to your enquiries</li>
                  <li>Improve our products and services</li>
                  <li>Send marketing communications (with your consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Under UK GDPR, you have the right to access, rectify, erase, restrict processing, 
                  data portability, and object to processing of your personal data. Contact us at 
                  privacy@moenviron.com to exercise these rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For privacy-related enquiries, contact our Data Protection Officer at 
                  privacy@moenviron.com or write to us at our London office.
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

export default Privacy;
