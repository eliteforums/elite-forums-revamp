import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import TrainingsPage from "./pages/Trainings";
import ProjectsPage from "./pages/ProjectsPage";
import ProductsPage from "./pages/Products";
import CareersPage from "./pages/Careers";
import ReviewForm from "./pages/ReviewForm";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import { useLenis } from "@/hooks/useLenis";

const queryClient = new QueryClient();

const LenisWrapper = ({ children }: { children: React.ReactNode }) => {
  useLenis();
  return <>{children}</>;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SpeedInsights />
        <Analytics />
        <LenisWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/trainings" element={<TrainingsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/review" element={<ReviewForm />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LenisWrapper>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
