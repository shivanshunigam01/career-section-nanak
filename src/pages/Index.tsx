import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuickActionBar from "@/components/QuickActionBar";
import ModelDiscovery from "@/components/ModelDiscovery";
import WhyVinFast from "@/components/WhyVinFast";
import VirtualShowroom from "@/components/VirtualShowroom";
import OwnershipSection from "@/components/OwnershipSection";
import OffersSection from "@/components/OffersSection";
import LeadCaptureStrip from "@/components/LeadCaptureStrip";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import SeoHead from "@/components/seo/SeoHead";

const Index = () => {
  return (
    <div className="min-h-screen w-full max-w-[100%] overflow-x-clip bg-background pb-36 lg:pb-0">
      <SeoHead
        title="Patliputra VinFast — Bihar's #1 Organic Destination for Premium Electric Vehicles"
        description="Become Bihar's destination for premium EV search & purchase. Explore VinFast VF6, VF7 and MPV7 — prices, test drives, finance, charging and support across all 38 districts."
        path="/"
        keywords={[
          "VinFast Bihar",
          "VinFast Patna",
          "Premium Electric SUV Bihar",
          "VinFast VF6",
          "VinFast VF7",
          "VinFast MPV7",
          "Electric SUV Patna",
          "Patliputra VinFast",
        ]}
      />
      <Navbar />
      <HeroSection />
      <QuickActionBar />
      <ModelDiscovery />
      <WhyVinFast />
      <VirtualShowroom />
      <OwnershipSection />
      <OffersSection />
      <LeadCaptureStrip />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
