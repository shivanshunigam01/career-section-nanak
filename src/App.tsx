import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import ModelVF7 from "./pages/ModelVF7";
import ModelVF6 from "./pages/ModelVF6";
import TestDrive from "./pages/TestDrive";
import EMICalculator from "./pages/EMICalculator";
import ComparePage from "./pages/Compare";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/models/vf7" element={<ModelVF7 />} />
          <Route path="/models/vf6" element={<ModelVF6 />} />
          <Route path="/test-drive" element={<TestDrive />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
