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
      <main className="flex-1 py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-4xl font-bold text-foreground">Returns Policy</h1>
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString("en-GB")}</p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Under the Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013, 
                  you have the right to cancel your order within 14 days of receiving your goods 
                  for a full refund.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">How to Return</h2>
                <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                  <li>Contact us at returns@moenviron.com within 14 days of receiving your order</li>
                  <li>We'll send you a returns authorisation and shipping label</li>
                  <li>Pack the item securely in its original packaging if possible</li>
                  <li>Drop off at your nearest post office or arrange collection</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Refunds</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once we receive your return and verify its condition, we'll process your refund 
                  within 14 days. Refunds will be issued to the original payment method.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Exceptions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Items must be unworn, unwashed, and in their original condition with all tags 
                  attached. We cannot accept returns on items that show signs of wear or damage.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Faulty Items</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you receive a faulty or damaged item, please contact us immediately. We'll 
                  arrange a free return and send a replacement or full refund.
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

export default Returns;
