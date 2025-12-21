import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
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
  Check
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

  const handleInputChange = (field: keyof OfferLetterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          offerLetter: generatedLetter,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email Sent!",
        description: `Offer letter sent successfully to ${formData.candidateEmail}`,
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
        description: "Failed to send offer letter. Please try again.",
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Offer Letter Generator</h2>
        <p className="text-muted-foreground">Generate professional offer letters with AI and send them directly to candidates</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Candidate Details
            </CardTitle>
            <CardDescription>
              Fill in the candidate and position information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidateName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Candidate Name *
                </Label>
                <Input
                  id="candidateName"
                  placeholder="John Doe"
                  value={formData.candidateName}
                  onChange={(e) => handleInputChange("candidateName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidateEmail" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.candidateEmail}
                  onChange={(e) => handleInputChange("candidateEmail", e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Position *
                </Label>
                <Input
                  id="position"
                  placeholder="Software Developer"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Department
                </Label>
                <Input
                  id="department"
                  placeholder="Engineering"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Annual Salary (CTC) *
                </Label>
                <Input
                  id="salary"
                  placeholder="₹5,00,000"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="joiningDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joining Date *
                </Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Work Location
              </Label>
              <Input
                id="location"
                placeholder="Vasai, Maharashtra"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Textarea
                id="additionalDetails"
                placeholder="Any specific terms, benefits, or conditions to include..."
                value={formData.additionalDetails}
                onChange={(e) => handleInputChange("additionalDetails", e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={generateOfferLetter}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Offer Letter
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Generated Letter
              </span>
              {generatedLetter && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              Preview and send the generated offer letter
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedLetter ? (
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="raw">Raw Text</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="mt-4">
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert bg-muted/50 p-6 rounded-lg max-h-[500px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ 
                      __html: generatedLetter
                        .replace(/\n/g, '<br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                </TabsContent>
                <TabsContent value="raw" className="mt-4">
                  <Textarea 
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    className="min-h-[500px] font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Fill in the details and generate your offer letter</p>
              </div>
            )}

            {generatedLetter && (
              <Button 
                className="w-full mt-4" 
                variant="default"
                onClick={sendOfferLetter}
                disabled={isSending || !formData.candidateEmail}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
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
