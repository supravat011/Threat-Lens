import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Profile</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Name</Label>
              <Input defaultValue="Security Analyst" className="bg-input border-border text-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <Input defaultValue="analyst@threatlens.io" className="bg-input border-border text-foreground" />
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">Save Changes</Button>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "High-risk threat alerts", desc: "Get notified when malicious threats are detected", default: true },
              { label: "Scan completion", desc: "Notify when scans finish processing", default: true },
              { label: "Weekly summary reports", desc: "Receive weekly threat summaries via email", default: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.default} />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Security</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Current Password</Label>
              <Input type="password" placeholder="••••••••" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">New Password</Label>
              <Input type="password" placeholder="••••••••" className="bg-input border-border text-foreground placeholder:text-muted-foreground" />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary">Update Password</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
