import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", company: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEO 
        title="Contact Us"
        description="Get in touch with Moenviron about our sustainable fashion products, partnership opportunities, or sustainability impact questions."
      />
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="gradient-hero py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
              <p className="mt-4 text-muted-foreground">
                Have a question about our products, partnership opportunities, or sustainability impact? 
                We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Form */}
              <div className="rounded-xl border border-border bg-card p-8">
                <h2 className="mb-6 text-2xl font-bold text-foreground">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Partnership inquiry"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-foreground">Get in Touch</h2>
                  <div className="space-y-4">
                    <a
                      href="mailto:info@moenviron.com"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "mailto:info@moenviron.com";
                      }}
                      className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <div className="text-sm text-muted-foreground">info@moenviron.com</div>
                      </div>
                    </a>

                    <a
                      href="tel:+447394382060"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = "tel:+447394382060";
                      }}
                      className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Phone</div>
                        <div className="text-sm text-muted-foreground">+44 7394 382060</div>
                      </div>
                    </a>

                    <a
                      href="https://wa.me/447394382060"
                      onClick={(e) => {
                        e.preventDefault();
                        window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: "https://wa.me/447394382060" } }, "*");
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">WhatsApp</div>
                        <div className="text-sm text-muted-foreground">Chat with us directly</div>
                      </div>
                    </a>
                  </div>
                </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Our Offices</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">United Kingdom</div>
                          <div className="text-sm text-muted-foreground">SP11 9GP, Wiltshire</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">Kenya</div>
                          <div className="text-sm text-muted-foreground">Nairobi, Kenya</div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
