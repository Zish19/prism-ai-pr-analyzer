"use client";

import { motion } from "motion/react";
import { Shield, Gauge, GitPullRequest, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/prism/glass-panel";
import { MetricCard } from "@/components/prism/metric-card";
import { SectionHeading } from "@/components/prism/section-heading";
import { Badge } from "@/components/ui/badge";

/* -------------------------------------------------------------------
   Container animation orchestrator
   ------------------------------------------------------------------- */
const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

/* ===================================================================
   Page
   =================================================================== */
export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden">
      {/* ---- Animated gradient background ---- */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Base dark */}
        <div className="absolute inset-0 bg-background" />

        {/* Grid + radial glow */}
        <div className="absolute inset-0 prism-grid-bg" />

        {/* Noise */}
        <div className="absolute inset-0 prism-noise" />

        {/* Orbiting gradient blobs */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3">
          <div className="h-[600px] w-[900px] rounded-full bg-[var(--prism-purple)] opacity-[0.07] blur-[120px]" />
        </div>
        <div className="absolute right-0 top-1/2 translate-x-1/4 -translate-y-1/2">
          <div className="h-[400px] w-[500px] rounded-full bg-[var(--prism-cyan)] opacity-[0.05] blur-[100px]" />
        </div>
      </div>

      {/* ---- Content ---- */}
      <motion.main
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-16 px-6 py-24 sm:py-32"
      >
        {/* === Hero === */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-6 text-center">
          {/* Status badge */}
          <Badge variant="default" size="lg" className="gap-2">
            <Sparkles className="size-3.5" />
            Phase 1 — Foundation Ready
          </Badge>

          {/* Logo */}
          <h1 className="text-7xl font-extrabold tracking-[-0.04em] sm:text-8xl lg:text-9xl">
            <span className="prism-gradient-text">PRISM</span>
          </h1>

          {/* Tagline */}
          <p className="max-w-md text-lg text-muted-foreground sm:text-xl">
            AI-Powered Pull Request Intelligence
          </p>

          {/* CTA */}
          <div className="mt-4 flex gap-3">
            <Button variant="gradient" size="xl">
              <GitPullRequest className="size-5" />
              Analyze Pull Request
            </Button>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* === Section heading === */}
        <SectionHeading
          title="Real-time Analysis"
          subtitle="Instant AI-powered insights across security, performance, and code quality dimensions."
          gradient
          delay={0.4}
        />

        {/* === Metric cards === */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            icon={Shield}
            label="Security Score"
            value="94"
            subtitle="2 low-risk issues found"
            trend="up"
            trendValue="+3"
            accentColor="success"
            delay={0.5}
          />
          <MetricCard
            icon={Gauge}
            label="Code Quality"
            value="A+"
            subtitle="Exceeds team standards"
            trend="up"
            trendValue="+12%"
            accentColor="purple"
            delay={0.6}
          />
          <MetricCard
            icon={GitPullRequest}
            label="Merge Probability"
            value="87%"
            subtitle="Based on 14 analysis signals"
            trend="neutral"
            accentColor="cyan"
            delay={0.7}
          />
        </div>

        {/* === Glass panel preview === */}
        <GlassPanel
          variant="bordered"
          padding="lg"
          className="w-full max-w-2xl"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--prism-purple)]/10">
              <Sparkles className="size-6 text-[var(--prism-purple)]" />
            </div>
            <h3 className="text-lg font-semibold">
              Design System Initialized
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Theme tokens, glassmorphism primitives, and component architecture
              are ready. Phase 2 will build the full analysis dashboard.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Badge variant="success" glow>Active</Badge>
              <Badge variant="default">Next.js 16</Badge>
              <Badge variant="default">TypeScript</Badge>
              <Badge variant="default">Tailwind v4</Badge>
              <Badge variant="default">shadcn/ui</Badge>
            </div>
          </div>
        </GlassPanel>

        {/* === Footer note === */}
        <motion.p
          variants={fadeUp}
          className="text-xs text-muted-foreground/60"
        >
          PRISM v0.1.0 · Phase 1 Foundation
        </motion.p>
      </motion.main>
    </div>
  );
}
