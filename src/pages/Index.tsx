import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuickActionBar from "@/components/QuickActionBar";
import ModelDiscovery from "@/components/ModelDiscovery";
import WhyVinFast from "@/components/WhyVinFast";
import VirtualShowroom from "@/components/VirtualShowroom";
import OwnershipSection from "@/components/OwnershipSection";
import OffersSection from "@/components/OffersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <QuickActionBar />
      <ModelDiscovery />
      <WhyVinFast />
      <VirtualShowroom />
      <OwnershipSection />
      <OffersSection />
      <TestimonialsSection />
      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
