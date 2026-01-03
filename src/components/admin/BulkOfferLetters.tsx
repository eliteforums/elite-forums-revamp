import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  Plus, 
  Trash2, 
  Loader2,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CandidateEntry {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: string;
  joiningDate: string;
  status: "pending" | "generating" | "sending" | "sent" | "failed";
  error?: string;
}

const BulkOfferLetters = () => {
  const [candidates, setCandidates] = useState<CandidateEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hrManagerName, setHrManagerName] = useState("Suchita Nigam");
  const [hrManagerEmail, setHrManagerEmail] = useState("suchita.nigam@eliteforums.in");
  const [hrManagerPhone, setHrManagerPhone] = useState("+91 9322510601");
  const [location, setLocation] = useState("Vasai, Maharashtra");
  const { toast } = useToast();

  const addCandidate = () => {
    const newCandidate: CandidateEntry = {
      id: crypto.randomUUID(),
      name: "",
      email: "",
      position: "",
      department: "",
      salary: "",
      joiningDate: "",
      status: "pending",
    };
    setCandidates([...candidates, newCandidate]);
  };

  const updateCandidate = (id: string, field: keyof CandidateEntry, value: string) => {
    setCandidates(candidates.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const removeCandidate = (id: string) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  const parseFromCSV = (text: string) => {
    const lines = text.trim().split("\n");
    const newCandidates: CandidateEntry[] = [];

    lines.forEach((line) => {
      const parts = line.split(",").map(p => p.trim());
      if (parts.length >= 5) {
        newCandidates.push({
          id: crypto.randomUUID(),
          name: parts[0] || "",
          email: parts[1] || "",
          position: parts[2] || "",
          department: parts[3] || "",
          salary: parts[4] || "",
          joiningDate: parts[5] || "",
          status: "pending",
        });
      }
    });

    setCandidates([...candidates, ...newCandidates]);
    toast({
      title: "Candidates Added",
      description: `Added ${newCandidates.length} candidates from CSV.`,
    });
  };

  const processBulkOffers = async () => {
    const validCandidates = candidates.filter(c => 
      c.name && c.email && c.position && c.salary && c.joiningDate
    );

    if (validCandidates.length === 0) {
      toast({
        title: "No Valid Candidates",
        description: "Please add candidates with all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i < validCandidates.length; i++) {
      const candidate = validCandidates[i];
      
      // Update status to generating
      setCandidates(prev => prev.map(c => 
        c.id === candidate.id ? { ...c, status: "generating" } : c
      ));

      try {
        // Generate offer letter
        const { data: genData, error: genError } = await supabase.functions.invoke("generate-offer-letter", {
          body: {
            candidateName: candidate.name,
            candidateEmail: candidate.email,
            position: candidate.position,
            department: candidate.department,
            salary: candidate.salary,
            joiningDate: candidate.joiningDate,
            location,
            hrManagerName,
            hrManagerEmail,
            hrManagerPhone,
            formattedJoiningDate: new Date(candidate.joiningDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          },
        });

        if (genError) throw genError;

        // Update status to sending
        setCandidates(prev => prev.map(c => 
          c.id === candidate.id ? { ...c, status: "sending" } : c
        ));

        // Send offer letter
        const { error: sendError } = await supabase.functions.invoke("send-offer-letter", {
          body: {
            candidateName: candidate.name,
            candidateEmail: candidate.email,
            position: candidate.position,
            department: candidate.department,
            salary: candidate.salary,
            joiningDate: candidate.joiningDate,
            location,
            offerLetter: genData.offerLetter,
            hrManagerName,
            hrManagerEmail,
            hrManagerPhone,
          },
        });

        if (sendError) throw sendError;

        // Update status to sent
        setCandidates(prev => prev.map(c => 
          c.id === candidate.id ? { ...c, status: "sent" } : c
        ));
      } catch (error) {
        console.error(`Error processing ${candidate.name}:`, error);
        setCandidates(prev => prev.map(c => 
          c.id === candidate.id ? { 
            ...c, 
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error"
          } : c
        ));
      }

      setProgress(((i + 1) / validCandidates.length) * 100);
      
      // Small delay between requests to avoid rate limiting
      if (i < validCandidates.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsProcessing(false);
    
    const sentCount = candidates.filter(c => c.status === "sent").length;
    toast({
      title: "Bulk Processing Complete",
      description: `Successfully sent ${sentCount} offer letters.`,
    });
  };

  const getStatusBadge = (status: CandidateEntry["status"]) => {
    switch (status) {
      case "generating":
        return <Badge className="bg-purple-500/20 text-purple-600"><Sparkles className="w-3 h-3 mr-1 animate-pulse" />Generating</Badge>;
      case "sending":
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Sending</Badge>;
      case "sent":
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Sent</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-600">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* HR Details Card */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Common Details
          </CardTitle>
          <CardDescription>HR and location details for all offer letters</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>HR Manager Name</Label>
              <Input
                value={hrManagerName}
                onChange={(e) => setHrManagerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>HR Email</Label>
              <Input
                value={hrManagerEmail}
                onChange={(e) => setHrManagerEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>HR Phone</Label>
              <Input
                value={hrManagerPhone}
                onChange={(e) => setHrManagerPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Work Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates List */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-secondary/30 to-secondary/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Candidates ({candidates.length})
              </CardTitle>
              <CardDescription>Add candidates to send bulk offer letters</CardDescription>
            </div>
            <Button onClick={addCandidate} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* CSV Import */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <Label>Import from CSV (Name, Email, Position, Department, Salary, JoiningDate)</Label>
            <Textarea
              placeholder="Paste CSV data here...&#10;John Doe, john@email.com, Developer, Engineering, ₹5,00,000, 2024-02-01"
              rows={3}
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  parseFromCSV(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>

          {/* Candidates */}
          {candidates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No candidates added</p>
              <p className="text-sm">Click "Add Candidate" or paste CSV data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-4 border border-border/50 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(candidate.status)}
                      {candidate.error && (
                        <span className="text-xs text-red-500">{candidate.error}</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCandidate(candidate.id)}
                      disabled={isProcessing}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <Input
                      placeholder="Full Name *"
                      value={candidate.name}
                      onChange={(e) => updateCandidate(candidate.id, "name", e.target.value)}
                      disabled={isProcessing}
                    />
                    <Input
                      placeholder="Email *"
                      value={candidate.email}
                      onChange={(e) => updateCandidate(candidate.id, "email", e.target.value)}
                      disabled={isProcessing}
                    />
                    <Input
                      placeholder="Position *"
                      value={candidate.position}
                      onChange={(e) => updateCandidate(candidate.id, "position", e.target.value)}
                      disabled={isProcessing}
                    />
                    <Input
                      placeholder="Department"
                      value={candidate.department}
                      onChange={(e) => updateCandidate(candidate.id, "department", e.target.value)}
                      disabled={isProcessing}
                    />
                    <Input
                      placeholder="Salary *"
                      value={candidate.salary}
                      onChange={(e) => updateCandidate(candidate.id, "salary", e.target.value)}
                      disabled={isProcessing}
                    />
                    <Input
                      type="date"
                      placeholder="Joining Date *"
                      value={candidate.joiningDate}
                      onChange={(e) => updateCandidate(candidate.id, "joiningDate", e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing offers...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Send Button */}
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            onClick={processBulkOffers}
            disabled={isProcessing || candidates.length === 0}
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Generate & Send All Offer Letters
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkOfferLetters;
