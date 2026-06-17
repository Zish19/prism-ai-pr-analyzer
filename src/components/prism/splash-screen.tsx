"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  useEffect(() => {
    // Phase 1: Logo appears (0 → 800ms)
    const t1 = setTimeout(() => setPhase("text"), 800);
    // Phase 2: Text appears (800 → 2000ms)
    const t2 = setTimeout(() => setPhase("exit"), 2000);
    // Phase 3: Exit animation (2000 → 2600ms)
    const t3 = setTimeout(() => onComplete(), 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        key="splash"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0b0f] overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -60 }}
        animate={
          phase === "exit"
            ? { opacity: 0, y: -60 }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (phase === "exit") onComplete();
        }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        {/* Crosshair lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.04] -translate-x-1/2" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.04] -translate-y-1/2" />

        {/* Corner markers */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/10" />
        <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/10" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/10" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/10" />

        {/* Logo */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Glow behind logo */}
          <motion.div
            className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-150"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.3] }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          <Image
            src="/logo.svg"
            alt="PRISM Logo"
            width={100}
            height={100}
            className="relative z-10 invert"
            priority
          />

          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 border border-white/20"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.5,
              ease: "easeOut",
            }}
          />
        </motion.div>

        {/* PRISM text */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={
            phase === "text" || phase === "exit"
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-2xl font-mono font-bold tracking-[0.5em] uppercase text-white">
            PRISM
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-white/20" />
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
              AI PR Intelligence
            </p>
            <div className="h-px w-8 bg-white/20" />
          </div>
        </motion.div>

        {/* Loading bar at bottom */}
        <motion.div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-px bg-white/10 overflow-hidden"
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Version tag */}
        <motion.span
          className="absolute bottom-8 text-[9px] font-mono uppercase tracking-[0.3em] text-white/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          v0.1.0
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
