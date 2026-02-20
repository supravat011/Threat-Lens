import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const anomalyData = [
  { time: "00:00", normal: 120, anomalous: 3 },
  { time: "04:00", normal: 80, anomalous: 1 },
  { time: "08:00", normal: 200, anomalous: 8 },
  { time: "12:00", normal: 350, anomalous: 15 },
  { time: "16:00", normal: 280, anomalous: 45 },
  { time: "20:00", normal: 150, anomalous: 5 },
];

const trafficData = [
  { time: "00:00", inbound: 45, outbound: 30 },
  { time: "04:00", inbound: 25, outbound: 18 },
  { time: "08:00", inbound: 89, outbound: 67 },
  { time: "12:00", inbound: 130, outbound: 95 },
  { time: "16:00", inbound: 210, outbound: 180 },
  { time: "20:00", inbound: 75, outbound: 50 },
];

export default function LogAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 2000));
    setScanned(true);
    setScanning(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Log File Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload and analyze network log files</p>
        </div>

        {/* Upload */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <input type="file" className="hidden" accept=".log,.txt,.csv" onChange={(e) => { setFile(e.target.files?.[0] || null); setScanned(false); }} />
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3 hover:border-primary/50 transition-colors">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : "Select log file (.log, .txt, .csv)"}
              </span>
            </div>
          </label>
          <Button onClick={handleScan} disabled={!file || scanning} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold">
            {scanning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
            {scanning ? "Analyzing..." : "Scan Logs"}
          </Button>
        </div>

        {/* Log preview */}
        {file && !scanned && !scanning && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Log Preview</h3>
            <div className="bg-secondary/30 rounded-lg p-4 font-mono text-xs text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
              <p>[2026-02-09 08:15:23] INFO: Connection established from 192.168.1.105</p>
              <p>[2026-02-09 08:15:24] INFO: GET /api/dashboard 200 OK</p>
              <p>[2026-02-09 08:15:30] WARN: Multiple failed auth attempts from 10.0.0.42</p>
              <p>[2026-02-09 08:15:45] ERROR: Unauthorized access attempt to /admin/config</p>
              <p>[2026-02-09 08:16:01] INFO: Rate limiter triggered for IP 10.0.0.42</p>
            </div>
          </div>
        )}

        {/* Results */}
        {scanned && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Detected Anomalies</h3>
              <div className="space-y-3">
                {[
                  { text: "Brute force attempt from IP 10.0.0.42 (47 failed logins)", level: "destructive" },
                  { text: "Unusual outbound traffic spike at 16:00 UTC", level: "warning" },
                  { text: "SQL injection attempt in query parameters", level: "destructive" },
                  { text: "Normal traffic pattern on port 443", level: "safe" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {item.level === "safe" ? (
                      <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    ) : (
                      <AlertTriangle className={`h-4 w-4 shrink-0 ${item.level === "destructive" ? "text-destructive" : "text-warning"}`} />
                    )}
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Anomaly Detection</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={anomalyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
                      <XAxis dataKey="time" stroke="hsl(215 20% 55%)" fontSize={11} fontFamily="JetBrains Mono" />
                      <YAxis stroke="hsl(215 20% 55%)" fontSize={11} fontFamily="JetBrains Mono" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(220 30% 18%)", borderRadius: "8px", color: "hsl(160 20% 90%)", fontFamily: "JetBrains Mono" }} />
                      <Bar dataKey="normal" fill="#00ff88" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="anomalous" fill="#ff5555" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Traffic Behavior</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
                      <XAxis dataKey="time" stroke="hsl(215 20% 55%)" fontSize={11} fontFamily="JetBrains Mono" />
                      <YAxis stroke="hsl(215 20% 55%)" fontSize={11} fontFamily="JetBrains Mono" />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 9%)", border: "1px solid hsl(220 30% 18%)", borderRadius: "8px", color: "hsl(160 20% 90%)", fontFamily: "JetBrains Mono" }} />
                      <Area type="monotone" dataKey="inbound" fill="#00ff8833" stroke="#00ff88" />
                      <Area type="monotone" dataKey="outbound" fill="#00b8d433" stroke="#00b8d4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
