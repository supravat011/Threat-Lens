import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThreatBadge } from "@/components/ThreatBadge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, File, Hash, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type FileResult = {
  name: string;
  hash: string;
  status: "safe" | "suspicious" | "malicious";
  confidence: number;
};

export default function UploadFile() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<FileResult | null>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setProgress(0);
    setResult(null);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 100));
      setProgress(i);
    }

    const statuses: Array<"safe" | "suspicious" | "malicious"> = ["safe", "suspicious", "malicious"];
    setResult({
      name: file.name,
      hash: "SHA256:" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      status: statuses[Math.floor(Math.random() * 3)],
      confidence: Math.floor(Math.random() * 30) + 70,
    });
    setScanning(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">File Upload & Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload files for deep threat analysis</p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
            dragOver ? "border-primary bg-primary/5 glow-primary" : "border-border bg-card hover:border-muted-foreground"
          }`}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-semibold mb-2">Drag & drop your file here</p>
          <p className="text-xs text-muted-foreground mb-4">Supports: EXE, PDF, DOC, ZIP, JS, PY, and more</p>
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary" asChild>
              <span>Browse Files</span>
            </Button>
          </label>
        </div>

        {/* Selected file */}
        {file && !scanning && !result && (
          <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <Button onClick={handleScan} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold">
              Scan File
            </Button>
          </div>
        )}

        {/* Progress */}
        {scanning && (
          <div className="rounded-xl border border-primary/30 bg-card p-8 space-y-4 animate-pulse-glow">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <p className="text-foreground font-semibold">Scanning {file?.name}...</p>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground font-mono">{progress}% complete</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Scan Result</h3>
              <ThreatBadge level={result.status} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">File:</span>
                <span className="text-foreground font-mono text-xs truncate">{result.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Hash:</span>
                <span className="text-foreground font-mono text-xs truncate">{result.hash}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Confidence:</span>
                <span className="text-foreground font-mono">{result.confidence}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
