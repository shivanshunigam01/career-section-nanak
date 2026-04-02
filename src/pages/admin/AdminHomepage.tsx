import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Trash2, Plus, MessageCircle, Home } from "lucide-react";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import { getStoredState, setStoredState } from "@/lib/vfLocalStorage";

const STORAGE_KEY = "vf_admin_homepage";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  bgImage: string;
  active: boolean;
  order: number;
}

interface SiteConfig {
  whatsappNumber: string;
  phoneNumber: string;
  heroTagline: string;
  leadStripTitle: string;
  leadStripSubtitle: string;
  vf7Price: string;
  vf6Price: string;
  vf7Range: string;
  vf6Range: string;
}

const initialSlides: HeroSlide[] = [
  {
    id: "S1", title: "VinFast VF 7", subtitle: "Bold. Intelligent. Unstoppable. Bihar's favourite electric SUV.",
    badge: "Now Available in Bihar", ctaPrimary: "Book Test Drive", ctaPrimaryLink: "/test-drive",
    ctaSecondary: "Explore VF 7", ctaSecondaryLink: "/models/vf7", bgImage: "", active: true, order: 1,
  },
  {
    id: "S2", title: "VinFast VF 6", subtitle: "Smart. Sleek. Perfect for Bihar roads.", badge: "Starting ₹17.29L*",
    ctaPrimary: "Book Test Drive", ctaPrimaryLink: "/test-drive", ctaSecondary: "Explore VF 6",
    ctaSecondaryLink: "/models/vf6", bgImage: "", active: true, order: 2,
  },
];

const initialConfig: SiteConfig = {
  whatsappNumber: "919231445060",
  phoneNumber: "+91 9231445060",
  heroTagline: "Bihar's First VinFast Dealer",
  leadStripTitle: "Ready to Go Electric?",
  leadStripSubtitle: "Leave your details and our EV advisor will reach out in 10 minutes.",
  vf7Price: "₹21.89L*",
  vf6Price: "₹17.29L*",
  vf7Range: "431 km",
  vf6Range: "381 km",
};

const emptySlide: HeroSlide = {
  id: "", title: "", subtitle: "", badge: "", ctaPrimary: "Book Test Drive", ctaPrimaryLink: "/test-drive",
  ctaSecondary: "Learn More", ctaSecondaryLink: "/", bgImage: "", active: true, order: 99,
};

