import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThreatBadge } from "@/components/ThreatBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, Filter } from "lucide-react";

const scans = [
  { id: "SCN-1042", type: "URL", target: "https://phish-site.xyz", date: "2026-02-09 14:23", status: "malicious" as const },
  { id: "SCN-1041", type: "File", target: "document.pdf", date: "2026-02-09 13:10", status: "suspicious" as const },
  { id: "SCN-1040", type: "Log", target: "server-access.log", date: "2026-02-09 11:45", status: "safe" as const },
  { id: "SCN-1039", type: "URL", target: "https://safe-domain.com", date: "2026-02-08 16:30", status: "safe" as const },
  { id: "SCN-1038", type: "File", target: "setup.exe", date: "2026-02-08 10:15", status: "malicious" as const },
  { id: "SCN-1037", type: "URL", target: "https://suspicious-link.net", date: "2026-02-07 22:05", status: "suspicious" as const },
  { id: "SCN-1036", type: "Log", target: "firewall.log", date: "2026-02-07 09:00", status: "safe" as const },
  { id: "SCN-1035", type: "File", target: "invoice.docx", date: "2026-02-06 15:44", status: "safe" as const },
];

export default function ScanHistory() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const filtered = scans.filter((s) => {
    if (search && !s.target.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (levelFilter !== "all" && s.status !== levelFilter) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
          <p className="text-muted-foreground text-sm mt-1">Review past scans and results</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-input border-border text-foreground">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="URL">URL</SelectItem>
              <SelectItem value="File">File</SelectItem>
              <SelectItem value="Log">Log</SelectItem>
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-40 bg-input border-border text-foreground">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Threat Level" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="safe">Safe</SelectItem>
              <SelectItem value="suspicious">Suspicious</SelectItem>
              <SelectItem value="malicious">Malicious</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium font-mono text-xs">Scan ID</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium font-mono text-xs">Type</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium font-mono text-xs">Target</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium font-mono text-xs">Date & Time</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium font-mono text-xs">Status</th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium font-mono text-xs">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((scan) => (
                  <tr key={scan.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-primary text-xs">{scan.id}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-secondary/50 px-2 py-0.5 text-xs text-foreground">{scan.type}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground font-mono text-xs truncate max-w-[200px]">{scan.target}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{scan.date}</td>
                    <td className="px-4 py-3"><ThreatBadge level={scan.status} /></td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 h-8 px-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">No scans match your filters</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
