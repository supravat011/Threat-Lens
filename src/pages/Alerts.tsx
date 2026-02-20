import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ThreatBadge } from "@/components/ThreatBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Trash2, CheckCheck, Filter } from "lucide-react";
import { alertsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Alert {
    id: number;
    scan_type: string;
    scan_id: number;
    severity: "critical" | "medium" | "low";
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function Alerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [severityFilter, setSeverityFilter] = useState<string>("all");
    const { toast } = useToast();

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filter === "unread") params.unread = true;
            if (severityFilter !== "all") params.severity = severityFilter;

            const response = await alertsAPI.getAlerts(params);
            setAlerts(response.alerts);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to fetch alerts",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, [filter, severityFilter]);

    const handleMarkAsRead = async (alertId: number) => {
        try {
            await alertsAPI.markAsRead(alertId);
            setAlerts(alerts.map(a => a.id === alertId ? { ...a, is_read: true } : a));
            toast({
                title: "Success",
                description: "Alert marked as read",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to mark alert as read",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (alertId: number) => {
        try {
            await alertsAPI.deleteAlert(alertId);
            setAlerts(alerts.filter(a => a.id !== alertId));
            toast({
                title: "Success",
                description: "Alert deleted",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete alert",
                variant: "destructive",
            });
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await alertsAPI.markAllAsRead();
            setAlerts(alerts.map(a => ({ ...a, is_read: true })));
            toast({
                title: "Success",
                description: "All alerts marked as read",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to mark all as read",
                variant: "destructive",
            });
        }
    };

    const unreadCount = alerts.filter(a => !a.is_read).length;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "critical": return "destructive";
            case "medium": return "default";
            case "low": return "secondary";
            default: return "default";
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hr ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage your threat notifications
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            onClick={handleMarkAllAsRead}
                            variant="outline"
                            size="sm"
                            className="border-border text-foreground hover:bg-secondary"
                        >
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark All as Read
                        </Button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold font-mono text-foreground">{alerts.length}</p>
                            <p className="text-xs text-muted-foreground">Total Alerts</p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-destructive/30 bg-card p-5 flex items-center gap-4 glow-destructive">
                        <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                            <BellOff className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold font-mono text-foreground">{unreadCount}</p>
                            <p className="text-xs text-muted-foreground">Unread Alerts</p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Filter className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold font-mono text-foreground">
                                {alerts.filter(a => a.severity === "critical").length}
                            </p>
                            <p className="text-xs text-muted-foreground">Critical Alerts</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                    <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Alerts</SelectItem>
                            <SelectItem value="unread">Unread Only</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by severity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Severities</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Alerts List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading alerts...</div>
                    ) : alerts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No alerts found</div>
                    ) : (
                        alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`rounded-xl border ${alert.is_read ? "border-border" : "border-primary/30 glow-primary"
                                    } bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/20 transition-colors`}
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="flex flex-col gap-2">
                                        <Badge variant={getSeverityColor(alert.severity) as any} className="w-fit">
                                            {alert.severity.toUpperCase()}
                                        </Badge>
                                        {!alert.is_read && (
                                            <Badge variant="outline" className="w-fit text-xs">
                                                NEW
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">{alert.message}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-muted-foreground font-mono">
                                                {alert.scan_type.toUpperCase()} Scan #{alert.scan_id}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(alert.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!alert.is_read && (
                                        <Button
                                            onClick={() => handleMarkAsRead(alert.id)}
                                            variant="outline"
                                            size="sm"
                                            className="border-border text-foreground hover:bg-secondary"
                                        >
                                            <CheckCheck className="h-4 w-4 mr-1" />
                                            Mark Read
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => handleDelete(alert.id)}
                                        variant="outline"
                                        size="sm"
                                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