const AdminHomepage = () => {
  const [hydrated, setHydrated] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getStoredState<{ slides: HeroSlide[]; config: SiteConfig } | null>(STORAGE_KEY, null);
    if (stored) {
      setSlides(stored.slides ?? initialSlides);
      setConfig(stored.config ?? initialConfig);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredState(STORAGE_KEY, { slides, config });
  }, [slides, config, hydrated]);

  const handleSaveSlide = (slide: HeroSlide) => {
    if (slide.id) {
      setSlides(prev => prev.map(s => s.id === slide.id ? slide : s));
    } else {
      setSlides(prev => [...prev, { ...slide, id: `S${prev.length + 1}`, order: prev.length + 1 }]);
    }
    setShowForm(false);
    setEditSlide(null);
  };

  const handleDeleteSlide = (id: string) => setSlides(prev => prev.filter(s => s.id !== id));
  const toggleSlide = (id: string) => setSlides(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));

  const handleSaveConfig = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateConfig = (key: keyof SiteConfig, value: string) =>
    setConfig(prev => ({ ...prev, [key]: value }));
  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" /> Homepage Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Control hero slides, pricing display, and site-wide config</p>
        </div>
      </div>

      <Tabs defaultValue="slides" className="space-y-4">
        <TabsList className="bg-secondary/50 w-full overflow-x-auto justify-start">
          <TabsTrigger value="slides">Hero Slides</TabsTrigger>
          <TabsTrigger value="config">Site Config</TabsTrigger>
          <TabsTrigger value="contact">Contact & WhatsApp</TabsTrigger>
        </TabsList>

        {/* Hero Slides */}
        <TabsContent value="slides" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{slides.length} slide(s) · drag to reorder</p>
            <Button onClick={() => { setEditSlide(emptySlide); setShowForm(true); }} className="bg-primary text-primary-foreground" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Slide
            </Button>
          </div>
          <div className="space-y-3">
            {sortedSlides.map((slide) => (
              <Card key={slide.id} className={`bg-card border-border/50 p-4 transition-opacity ${slide.active ? "" : "opacity-50"}`}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden bg-secondary/40 border border-border/30">
                    {slide.bgImage
                      ? <img src={slide.bgImage} alt="slide" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs">No image</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{slide.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{slide.subtitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">{slide.badge}</span>
                          <span className="text-[10px] text-muted-foreground">→ {slide.ctaPrimaryLink}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Switch checked={slide.active} onCheckedChange={() => toggleSlide(slide.id)} />
                        <button onClick={() => { setEditSlide(slide); setShowForm(true); }} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteSlide(slide.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Site Config */}
        <TabsContent value="config" className="space-y-4">
          <Card className="bg-card border-border/50 p-5 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Display Prices & Stats</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">VF 7 Display Price</Label>
                <Input value={config.vf7Price} onChange={e => updateConfig("vf7Price", e.target.value)} className="bg-secondary/50" placeholder="₹21.89L*" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">VF 6 Display Price</Label>
                <Input value={config.vf6Price} onChange={e => updateConfig("vf6Price", e.target.value)} className="bg-secondary/50" placeholder="₹17.29L*" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">VF 7 Range</Label>
                <Input value={config.vf7Range} onChange={e => updateConfig("vf7Range", e.target.value)} className="bg-secondary/50" placeholder="431 km" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">VF 6 Range</Label>
                <Input value={config.vf6Range} onChange={e => updateConfig("vf6Range", e.target.value)} className="bg-secondary/50" placeholder="381 km" />
              </div>
            </div>
          </Card>
          <Card className="bg-card border-border/50 p-5 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Lead Capture Strip</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Strip Title</Label>
                <Input value={config.leadStripTitle} onChange={e => updateConfig("leadStripTitle", e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Strip Subtitle</Label>
                <Textarea value={config.leadStripSubtitle} onChange={e => updateConfig("leadStripSubtitle", e.target.value)} className="bg-secondary/50" rows={2} />
              </div>
            </div>
          </Card>
          <Button onClick={handleSaveConfig} className="bg-primary text-primary-foreground">
            {saved ? "✓ Saved!" : "Save Configuration"}
          </Button>
        </TabsContent>

        {/* Contact & WhatsApp */}
        <TabsContent value="contact" className="space-y-4">
          <Card className="bg-card border-border/50 p-5 space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp & Phone
            </h3>
            <p className="text-xs text-muted-foreground">These numbers are used across the entire website for the WhatsApp button, Call button, and sticky mobile CTA.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">WhatsApp Number (with country code, no +)</Label>
                <Input value={config.whatsappNumber} onChange={e => updateConfig("whatsappNumber", e.target.value)} className="bg-secondary/50" placeholder="919231445060" />
                <p className="text-[10px] text-muted-foreground">Used in: https://wa.me/{config.whatsappNumber}</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone Number (display)</Label>
                <Input value={config.phoneNumber} onChange={e => updateConfig("phoneNumber", e.target.value)} className="bg-secondary/50" placeholder="+91 9231445060" />
              </div>
            </div>
            <Button onClick={handleSaveConfig} className="bg-primary text-primary-foreground">
              {saved ? "✓ Saved!" : "Save"}
            </Button>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Slide Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditSlide(null); }}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editSlide?.id ? "Edit Slide" : "Add Slide"}</DialogTitle>
          </DialogHeader>
          {editSlide && (
            <SlideForm slide={editSlide} onSave={handleSaveSlide} onCancel={() => { setShowForm(false); setEditSlide(null); }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SlideForm = ({ slide, onSave, onCancel }: { slide: HeroSlide; onSave: (s: HeroSlide) => void; onCancel: () => void }) => {
  const [form, setForm] = useState(slide);
  const update = (key: keyof HeroSlide, value: string | boolean | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-xs">Background Image</Label>
        <CloudinaryUpload value={form.bgImage} onUpload={(url) => update("bgImage", url)} label="Upload Hero Background" aspectRatio="16/7" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label className="text-xs">Badge Text</Label>
          <Input value={form.badge} onChange={e => update("badge", e.target.value)} className="bg-secondary/50" placeholder="e.g. Now Available in Bihar" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label className="text-xs">Title</Label>
          <Input value={form.title} onChange={e => update("title", e.target.value)} className="bg-secondary/50" placeholder="VinFast VF 7" />
        </div>
        <div className="col-span-2 space-y-1.5">
          <Label className="text-xs">Subtitle</Label>
          <Textarea value={form.subtitle} onChange={e => update("subtitle", e.target.value)} className="bg-secondary/50" rows={2} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Primary CTA Text</Label>
          <Input value={form.ctaPrimary} onChange={e => update("ctaPrimary", e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Primary CTA Link</Label>
          <Input value={form.ctaPrimaryLink} onChange={e => update("ctaPrimaryLink", e.target.value)} className="bg-secondary/50" placeholder="/test-drive" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Secondary CTA Text</Label>
          <Input value={form.ctaSecondary} onChange={e => update("ctaSecondary", e.target.value)} className="bg-secondary/50" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Secondary CTA Link</Label>
          <Input value={form.ctaSecondaryLink} onChange={e => update("ctaSecondaryLink", e.target.value)} className="bg-secondary/50" placeholder="/models/vf7" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Order</Label>
          <Input type="number" value={form.order} onChange={e => update("order", Number(e.target.value))} className="bg-secondary/50" />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <Switch checked={form.active} onCheckedChange={(v) => update("active", v)} />
          <Label className="text-xs">Active (visible on site)</Label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} className="bg-primary text-primary-foreground flex-1">Save Slide</Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">Cancel</Button>
      </div>
    </div>
  );
};

export default AdminHomepage;
