import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Globe,
  FileSearch,
  Activity,
  Bell,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  ChevronRight,

} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Globe,
    title: "URL Threat Detection",
    description: "Scan suspicious URLs in real-time to detect phishing, malware, and other web-based threats.",
  },
  {
    icon: FileSearch,
    title: "File & Document Scanning",
    description: "Upload files for deep analysis using advanced threat intelligence and signature matching.",
  },
  {
    icon: Activity,
    title: "Network Log Analysis",
    description: "Analyze network traffic logs to identify anomalies, intrusions, and suspicious patterns.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get instant notifications when threats are detected with severity-based color coding.",
  },
];

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="fixed inset-0 scan-line pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 border-b border-border bg-card/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground glow-primary-text">ThreatLens</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link to="/login">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-4 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >

          <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight">
            Detect. Analyze.{" "}
            <span className="text-primary glow-primary-text">
              Prevent
            </span>{" "}
            Cyber Threats.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ThreatLens provides real-time cyber threat detection with advanced URL scanning,
            file analysis, and network log monitoring to keep your digital assets secure.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-bold text-base px-8 py-6">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/scan-url">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 font-bold text-base px-8 py-6">
                Scan Now <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">threatLens://scanner</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-2">
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> threatlens scan --url https://suspicious-site.com
              </p>
              <p className="text-muted-foreground">
                <span className="text-accent">[INFO]</span> Initializing threat scanner...
              </p>
              <p className="text-muted-foreground">
                <span className="text-accent">[INFO]</span> Analyzing URL reputation...
              </p>
              <p className="text-muted-foreground">
                <span className="text-accent">[INFO]</span> Checking SSL certificate...
              </p>
              <p className="text-warning">
                <span className="text-warning">[WARN]</span> Suspicious redirect chain detected
              </p>
              <p className="text-destructive">
                <span className="text-destructive">[ALERT]</span> Phishing indicators found — Risk: HIGH
              </p>
              <p className="text-primary mt-2">
                ✓ Scan complete. Report saved to /reports/scan-2024-001.pdf
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Comprehensive <span className="text-primary">Security</span> Suite
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Everything you need to detect, analyze, and prevent cyber threats in one platform.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:glow-primary"
              >
                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              © 2026 ThreatLens. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
