import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, FileText, Mail, Users, Calendar, Send, FolderKanban, Image, GraduationCap, Package, Briefcase } from "lucide-react";
import OfferLetterGenerator from "@/components/admin/OfferLetterGenerator";
import OfferLetterRecords from "@/components/admin/OfferLetterRecords";
import BulkMailSystem from "@/components/admin/BulkMailSystem";
import BulkOfferLetters from "@/components/admin/BulkOfferLetters";
import TaskScheduler from "@/components/admin/TaskScheduler";
import ProjectsManager from "@/components/admin/ProjectsManager";
import ProductsManager from "@/components/admin/ProductsManager";
import ClientLogosManager from "@/components/admin/ClientLogosManager";
import TeamManager from "@/components/admin/TeamManager";
import TrainingProgramsManager from "@/components/admin/TrainingProgramsManager";
import CareersManager from "@/components/admin/CareersManager";
import logoImg from "@/assets/logo.png";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Elite Forums</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="Elite Forums" className="h-10" />
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs defaultValue="create-offer" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-11 mb-6 h-auto gap-2 bg-muted/50 p-2">
              <TabsTrigger value="create-offer" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Create Offer</span>
                <span className="sm:hidden">Create</span>
              </TabsTrigger>
              <TabsTrigger value="records" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Records</span>
                <span className="sm:hidden">Records</span>
              </TabsTrigger>
              <TabsTrigger value="bulk-mail" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">Bulk Mail</span>
                <span className="sm:hidden">Mail</span>
              </TabsTrigger>
              <TabsTrigger value="bulk-offers" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Bulk Offers</span>
                <span className="sm:hidden">Offers</span>
              </TabsTrigger>
              <TabsTrigger value="scheduler" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Scheduler</span>
                <span className="sm:hidden">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <FolderKanban className="w-4 h-4" />
                <span className="hidden sm:inline">Projects</span>
                <span className="sm:hidden">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Products</span>
                <span className="sm:hidden">Products</span>
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Clients</span>
                <span className="sm:hidden">Clients</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Team</span>
                <span className="sm:hidden">Team</span>
              </TabsTrigger>
              <TabsTrigger value="trainings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Trainings</span>
                <span className="sm:hidden">Train</span>
              </TabsTrigger>
              <TabsTrigger value="careers" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3">
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Careers</span>
                <span className="sm:hidden">Jobs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create-offer" className="mt-0">
              <OfferLetterGenerator />
            </TabsContent>

            <TabsContent value="records" className="mt-0">
              <OfferLetterRecords />
            </TabsContent>

            <TabsContent value="bulk-mail" className="mt-0">
              <BulkMailSystem />
            </TabsContent>

            <TabsContent value="bulk-offers" className="mt-0">
              <BulkOfferLetters />
            </TabsContent>

            <TabsContent value="scheduler" className="mt-0">
              <TaskScheduler />
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <ProjectsManager />
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <ProductsManager />
            </TabsContent>

            <TabsContent value="clients" className="mt-0">
              <ClientLogosManager />
            </TabsContent>

            <TabsContent value="team" className="mt-0">
              <TeamManager />
            </TabsContent>

            <TabsContent value="trainings" className="mt-0">
              <TrainingProgramsManager />
            </TabsContent>

            <TabsContent value="careers" className="mt-0">
              <CareersManager />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default Admin;
