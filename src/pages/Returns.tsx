import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";

const Returns = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <SEO 
        title="Returns Policy"
        description="Learn about our returns policy under UK Consumer Rights Act 2015. Return items within 14 days for a full refund."
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
                Returns Policy
              </h1>
              <p className="text-muted-foreground mb-10 text-lg">
                Last updated: {new Date().toLocaleDateString("en-GB")}
              </p>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-soft border border-white/60">
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Your Rights
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Under the Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013, 
                    you have the right to cancel your order within 14 days of receiving your goods 
                    for a full refund.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    How to Return
                  </h2>
                  <ol className="list-decimal pl-6 text-muted-foreground space-y-3 text-lg">
                    <li>Contact us at returns@moenviron.com within 14 days of receiving your order</li>
                    <li>We'll send you a returns authorisation and shipping label</li>
                    <li>Pack the item securely in its original packaging if possible</li>
                    <li>Drop off at your nearest post office or arrange collection</li>
                  </ol>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Refunds
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Once we receive your return and verify its condition, we'll process your refund 
                    within 14 days. Refunds will be issued to the original payment method.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Exceptions
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Items must be unworn, unwashed, and in their original condition with all tags 
                    attached. We cannot accept returns on items that show signs of wear or damage.
                  </p>
                </section>

                <section className="mb-2">
                  <h2 className="text-2xl font-bold text-dark-green mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Faulty Items
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    If you receive a faulty or damaged item, please contact us immediately. We'll 
                    arrange a free return and send a replacement or full refund.
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

export default Returns;
