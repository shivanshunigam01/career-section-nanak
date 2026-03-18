import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    dealerName: "Patliputra Auto",
    brand: "VinFast",
    phone: "+91 9876543210",
    email: "info@patliputraauto.com",
    whatsapp: "919876543210",
    address: "Boring Road, Patna, Bihar 800001",
    gstNo: "10AABCP1234Q1ZX",
    showroomHours: "Mon-Sat: 9:00 AM - 7:00 PM",
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Dealer information and configuration</p>
      </div>

      <Card className="bg-card border-border/50 p-5 space-y-4">
        <h3 className="font-display font-semibold text-foreground">Dealership Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
              <Input
                value={value}
                onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                className="bg-secondary/50"
              />
            </div>
          ))}
        </div>
        <Button className="bg-primary text-primary-foreground mt-2">Save Settings</Button>
      </Card>

      <Card className="bg-card border-border/50 p-5 space-y-3">
        <h3 className="font-display font-semibold text-foreground">API Configuration</h3>
        <p className="text-sm text-muted-foreground">Connect your Node/Express backend API endpoint here.</p>
        <div className="space-y-1.5">
          <Label className="text-xs">Backend API URL</Label>
          <Input placeholder="https://api.patliputraauto.com" className="bg-secondary/50" />
        </div>
        <Button variant="outline" className="mt-2">Test Connection</Button>
      </Card>
    </div>
  );
};

export default AdminSettings;
