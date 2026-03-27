import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, PhoneCall, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedCard } from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9322510601",
    href: "tel:+919322510601",
  },
  {
    icon: Mail,
    label: "Email",
    value: "admin@eliteforums.in",
    href: "mailto:admin@eliteforums.in",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Shop No 101, Mahadev House, Vasai East, 401208",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Fri: 9:00 AM - 6:00 PM",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (error) throw error;

      toast({
        title: "Message Sent Successfully!",
        description: "We've received your message and will get back to you soon.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to Send Message",
        description: "Please try again or contact us directly at admin@eliteforums.in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCall = () => {
    window.location.href = "tel:+919322510601";
  };

  return (
    <section id="contact" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container relative">
        <AnimatedSection className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-5 tracking-wide">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Let's <span className="text-gradient">Work Together</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Ready to transform your business? Reach out to us and let's discuss
            how we can help you achieve your goals.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                size="lg"
                onClick={handleCall}
                className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all px-6 py-6 rounded-full group text-sm"
              >
                <PhoneCall className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Call Us Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "mailto:admin@eliteforums.in"}
                className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all px-6 py-6 rounded-full group text-sm"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Us
              </Button>
            </motion.div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatedSection delay={0.1}>
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Contact Information
              </h3>
            </AnimatedSection>
            
            {contactInfo.map((item, index) => (
              <AnimatedCard key={index} index={index}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-secondary/50 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 transition-colors">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-base text-foreground font-medium hover:text-accent transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-base text-foreground font-medium">
                        {item.value}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatedCard>
            ))}

            {/* Quick Contact Card */}
            <AnimatedSection delay={0.4}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="mt-6 p-6 rounded-[1.25rem] bg-accent/8 border border-accent/15"
              >
                <MessageCircle className="h-8 w-8 text-accent mb-3" />
                <h4 className="font-semibold text-lg text-foreground mb-1.5">Need Immediate Help?</h4>
                <p className="text-muted-foreground text-sm mb-5">
                  Our team is ready to assist you with any questions about our services.
                </p>
                <Button
                  onClick={handleCall}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-5 rounded-full text-sm"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  +91 9322510601
                </Button>
              </motion.div>
            </AnimatedSection>
          </div>

          {/* Contact Form */}
          <AnimatedSection delay={0.2} className="lg:col-span-3">
            <div className="bg-card rounded-[1.25rem] p-7 md:p-8 border border-border/60"
              style={{ boxShadow: '0 4px 24px -6px rgba(0,0,0,0.06)' }}
            >
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Send Us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-foreground mb-1.5">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-secondary/40 border-border/60 focus:border-accent h-11 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="bg-secondary/40 border-border/60 focus:border-accent h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-foreground mb-1.5">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="bg-secondary/40 border-border/60 focus:border-accent h-11 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-foreground mb-1.5">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={5}
                    required
                    className="bg-secondary/40 border-border/60 focus:border-accent resize-none rounded-xl text-sm"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all py-6 rounded-full group text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </AnimatedSection>
        </div>

        {/* Google Maps */}
        <AnimatedSection delay={0.3} className="mt-14">
          <div className="rounded-2xl overflow-hidden border border-border/60" style={{ boxShadow: '0 4px 24px -6px rgba(0,0,0,0.06)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.5!2d72.8263!3d19.3626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7aee4f1b1b1b1%3A0x1234567890abcdef!2sNallasopara%2C+Mumbai%2C+Maharashtra+401209!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Elite Forums Office Location"
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              <MapPin className="inline h-4 w-4 text-accent mr-1.5 -mt-0.5" />
              Elite Forums — Mumbai, MH 401209
            </p>
            <a
              href="https://share.google/JPfvUVjaWhhmUysBw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline font-medium"
            >
              Open in Google Maps →
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Contact;
