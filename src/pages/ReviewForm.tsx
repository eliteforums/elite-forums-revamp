import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, User, Building, MessageSquare, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ReviewForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    review: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.college.trim() || !formData.review.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("student_reviews").insert({
        name: formData.name.trim(),
        college: formData.college.trim(),
        review: formData.review.trim(),
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Thank you for your review!");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Submit Your Review | Elite Forums Training</title>
        <meta name="description" content="Share your training experience at Elite Forums Campus." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container max-w-lg mx-auto">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Thank You!</h2>
                <p className="text-muted-foreground">
                  Your review has been submitted successfully. We appreciate your feedback!
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-border">
                  <CardHeader className="text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Share Your Experience</CardTitle>
                    <CardDescription>
                      Tell us about your training experience at Elite Forums Campus
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Full Name *
                        </Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Enter your full name"
                          maxLength={100}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          College / Institution *
                        </Label>
                        <Input
                          value={formData.college}
                          onChange={(e) => setFormData((p) => ({ ...p, college: e.target.value }))}
                          placeholder="Enter your college or institution name"
                          maxLength={200}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          Your Review *
                        </Label>
                        <Textarea
                          value={formData.review}
                          onChange={(e) => setFormData((p) => ({ ...p, review: e.target.value }))}
                          placeholder="Share your training experience..."
                          rows={5}
                          maxLength={1000}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-primary hover:opacity-90 py-6 text-lg"
                      >
                        {isSubmitting ? "Submitting..." : (
                          <span className="flex items-center gap-2">
                            Submit Review <Send className="h-5 w-5" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ReviewForm;
