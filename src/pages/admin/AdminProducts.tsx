import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit2, Trash2, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  tagline: string;
  priceFrom: string;
  range: string;
  battery: string;
  power: string;
  safety: string;
  variants: string;
}

const initialProducts: Product[] = [
  { id: "P1", name: "VinFast VF 7", tagline: "Bold. Intelligent. Unstoppable.", priceFrom: "₹43.90 Lakh", range: "431 km", battery: "75.3 kWh", power: "349 HP", safety: "5-Star NCAP", variants: "Plus, Eco" },
  { id: "P2", name: "VinFast VF 6", tagline: "Urban. Smart. Agile.", priceFrom: "₹24.99 Lakh", range: "381 km", battery: "59.6 kWh", power: "201 HP", safety: "5-Star NCAP", variants: "Plus, Eco" },
];

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyProduct: Product = { id: "", name: "", tagline: "", priceFrom: "", range: "", battery: "", power: "", safety: "", variants: "" };

  const handleSave = (product: Product) => {
    if (product.id) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, { ...product, id: `P${prev.length + 1}` }]);
    }
    setShowForm(false);
    setEditProduct(null);
  };

  const handleDelete = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm">Manage car models and specs</p>
        </div>
        <Button onClick={() => { setEditProduct(emptyProduct); setShowForm(true); }} className="bg-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="bg-card border-border/50 p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditProduct(p); setShowForm(true); }} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Price:</span> <span className="text-foreground">{p.priceFrom}</span></div>
              <div><span className="text-muted-foreground">Range:</span> <span className="text-foreground">{p.range}</span></div>
              <div><span className="text-muted-foreground">Battery:</span> <span className="text-foreground">{p.battery}</span></div>
              <div><span className="text-muted-foreground">Power:</span> <span className="text-foreground">{p.power}</span></div>
              <div><span className="text-muted-foreground">Safety:</span> <span className="text-foreground">{p.safety}</span></div>
              <div><span className="text-muted-foreground">Variants:</span> <span className="text-foreground">{p.variants}</span></div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditProduct(null); }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader><DialogTitle className="font-display">{editProduct?.id ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          {editProduct && (
            <ProductForm product={editProduct} onSave={handleSave} onCancel={() => { setShowForm(false); setEditProduct(null); }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductForm = ({ product, onSave, onCancel }: { product: Product; onSave: (p: Product) => void; onCancel: () => void }) => {
  const [form, setForm] = useState(product);
  const update = (key: keyof Product, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5"><Label className="text-xs">Model Name</Label><Input value={form.name} onChange={e => update("name", e.target.value)} className="bg-secondary/50" /></div>
        <div className="col-span-2 space-y-1.5"><Label className="text-xs">Tagline</Label><Input value={form.tagline} onChange={e => update("tagline", e.target.value)} className="bg-secondary/50" /></div>
        <div className="space-y-1.5"><Label className="text-xs">Price From</Label><Input value={form.priceFrom} onChange={e => update("priceFrom", e.target.value)} className="bg-secondary/50" /></div>
        <div className="space-y-1.5"><Label className="text-xs">Range</Label><Input value={form.range} onChange={e => update("range", e.target.value)} className="bg-secondary/50" /></div>
        <div className="space-y-1.5"><Label className="text-xs">Battery</Label><Input value={form.battery} onChange={e => update("battery", e.target.value)} className="bg-secondary/50" /></div>
        <div className="space-y-1.5"><Label className="text-xs">Power</Label><Input value={form.power} onChange={e => update("power", e.target.value)} className="bg-secondary/50" /></div>
        <div className="space-y-1.5"><Label className="text-xs">Safety</Label><Input value={form.safety} onChange={e => update("safety", e.target.value)} className="bg-secondary/50" /></div>
        <div className="space-y-1.5"><Label className="text-xs">Variants</Label><Input value={form.variants} onChange={e => update("variants", e.target.value)} className="bg-secondary/50" /></div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={() => onSave(form)} className="bg-primary text-primary-foreground flex-1">Save</Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">Cancel</Button>
      </div>
    </div>
  );
};

export default AdminProducts;
