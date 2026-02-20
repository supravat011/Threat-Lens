import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThreatBadge } from "@/components/ThreatBadge";
import { Button } from "@/components/ui/button";
import { FileDown, FileBarChart, Calendar, Shield, Plus, Loader2 } from "lucide-react";
import { reportsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Report {
  id: number;
  report_type: string;
  generated_at: string;
  data: {
    statistics: {
      total_scans: number;
      threat_summary: {
        total_threats: number;
      };
    };
  };
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<"summary" | "detailed">("summary");
  const [days, setDays] = useState("7");
  const { toast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getReports(20);
      setReports(response.reports);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      await reportsAPI.generateReport(reportType, parseInt(days));
      toast({
        title: "Success",
        description: "Report generated successfully",
      });
      setDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId: number) => {
    try {
      const blob = await reportsAPI.downloadReport(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${reportId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Report downloaded",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const totalThreats = reports.reduce((sum, r) => sum + (r.data?.statistics?.threat_summary?.total_threats || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground text-sm mt-1">View and download threat reports</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Create a threat analysis report for a specific time period
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
                    <SelectTrigger id="report-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary Report</SelectItem>
                      <SelectItem value="detailed">Detailed Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days">Time Period</Label>
                  <Select value={days} onValueChange={setDays}>
                    <SelectTrigger id="days">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Last 24 hours</SelectItem>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateReport} disabled={generating}>
                  {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Generate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileBarChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">{reports.length}</p>
              <p className="text-xs text-muted-foreground">Total Reports</p>
            </div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-card p-5 flex items-center gap-4 glow-destructive">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">{totalThreats}</p>
              <p className="text-xs text-muted-foreground">Total Threats Found</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-foreground">
                {reports.length > 0 ? new Date(reports[0].generated_at).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Latest Report</p>
            </div>
          </div>
        </div>

        {/* Report list */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reports found. Generate your first report above.
            </div>
          ) : (
            reports.map((report) => {
              const threats = report.data?.statistics?.threat_summary?.total_threats || 0;
              const totalScans = report.data?.statistics?.total_scans || 0;
              const level = threats > 10 ? "malicious" : threats > 3 ? "suspicious" : "safe";

              return (
                <div
                  key={report.id}
                  className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <FileBarChart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {report.report_type === "summary" ? "Summary Report" : "Detailed Report"}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          RPT-{report.id.toString().padStart(3, "0")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.generated_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {threats} threat{threats !== 1 ? "s" : ""} / {totalScans} scans
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ThreatBadge level={level as any} />
                    <Button
                      onClick={() => handleDownload(report.id)}
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-secondary"
                    >
                      <FileDown className="h-4 w-4 mr-1" />
                      JSON
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
