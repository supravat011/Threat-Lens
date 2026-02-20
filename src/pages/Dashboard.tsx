import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { ThreatBadge } from "@/components/ThreatBadge";
import { ScanLine, ShieldAlert, ShieldCheck, Bell } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const pieData = [
  { name: "Phishing", value: 35 },
  { name: "Malware", value: 25 },
  { name: "Ransomware", value: 15 },
  { name: "DDoS", value: 10 },
  { name: "Other", value: 15 },
];

const PIE_COLORS = ["#00ff88", "#00b8d4", "#ff5555", "#ffaa00", "#6366f1"];

const lineData = [
  { day: "Mon", scans: 12 },
  { day: "Tue", scans: 19 },
  { day: "Wed", scans: 8 },
  { day: "Thu", scans: 25 },
  { day: "Fri", scans: 32 },
  { day: "Sat", scans: 18 },
  { day: "Sun", scans: 14 },
];

const recentAlerts = [
  { id: 1, message: "Phishing URL detected in scan #1042", level: "malicious" as const, time: "2 min ago" },
  { id: 2, message: "Suspicious file hash match found", level: "suspicious" as const, time: "15 min ago" },
  { id: 3, message: "Network scan completed — no threats", level: "safe" as const, time: "1 hr ago" },
  { id: 4, message: "Anomalous traffic spike detected", level: "suspicious" as const, time: "3 hrs ago" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Threat detection overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Scans" value="1,247" icon={ScanLine} trend="+12% this week" variant="primary" />
          <StatCard title="Threats Detected" value="89" icon={ShieldAlert} trend="+3 today" variant="destructive" />
          <StatCard title="Safe Files" value="1,158" icon={ShieldCheck} trend="92.8% clean rate" variant="primary" />
          <StatCard title="Recent Alerts" value="7" icon={Bell} trend="4 unread" variant="warning" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Threat Types</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" stroke="none">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(220 30% 18%)", borderRadius: "8px", color: "hsl(160 20% 90%)", fontFamily: "JetBrains Mono" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Scan Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
                  <XAxis dataKey="day" stroke="hsl(215 20% 55%)" fontSize={12} fontFamily="JetBrains Mono" />
                  <YAxis stroke="hsl(215 20% 55%)" fontSize={12} fontFamily="JetBrains Mono" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(220 30% 18%)", borderRadius: "8px", color: "hsl(160 20% 90%)", fontFamily: "JetBrains Mono" }} />
                  <Line type="monotone" dataKey="scans" stroke="#00ff88" strokeWidth={2} dot={{ fill: "#00ff88", r: 4 }} activeDot={{ r: 6, fill: "#00ff88" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <ThreatBadge level={alert.level} />
                  <span className="text-sm text-foreground">{alert.message}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono whitespace-nowrap ml-4">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
