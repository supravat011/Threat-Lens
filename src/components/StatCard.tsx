import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "destructive" | "warning";
  className?: string;
}

const variantClasses = {
  default: "border-border",
  primary: "border-primary/30 glow-primary",
  destructive: "border-destructive/30 glow-destructive",
  warning: "border-warning/30 glow-warning",
};

const iconVariantClasses = {
  default: "text-muted-foreground",
  primary: "text-primary",
  destructive: "text-destructive",
  warning: "text-warning",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default", className }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card p-6 transition-all duration-300 hover:bg-secondary/50",
      variantClasses[variant],
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className={cn("h-5 w-5", iconVariantClasses[variant])} />
      </div>
      <p className="mt-2 text-3xl font-bold font-mono tracking-tight text-foreground">{value}</p>
      {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
    </div>
  );
}
