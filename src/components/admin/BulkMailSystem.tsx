import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Send, 
  Plus, 
  Trash2, 
  Loader2,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  History
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface BulkMailCampaign {
  id: string;
  campaign_name: string;
  subject: string;
  body: string;
  recipients: string[];
  status: string;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

const BulkMailSystem = () => {
  const [campaigns, setCampaigns] = useState<BulkMailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bulk_mail_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const addRecipient = () => {
    const email = newRecipient.trim();
    if (!email) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (recipients.includes(email)) {
      toast({
        title: "Duplicate Email",
        description: "This email is already in the list.",
        variant: "destructive",
      });
      return;
    }

    setRecipients([...recipients, email]);
    setNewRecipient("");
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const parseRecipientsFromText = (text: string) => {
    const emails = text.split(/[\n,;]+/).map(e => e.trim()).filter(e => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(e);
    });
    
    const uniqueEmails = [...new Set([...recipients, ...emails])];
    setRecipients(uniqueEmails);
    setNewRecipient("");
    
    toast({
      title: "Recipients Added",
      description: `Added ${emails.length} valid email addresses.`,
    });
  };

  const sendBulkMail = async () => {
    if (!campaignName || !subject || !body || recipients.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and add at least one recipient.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create campaign record
      const { data: campaign, error: insertError } = await supabase
        .from("bulk_mail_campaigns")
        .insert({
          campaign_name: campaignName,
          subject,
          body,
          recipients,
          status: "sending",
          created_by: user?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Send bulk emails
      const { data, error } = await supabase.functions.invoke("send-bulk-mail", {
        body: {
          campaignId: campaign.id,
          subject,
          body,
          recipients,
        },
      });

      if (error) throw error;

      toast({
        title: "Campaign Sent!",
        description: `Successfully sent ${data.sentCount} emails.`,
      });

      // Reset form
      setCampaignName("");
      setSubject("");
      setBody("");
      setRecipients([]);
      fetchCampaigns();
    } catch (error) {
      console.error("Error sending bulk mail:", error);
      toast({
        title: "Send Failed",
        description: "Failed to send bulk mail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case "sending":
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Sending</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-600"><Mail className="w-3 h-3 mr-1" />Draft</Badge>;
    }
  };

  return (
    <Tabs defaultValue="compose" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="compose" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Compose
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <History className="w-4 h-4" />
          History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="compose">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Compose Form */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Compose Bulk Mail
              </CardTitle>
              <CardDescription>Create and send emails to multiple recipients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  placeholder="e.g., January Newsletter"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject line"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                  id="body"
                  placeholder="Write your email content here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/80"
                onClick={sendBulkMail}
                disabled={isSending || recipients.length === 0}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to {recipients.length} Recipients
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recipients */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/30 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Recipients ({recipients.length})
              </CardTitle>
              <CardDescription>Add email addresses to send to</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addRecipient()}
                />
                <Button variant="outline" onClick={addRecipient}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Paste Multiple Emails</Label>
                <Textarea
                  placeholder="Paste comma or line separated emails..."
                  rows={3}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      parseRecipientsFromText(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {recipients.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                  >
                    <span className="text-sm truncate">{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecipient(email)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {recipients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No recipients added yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="history">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Campaign History
            </CardTitle>
            <CardDescription>View past bulk mail campaigns</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Mail className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No campaigns yet</p>
                <p className="text-sm">Create your first bulk mail campaign</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Campaign</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent/Failed</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.campaign_name}</TableCell>
                      <TableCell className="max-w-xs truncate">{campaign.subject}</TableCell>
                      <TableCell>{campaign.recipients.length}</TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell>
                        <span className="text-green-600">{campaign.sent_count}</span> / 
                        <span className="text-red-600 ml-1">{campaign.failed_count}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(campaign.created_at).toLocaleDateString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default BulkMailSystem;
