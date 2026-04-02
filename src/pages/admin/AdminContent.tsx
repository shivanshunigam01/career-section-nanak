import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Plus, Image, FileText, Star } from "lucide-react";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import { getStoredState, setStoredState } from "@/lib/vfLocalStorage";

const STORAGE_KEY = "vf_admin_content";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  active: boolean;
}
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
interface Testimonial {
  id: string;
  name: string;
  city: string;
  model: string;
  rating: number;
  text: string;
  photo: string;
}

const initialBanners: Banner[] = [
  { id: "B1", title: "VinFast Bihar Launch", subtitle: "Book your test drive today", imageUrl: "", link: "/test-drive", active: true },
  { id: "B2", title: "VF Series — Design You Can Feel", subtitle: "Explore the lineup", imageUrl: "", link: "/models/vf7", active: true },
];
const initialFaqs: FAQ[] = [
  { id: "F1", question: "What is the range of VF 7?", answer: "The VF 7 offers up to 431 km of range on a single charge.", category: "VF 7" },
  { id: "F2", question: "Is home charging available?", answer: "Yes, VinFast provides a complimentary home charger installation with every purchase.", category: "Charging" },
  { id: "F3", question: "What finance options are available?", answer: "We partner with leading banks to offer EMI options starting from ₹21,890/month.", category: "Finance" },
];
const initialTestimonials: Testimonial[] = [
  { id: "T1", name: "Rahul Kumar", city: "Patna", model: "VF 7", rating: 5, text: "Amazing car! The performance and tech features are unmatched at this price.", photo: "" },
  { id: "T2", name: "Priya Singh", city: "Patna", model: "VF 6", rating: 4, text: "Perfect city SUV. Love the design and the 5-star safety gives me confidence.", photo: "" },
];

const emptyBanner: Banner = { id: "", title: "", subtitle: "", imageUrl: "", link: "/", active: true };
const emptyFaq: FAQ = { id: "", question: "", answer: "", category: "General" };
const emptyTestimonial: Testimonial = { id: "", name: "", city: "", model: "VF 7", rating: 5, text: "", photo: "" };

