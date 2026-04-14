import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PublicSiteProvider } from "@/context/PublicSiteContext";
import { PublicRecaptchaProvider } from "@/context/PublicRecaptchaContext";
import Index from "./pages/Index";
import ModelVF7 from "./pages/ModelVF7";
import ModelVF6 from "./pages/ModelVF6";
import ModelMPV7 from "./pages/ModelMPV7";
import TestDrive from "./pages/TestDrive";
import BookNow from "./pages/BookNow";
import EMICalculator from "./pages/EMICalculator";
import ComparePage from "./pages/Compare";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import TermsOfServicePage from "./pages/TermsOfService";
import PaymentRefundPolicyPage from "./pages/PaymentRefundPolicy";
import TermsAndConditionsPage from "./pages/TermsAndConditions";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminTestDrives from "./pages/admin/AdminTestDrives";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminContent from "./pages/admin/AdminContent";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminHomepage from "./pages/admin/AdminHomepage";
import AdminMedia from "./pages/admin/AdminMedia";

const queryClient = new QueryClient();

const App = () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = globalThis.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <Sonner />
          <PublicRecaptchaProvider>
            <PublicSiteProvider>
              <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
                <BrowserRouter>
                  <ScrollToTop />
                  <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/models/vf7" element={<ModelVF7 />} />
          <Route path="/models/vf6" element={<ModelVF6 />} />
          <Route path="/models/mpv7" element={<ModelMPV7 />} />
          <Route path="/book-now" element={<BookNow />} />
          <Route path="/test-drive" element={<TestDrive />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/payment-refund-policy" element={<PaymentRefundPolicyPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="test-drives" element={<AdminTestDrives />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </MotionConfig>
            </PublicSiteProvider>
          </PublicRecaptchaProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
