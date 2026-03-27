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
    value: "Mumbai, MH 401209",
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
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container relative">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Let's <span className="text-gradient">Work Together</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Ready to transform your business? Reach out to us and let's discuss
            how we can help you achieve your goals.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={handleCall}
                className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all px-8 py-7 rounded-full group"
              >
                <PhoneCall className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Call Us Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "mailto:admin@eliteforums.in"}
                className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all px-8 py-7 rounded-full group"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Us
              </Button>
            </motion.div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection delay={0.1}>
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Contact Information
              </h3>
            </AnimatedSection>
            
            {contactInfo.map((item, index) => (
              <AnimatedCard key={index} index={index}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-secondary/50 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-lg text-foreground font-medium hover:text-accent transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-lg text-foreground font-medium">
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
                whileHover={{ scale: 1.02 }}
                className="mt-8 p-8 rounded-3xl bg-accent/10 border border-accent/20"
              >
                <MessageCircle className="h-10 w-10 text-accent mb-4" />
                <h4 className="font-semibold text-xl text-foreground mb-2">Need Immediate Help?</h4>
                <p className="text-muted-foreground mb-6">
                  Our team is ready to assist you with any questions about our services.
                </p>
                <Button
                  onClick={handleCall}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 rounded-full"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  +91 9322510601
                </Button>
              </motion.div>
            </AnimatedSection>
          </div>

          {/* Contact Form */}
          <AnimatedSection delay={0.2} className="lg:col-span-3">
            <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-lg">
              <h3 className="text-2xl font-semibold text-foreground mb-8">
                Send Us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="bg-secondary/50 border-border focus:border-accent h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
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
                      className="bg-secondary/50 border-border focus:border-accent h-12 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="bg-secondary/50 border-border focus:border-accent h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={6}
                    required
                    className="bg-secondary/50 border-border focus:border-accent resize-none rounded-xl"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all py-7 rounded-full group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default Contact;