const AdminContent = () => {
  const [hydrated, setHydrated] = useState(false);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [editFaq, setEditFaq] = useState<FAQ | null>(null);
  const [editTestimonial, setEditTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    const stored = getStoredState<{ banners: Banner[]; faqs: FAQ[]; testimonials: Testimonial[] } | null>(STORAGE_KEY, null);
    if (stored) {
      setBanners(stored.banners ?? initialBanners);
      setFaqs(stored.faqs ?? initialFaqs);
      setTestimonials(stored.testimonials ?? initialTestimonials);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredState(STORAGE_KEY, { banners, faqs, testimonials });
  }, [banners, faqs, testimonials, hydrated]);

  const saveBanner = (b: Banner) => {
    if (b.id) setBanners(p => p.map(x => x.id === b.id ? b : x));
    else setBanners(p => [...p, { ...b, id: `B${p.length + 1}` }]);
    setEditBanner(null);
  };
  const saveFaq = (f: FAQ) => {
    if (f.id) setFaqs(p => p.map(x => x.id === f.id ? f : x));
    else setFaqs(p => [...p, { ...f, id: `F${p.length + 1}` }]);
    setEditFaq(null);
  };
  const saveTestimonial = (t: Testimonial) => {
    if (t.id) setTestimonials(p => p.map(x => x.id === t.id ? t : x));
    else setTestimonials(p => [...p, { ...t, id: `T${p.length + 1}` }]);
    setEditTestimonial(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Content Manager</h1>
        <p className="text-muted-foreground text-sm">Manage banners, FAQs, and testimonials</p>
      </div>

      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList className="bg-secondary/50 w-full overflow-x-auto justify-start">
          <TabsTrigger value="banners" className="gap-1.5"><Image className="w-3.5 h-3.5" /> Banners</TabsTrigger>
          <TabsTrigger value="faqs" className="gap-1.5"><FileText className="w-3.5 h-3.5" /> FAQs</TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-1.5"><Star className="w-3.5 h-3.5" /> Testimonials</TabsTrigger>
        </TabsList>

        {/* Banners */}
        <TabsContent value="banners" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setEditBanner(emptyBanner)} className="bg-primary text-primary-foreground gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Banner
            </Button>
          </div>
          {banners.map(b => (
            <Card key={b.id} className={`bg-card border-border/50 p-4 transition-opacity ${b.active ? "" : "opacity-50"}`}>
              <div className="flex flex-col sm:flex-row gap-4">
                {b.imageUrl
                  ? <div className="w-28 h-16 rounded-lg overflow-hidden flex-shrink-0"><img src={b.imageUrl} alt="banner" className="w-full h-full object-cover" /></div>
                  : <div className="w-28 h-16 rounded-lg bg-secondary/40 flex-shrink-0 flex items-center justify-center text-muted-foreground/30 text-xs">No image</div>
                }
                <div className="flex-1">
                  <p className="font-medium text-foreground">{b.title}</p>
                  <p className="text-xs text-muted-foreground">{b.subtitle}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">→ {b.link}</p>
                </div>
                <div className="flex items-start gap-1 flex-shrink-0">
                  <Switch checked={b.active} onCheckedChange={() => setBanners(p => p.map(x => x.id === b.id ? { ...x, active: !x.active } : x))} />
                  <button onClick={() => setEditBanner(b)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setBanners(p => p.filter(x => x.id !== b.id))} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* FAQs */}
        <TabsContent value="faqs" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setEditFaq(emptyFaq)} className="bg-primary text-primary-foreground gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </Button>
          </div>
          {faqs.map(f => (
            <Card key={f.id} className="bg-card border-border/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{f.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.answer}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground mt-2 inline-block">{f.category}</span>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditFaq(f)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setFaqs(p => p.filter(x => x.id !== f.id))} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setEditTestimonial(emptyTestimonial)} className="bg-primary text-primary-foreground gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Testimonial
            </Button>
          </div>
          {testimonials.map(t => (
            <Card key={t.id} className="bg-card border-border/50 p-4">
              <div className="flex gap-4">
                {t.photo
                  ? <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  : <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0 text-sm">{t.name[0]}</div>
                }
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <span className="text-xs text-muted-foreground">{t.city} · {t.model}</span>
                    <span className="text-amber-400 text-xs">{"★".repeat(t.rating)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">"{t.text}"</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditTestimonial(t)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setTestimonials(p => p.filter(x => x.id !== t.id))} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Banner Dialog */}
      <Dialog open={!!editBanner} onOpenChange={(open) => { if (!open) setEditBanner(null); }}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editBanner?.id ? "Edit Banner" : "Add Banner"}</DialogTitle></DialogHeader>
          {editBanner && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Banner Image</Label>
                <CloudinaryUpload value={editBanner.imageUrl} onUpload={(url) => setEditBanner({ ...editBanner, imageUrl: url })} label="Upload Banner Image" aspectRatio="16/6" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5"><Label className="text-xs">Title</Label><Input value={editBanner.title} onChange={e => setEditBanner({ ...editBanner, title: e.target.value })} className="bg-secondary/50" /></div>
                <div className="col-span-2 space-y-1.5"><Label className="text-xs">Subtitle</Label><Input value={editBanner.subtitle} onChange={e => setEditBanner({ ...editBanner, subtitle: e.target.value })} className="bg-secondary/50" /></div>
                <div className="col-span-2 space-y-1.5"><Label className="text-xs">Link</Label><Input value={editBanner.link} onChange={e => setEditBanner({ ...editBanner, link: e.target.value })} className="bg-secondary/50" placeholder="/models/vf7" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => saveBanner(editBanner)} className="bg-primary text-primary-foreground flex-1">Save</Button>
                <Button onClick={() => setEditBanner(null)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={!!editFaq} onOpenChange={(open) => { if (!open) setEditFaq(null); }}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editFaq?.id ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          {editFaq && (
            <div className="space-y-4">
              <div className="space-y-1.5"><Label className="text-xs">Question</Label><Input value={editFaq.question} onChange={e => setEditFaq({ ...editFaq, question: e.target.value })} className="bg-secondary/50" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Answer</Label><Textarea value={editFaq.answer} onChange={e => setEditFaq({ ...editFaq, answer: e.target.value })} className="bg-secondary/50" rows={3} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Category</Label><Input value={editFaq.category} onChange={e => setEditFaq({ ...editFaq, category: e.target.value })} className="bg-secondary/50" placeholder="VF 7, Charging, Finance..." /></div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => saveFaq(editFaq)} className="bg-primary text-primary-foreground flex-1">Save</Button>
                <Button onClick={() => setEditFaq(null)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={!!editTestimonial} onOpenChange={(open) => { if (!open) setEditTestimonial(null); }}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editTestimonial?.id ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
          {editTestimonial && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Customer Photo (optional)</Label>
                <CloudinaryUpload value={editTestimonial.photo} onUpload={(url) => setEditTestimonial({ ...editTestimonial, photo: url })} label="Upload Photo" aspectRatio="1/1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Name</Label><Input value={editTestimonial.name} onChange={e => setEditTestimonial({ ...editTestimonial, name: e.target.value })} className="bg-secondary/50" /></div>
                <div className="space-y-1.5"><Label className="text-xs">City</Label><Input value={editTestimonial.city} onChange={e => setEditTestimonial({ ...editTestimonial, city: e.target.value })} className="bg-secondary/50" /></div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Model</Label>
                  <select value={editTestimonial.model} onChange={e => setEditTestimonial({ ...editTestimonial, model: e.target.value })} className="h-10 w-full px-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none">
                    <option value="VF 7">VF 7</option>
                    <option value="VF 6">VF 6</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Rating</Label>
                  <select value={editTestimonial.rating} onChange={e => setEditTestimonial({ ...editTestimonial, rating: Number(e.target.value) })} className="h-10 w-full px-3 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none">
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} ★</option>)}
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5"><Label className="text-xs">Review Text</Label><Textarea value={editTestimonial.text} onChange={e => setEditTestimonial({ ...editTestimonial, text: e.target.value })} className="bg-secondary/50" rows={3} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={() => saveTestimonial(editTestimonial)} className="bg-primary text-primary-foreground flex-1">Save</Button>
                <Button onClick={() => setEditTestimonial(null)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;
