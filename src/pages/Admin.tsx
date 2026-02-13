import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { 
  LogOut, FileText, Mail, Users, Calendar, Send, 
  FolderKanban, Image, GraduationCap, Package, Briefcase, Home, MessageSquare 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
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
import ReviewsManager from "@/components/admin/ReviewsManager";
import logoImg from "@/assets/logo.png";

type AdminSection = 
  | "create-offer" 
  | "records" 
  | "bulk-mail" 
  | "bulk-offers" 
  | "scheduler" 
  | "projects" 
  | "products" 
  | "clients" 
  | "team" 
  | "trainings" 
  | "careers"
  | "reviews";

const hrMenuItems = [
  { id: "create-offer" as const, title: "Create Offer", icon: FileText },
  { id: "records" as const, title: "Records", icon: Users },
  { id: "bulk-mail" as const, title: "Bulk Mail", icon: Mail },
  { id: "bulk-offers" as const, title: "Bulk Offers", icon: Send },
  { id: "scheduler" as const, title: "Scheduler", icon: Calendar },
];

const cmsMenuItems = [
  { id: "projects" as const, title: "Projects", icon: FolderKanban },
  { id: "products" as const, title: "Products", icon: Package },
  { id: "clients" as const, title: "Clients", icon: Image },
  { id: "team" as const, title: "Team", icon: Users },
  { id: "trainings" as const, title: "Trainings", icon: GraduationCap },
  { id: "careers" as const, title: "Careers", icon: Briefcase },
  { id: "reviews" as const, title: "Reviews", icon: MessageSquare },
];

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>("create-offer");
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

  const renderContent = () => {
    switch (activeSection) {
      case "create-offer":
        return <OfferLetterGenerator />;
      case "records":
        return <OfferLetterRecords />;
      case "bulk-mail":
        return <BulkMailSystem />;
      case "bulk-offers":
        return <BulkOfferLetters />;
      case "scheduler":
        return <TaskScheduler />;
      case "projects":
        return <ProjectsManager />;
      case "products":
        return <ProductsManager />;
      case "clients":
        return <ClientLogosManager />;
      case "team":
        return <TeamManager />;
      case "trainings":
        return <TrainingProgramsManager />;
      case "careers":
        return <CareersManager />;
      case "reviews":
        return <ReviewsManager />;
      default:
        return <OfferLetterGenerator />;
    }
  };

  const getSectionTitle = () => {
    const allItems = [...hrMenuItems, ...cmsMenuItems];
    return allItems.find(item => item.id === activeSection)?.title || "Dashboard";
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

      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar className="border-r border-border">
            <SidebarHeader className="border-b border-border p-4">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="Elite Forums" className="h-8" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-foreground">Elite Forums</span>
                  <span className="text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              {/* HR & Operations */}
              <SidebarGroup>
                <SidebarGroupLabel>HR & Operations</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {hrMenuItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          isActive={activeSection === item.id}
                          onClick={() => setActiveSection(item.id)}
                          className="cursor-pointer"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Content Management */}
              <SidebarGroup>
                <SidebarGroupLabel>Content Management</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {cmsMenuItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          isActive={activeSection === item.id}
                          onClick={() => setActiveSection(item.id)}
                          className="cursor-pointer"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-4">
              <div className="flex flex-col gap-3">
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate("/")}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="flex-1">
            {/* Top Header */}
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-foreground">{getSectionTitle()}</h1>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
              {renderContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Admin;
