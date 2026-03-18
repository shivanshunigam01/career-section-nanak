import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit2, Trash2, Plus, Image, FileText, MessageCircle, Star } from "lucide-react";

interface Banner { id: string; title: string; subtitle: string; imageUrl: string; link: string; active: boolean; }
interface FAQ { id: string; question: string; answer: string; category: string; }
interface Testimonial { id: string; name: string; city: string; model: string; rating: number; text: string; }

const initialBanners: Banner[] = [
  { id: "B1", title: "VinFast Bihar Launch", subtitle: "Book your test drive today", imageUrl: "/banner-1.jpg", link: "/test-drive", active: true },
  { id: "B2", title: "VF Series — Design You Can Feel", subtitle: "Explore the lineup", imageUrl: "/banner-2.jpg", link: "/models/vf7", active: true },
];
const initialFaqs: FAQ[] = [
  { id: "F1", question: "What is the range of VF 7?", answer: "The VF 7 offers up to 431 km of range on a single charge.", category: "VF 7" },
  { id: "F2", question: "Is home charging available?", answer: "Yes, VinFast provides a complimentary home charger installation with every purchase.", category: "Charging" },
  { id: "F3", question: "What finance options are available?", answer: "We partner with leading banks to offer EMI options starting from ₹35,999/month.", category: "Finance" },
];
const initialTestimonials: Testimonial[] = [
  { id: "T1", name: "Rahul Kumar", city: "Patna", model: "VF 7", rating: 5, text: "Amazing car! The performance and tech features are unmatched at this price." },
  { id: "T2", name: "Priya Singh", city: "Patna", model: "VF 6", rating: 4, text: "Perfect city SUV. Love the design and the 5-star safety gives me confidence." },
];

const AdminContent = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [faqs, setFaqs] = useState(initialFaqs);
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Content Manager</h1>
        <p className="text-muted-foreground text-sm">Manage banners, FAQs, and testimonials</p>
      </div>

      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="banners" className="gap-1.5"><Image className="w-3.5 h-3.5" /> Banners</TabsTrigger>
          <TabsTrigger value="faqs" className="gap-1.5"><FileText className="w-3.5 h-3.5" /> FAQs</TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-1.5"><Star className="w-3.5 h-3.5" /> Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-3">
          {banners.map(b => (
            <Card key={b.id} className="bg-card border-border/50 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.subtitle} · {b.link}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setBanners(prev => prev.filter(x => x.id !== b.id))} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="faqs" className="space-y-3">
          {faqs.map(f => (
            <Card key={f.id} className="bg-card border-border/50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{f.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.answer}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground mt-2 inline-block">{f.category}</span>
                </div>
                <button onClick={() => setFaqs(prev => prev.filter(x => x.id !== f.id))} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-3">
          {testimonials.map(t => (
            <Card key={t.id} className="bg-card border-border/50 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <span className="text-xs text-muted-foreground">{t.city} · {t.model}</span>
                    <span className="text-amber-400 text-xs">{"★".repeat(t.rating)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">"{t.text}"</p>
                </div>
                <button onClick={() => setTestimonials(prev => prev.filter(x => x.id !== t.id))} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
