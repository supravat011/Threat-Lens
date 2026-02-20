import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThreatBadge } from "@/components/ThreatBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Search, Loader2, ExternalLink, Lock, AlertTriangle, CheckCircle } from "lucide-react";

type ScanResult = {
  status: "safe" | "suspicious" | "malicious";
  url: string;
  riskScore: number;
  details: string[];
};

export default function ScanUrl() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setScanning(true);
    setResult(null);

    // Simulate scan
    await new Promise((r) => setTimeout(r, 2500));

    const mockResults: ScanResult[] = [
      {
        status: "malicious",
        url,
        riskScore: 92,
        details: [
          "Phishing indicators detected in page content",
          "Domain registered within last 7 days",
          "SSL certificate mismatch",
          "Known malicious redirect chain",
        ],
      },
      {
        status: "suspicious",
        url,
        riskScore: 56,
        details: [
          "Unusual redirect pattern detected",
          "Mixed content warnings",
          "Domain reputation: Low",
        ],
      },
      {
        status: "safe",
        url,
        riskScore: 8,
        details: [
          "Valid SSL certificate",
          "Domain age: 5+ years",
          "No malicious indicators found",
          "Clean reputation score",
        ],
      },
    ];

    setResult(mockResults[Math.floor(Math.random() * 3)]);
    setScanning(false);
  };

  const riskColor = result
    ? result.status === "malicious"
      ? "text-destructive"
      : result.status === "suspicious"
      ? "text-warning"
      : "text-success"
    : "";

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">URL Scanner</h1>
          <p className="text-muted-foreground text-sm mt-1">Analyze URLs for potential threats</p>
        </div>

        {/* Input */}
        <form onSubmit={handleScan} className="rounded-xl border border-border bg-card p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to scan (e.g., https://suspicious-site.com)"
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={scanning || !url}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold px-6"
            >
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">{scanning ? "Scanning..." : "Scan"}</span>
            </Button>
          </div>
        </form>

        {/* Loading */}
        {scanning && (
          <div className="rounded-xl border border-primary/30 bg-card p-8 text-center animate-pulse-glow">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-semibold">Analyzing URL...</p>
            <p className="text-muted-foreground text-sm mt-1 font-mono">Running threat intelligence checks</p>
          </div>
        )}

        {/* Result */}
        {result && !scanning && (
          <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Scan Result</p>
                <ThreatBadge level={result.status} />
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                <p className={`text-3xl font-bold font-mono ${riskColor}`}>{result.riskScore}%</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <span className="truncate">{result.url}</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Analysis Summary</p>
                {result.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {result.status === "safe" ? (
                      <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    ) : result.status === "suspicious" ? (
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    )}
                    <span className="text-muted-foreground">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
