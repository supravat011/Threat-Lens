import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

type ThreatLevel = "safe" | "suspicious" | "malicious";

interface ThreatBadgeProps {
  level: ThreatLevel;
  className?: string;
  showIcon?: boolean;
}

const config: Record<ThreatLevel, { label: string; classes: string; icon: typeof Shield }> = {
  safe: {
    label: "Safe",
    classes: "bg-success/10 text-success border-success/30 glow-primary",
    icon: ShieldCheck,
  },
  suspicious: {
    label: "Suspicious",
    classes: "bg-warning/10 text-warning border-warning/30 glow-warning",
    icon: ShieldAlert,
  },
  malicious: {
    label: "Malicious",
    classes: "bg-destructive/10 text-destructive border-destructive/30 glow-destructive",
    icon: ShieldAlert,
  },
};

export function ThreatBadge({ level, className, showIcon = true }: ThreatBadgeProps) {
  const { label, classes, icon: Icon } = config[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-medium", classes, className)}>
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}
