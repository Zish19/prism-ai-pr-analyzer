"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { SignInButton, Show } from "@clerk/nextjs";
import { ArrowRight, ShieldAlert, Zap, LayoutTemplate, Activity, GitPullRequest } from "lucide-react";
import { ThemeToggle } from "@/components/prism/theme-toggle";

import { BRAND } from "@/constants/brand";
import { Button } from "@/components/ui/button";
import { BlueprintCrosshair } from "@/components/prism/blueprint-crosshair";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="relative overflow-hidden">
      
      {/* -------------------------------------------------------------
          Header
          ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 md:px-12 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="PRISM Logo" width={24} height={24} className="dark:invert" />
          <span className="font-mono font-bold tracking-widest text-lg text-foreground">{BRAND.shortName}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline" className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-white font-mono uppercase tracking-wider text-xs px-6 h-9 transition-all">
                Sign In
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <Button className="rounded-none bg-primary text-white hover:bg-primary/90 font-mono uppercase tracking-wider text-xs px-6 h-9 transition-all">
                Go to Dashboard
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </Link>
          </Show>
        </div>
      </header>

      {/* -------------------------------------------------------------
          Hero Section
          ------------------------------------------------------------- */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center pt-16 px-6 overflow-hidden">
        {/* Background Grid & Particles */}
        <motion.div 
          className="absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"
          style={{ y }}
        />
        
        {/* Crosshairs */}
        <BlueprintCrosshair className="top-1/4 left-1/4 opacity-30" />
        <BlueprintCrosshair className="top-3/4 right-1/4 opacity-30" />
        <BlueprintCrosshair className="top-[40%] right-[10%] opacity-30" />
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Image src="/logo.svg" alt="PRISM Logo" width={120} height={120} className="dark:invert drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-mono tracking-tight text-foreground mb-6"
          >
            THE AI REVIEWER <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">YOUR REPO DESERVES</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl font-mono leading-relaxed mb-10"
          >
            Instantly catch security vulnerabilities, performance bottlenecks, and architectural flaws in your pull requests before they hit main.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-4"
          >
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button className="rounded-none bg-primary text-white hover:bg-white hover:text-black font-mono uppercase tracking-widest text-sm px-8 h-12 transition-all group">
                  Start Analyzing
                  <ArrowRight className="size-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard">
                <Button className="rounded-none bg-primary text-white hover:bg-white hover:text-black font-mono uppercase tracking-widest text-sm px-8 h-12 transition-all group">
                  Enter Dashboard
                  <ArrowRight className="size-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Show>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">Scroll</span>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------
          How It Works
          ------------------------------------------------------------- */}
      <section className="py-32 px-6 bg-secondary/50 relative border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-primary mb-4">Workflow</h2>
            <h3 className="text-3xl md:text-5xl font-mono font-bold text-foreground">HOW IT WORKS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {[
              { step: "01", title: "Paste URL", desc: "Paste any public GitHub PR link into the analyzer.", icon: <GitPullRequest className="size-8" /> },
              { step: "02", title: "AI Analysis", desc: "Our engine parses the diff and runs 40+ specialized heuristics.", icon: <Activity className="size-8" /> },
              { step: "03", title: "Get Report", desc: "Review actionable feedback, security alerts, and performance metrics.", icon: <LayoutTemplate className="size-8" /> }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative bg-card border border-border p-8 rounded-none group hover:border-primary/50 transition-colors"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 text-6xl font-mono font-bold text-foreground/[0.03] group-hover:text-primary/10 transition-colors pointer-events-none">
                  {item.step}
                </div>
                
                <div className="size-16 bg-background border border-border flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                  {item.icon}
                </div>
                <h4 className="text-xl font-mono font-bold text-foreground mb-3">{item.title}</h4>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">{item.desc}</p>
                
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-foreground/20 group-hover:border-primary transition-colors" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-foreground/20 group-hover:border-primary transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          Features
          ------------------------------------------------------------- */}
      <section className="py-32 px-6 bg-background relative">
        <BlueprintCrosshair className="top-0 left-[10%] opacity-30" />
        <BlueprintCrosshair className="top-0 right-[10%] opacity-30" />

        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-emerald-500 mb-4">Heuristics</h2>
            <h3 className="text-3xl md:text-5xl font-mono font-bold text-foreground">INTELLIGENCE ENGINES</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Security Scanner", desc: "Detects exposed secrets, SQL injections, insecure eval(), and broken access controls.", icon: <ShieldAlert className="size-6" />, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
              { title: "Performance Profiler", desc: "Flags nested loops, excessive memory allocations, and inefficient DOM updates.", icon: <Zap className="size-6" />, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
              { title: "Architecture Lint", desc: "Evaluates cyclomatic complexity, massive functions, and separation of concerns.", icon: <LayoutTemplate className="size-6" />, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
              { title: "Code Quality", desc: "Catches leftover console.logs, uncommented code blocks, and confusing variable names.", icon: <Activity className="size-6" />, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex gap-6 p-8 bg-card border border-border hover:${feat.border} transition-colors group`}
              >
                <div className={`size-12 shrink-0 flex items-center justify-center ${feat.bg} ${feat.color} border border-transparent group-hover:${feat.border} transition-all`}>
                  {feat.icon}
                </div>
                <div>
                  <h4 className="text-lg font-mono font-bold text-foreground mb-2">{feat.title}</h4>
                  <p className="text-muted-foreground font-mono text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          CTA
          ------------------------------------------------------------- */}
      <section className="py-32 px-6 relative bg-primary/5 border-t border-primary/20 overflow-hidden">
        <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-mono font-bold text-foreground mb-8">READY TO SECURE YOUR CODE?</h2>
          
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button className="rounded-none bg-primary text-white hover:bg-white hover:text-black font-mono uppercase tracking-widest text-lg px-12 h-16 shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-all">
                Sign In With Google
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <Button className="rounded-none bg-primary text-white hover:bg-white hover:text-black font-mono uppercase tracking-widest text-lg px-12 h-16 shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-all">
                Launch Dashboard
              </Button>
            </Link>
          </Show>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-background border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="PRISM Logo" width={16} height={16} className="opacity-50 dark:invert" />
          <span>© 2026 PRISM AI. All rights reserved.</span>
        </div>
        <div className="flex gap-6 uppercase tracking-widest">
          <Link href="https://github.com/Zish19" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</Link>
        </div>
      </footer>
    </div>
  );
}
