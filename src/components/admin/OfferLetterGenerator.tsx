import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/logo.png";
import { 
  Sparkles, 
  Send, 
  FileText, 
  User, 
  Mail, 
  Building, 
  Calendar,
  IndianRupee,
  Briefcase,
  MapPin,
  Loader2,
  Copy,
  Check,
  Download,
  Eye
} from "lucide-react";

interface OfferLetterData {
  candidateName: string;
  candidateEmail: string;
  position: string;
  department: string;
  salary: string;
  joiningDate: string;
  location: string;
  additionalDetails: string;
}

const OfferLetterGenerator = () => {
  const [formData, setFormData] = useState<OfferLetterData>({
    candidateName: "",
    candidateEmail: "",
    position: "",
    department: "",
    salary: "",
    joiningDate: "",
    location: "Vasai, Maharashtra",
    additionalDetails: "",
  });
  
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (field: keyof OfferLetterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'To be confirmed';
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const generateOfferLetter = async () => {
    if (!formData.candidateName || !formData.position || !formData.salary || !formData.joiningDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Position, Salary, Joining Date)",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-offer-letter", {
        body: formData,
      });

      if (error) {
        console.error("Function invoke error:", error);
        throw error;
      }

      if (data?.error) {
        if (data.error.includes("Rate limits")) {
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please wait a moment and try again.",
            variant: "destructive",
          });
        } else if (data.error.includes("Payment required")) {
          toast({
            title: "Usage Limit Reached",
            description: "AI usage limit reached. Please contact support.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setGeneratedLetter(data.offerLetter);
      toast({
        title: "Letter Generated!",
        description: "Your offer letter has been created successfully.",
      });
    } catch (error) {
      console.error("Error generating offer letter:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate offer letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendOfferLetter = async () => {
    if (!formData.candidateEmail || !generatedLetter) {
      toast({
        title: "Missing Information",
        description: "Please provide candidate email and generate the letter first.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-offer-letter", {
        body: {
          candidateName: formData.candidateName,
          candidateEmail: formData.candidateEmail,
          position: formData.position,
          department: formData.department,
          salary: formData.salary,
          joiningDate: formData.joiningDate,
          location: formData.location,
          offerLetter: generatedLetter,
        },
      });

      if (error) {
        console.error("Send error:", error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Email Sent Successfully!",
        description: `Offer letter sent to ${formData.candidateEmail} and a copy to HR.`,
      });

      // Reset form after successful send
      setFormData({
        candidateName: "",
        candidateEmail: "",
        position: "",
        department: "",
        salary: "",
        joiningDate: "",
        location: "Vasai, Maharashtra",
        additionalDetails: "",
      });
      setGeneratedLetter("");
    } catch (error) {
      console.error("Error sending offer letter:", error);
      toast({
        title: "Send Failed",
        description: error instanceof Error ? error.message : "Failed to send offer letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Offer letter copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const printLetter = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(getEmailPreviewHtml());
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getEmailPreviewHtml = () => {
    const htmlContent = generatedLetter
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/#{1,3}\s*(.*?)(<br>|$)/g, '<h3 style="margin: 16px 0 8px 0; color: #1a1a2e; font-size: 16px;">$1</h3>');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offer Letter - Elite Forums</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); padding: 30px; border-radius: 16px 16px 0 0;">
          <div style="text-align: center;">
            <img src="${window.location.origin}/logo.png" alt="Elite Forums Logo" style="height: 60px; margin-bottom: 16px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">ELITE FORUMS</h1>
            <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px; letter-spacing: 2px;">EXCELLENCE IN IT SOLUTIONS & TRAINING</p>
          </div>
        </div>
        
        <div style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(90deg, #e94560 0%, #f97316 100%); color: white; padding: 16px 24px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 20px;">OFFER LETTER</h2>
            <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;">Position: ${formData.position}</p>
          </div>
          
          <div style="font-size: 15px; line-height: 1.8; color: #374151;">
            ${htmlContent}
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
              <div>
                <p style="margin: 0; font-weight: 600; color: #1a1a2e;">For Elite Forums</p>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">HR Department</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; font-weight: 600; color: #1a1a2e;">Candidate Acceptance</p>
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">Signature: _______________</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; padding: 24px; color: #6b7280; font-size: 12px;">
          <p style="margin: 5px 0;"><strong style="color: #1a1a2e;">Elite Forums</strong></p>
          <p style="margin: 5px 0;">Shop No. 7, Golden Park Rd, near D Mart, Evershine City</p>
          <p style="margin: 5px 0;">Vasai-Virar, Maharashtra 401208</p>
          <p style="margin: 5px 0;">📞 +91-XXXXXXXXXX | 📧 hr@eliteforums.in</p>
          <p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #e5e7eb; color: #9ca3af;">
            "Empowering Businesses Through Technology & Training"
          </p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={logoImg} alt="Elite Forums" className="h-12" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Offer Letter Generator</h2>
        <p className="text-muted-foreground">Generate professional offer letters with AI and send them directly to candidates</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Candidate Details
            </CardTitle>
            <CardDescription>
              Fill in the candidate and position information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidateName" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4 text-primary" />
                  Candidate Name *
                </Label>
                <Input
                  id="candidateName"
                  placeholder="John Doe"
                  value={formData.candidateName}
                  onChange={(e) => handleInputChange("candidateName", e.target.value)}
                  className="border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidateEmail" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address *
                </Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.candidateEmail}
                  onChange={(e) => handleInputChange("candidateEmail", e.target.value)}
                  className="border-border/50 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Position *
                </Label>
                <Input
                  id="position"
                  placeholder="Software Developer"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  className="border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2 text-sm font-medium">
                  <Building className="w-4 h-4 text-primary" />
                  Department
                </Label>
                <Input
                  id="department"
                  placeholder="Engineering"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="border-border/50 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-2 text-sm font-medium">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  Annual Salary (CTC) *
                </Label>
                <Input
                  id="salary"
                  placeholder="₹5,00,000"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  className="border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joiningDate" className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  Joining Date *
                </Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                  className="border-border/50 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                Work Location
              </Label>
              <Input
                id="location"
                placeholder="Vasai, Maharashtra"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="border-border/50 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails" className="text-sm font-medium">Additional Details</Label>
              <Textarea
                id="additionalDetails"
                placeholder="Any specific terms, benefits, or conditions to include..."
                value={formData.additionalDetails}
                onChange={(e) => handleInputChange("additionalDetails", e.target.value)}
                rows={3}
                className="border-border/50 focus:border-primary"
              />
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg" 
              onClick={generateOfferLetter}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Offer Letter
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-secondary/30 to-secondary/10 rounded-t-lg">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Generated Letter
              </span>
              {generatedLetter && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="border-border/50"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={printLetter}
                    className="border-border/50"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Preview and send the generated offer letter
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {generatedLetter ? (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Raw Text
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-0">
                  <div 
                    ref={previewRef}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-inner max-h-[500px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: getEmailPreviewHtml() }}
                  />
                </TabsContent>
                <TabsContent value="raw" className="mt-0">
                  <Textarea 
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    className="min-h-[500px] font-mono text-sm border-border/50"
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground bg-muted/30 rounded-lg">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No letter generated yet</p>
                <p className="text-sm">Fill in the details and click generate</p>
              </div>
            )}

            {generatedLetter && (
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg" 
                onClick={sendOfferLetter}
                disabled={isSending || !formData.candidateEmail}
                size="lg"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send to {formData.candidateEmail || "Candidate"}
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferLetterGenerator;