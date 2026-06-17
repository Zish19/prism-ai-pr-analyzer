"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const toys = [
  { id: 1, content: "🍎", size: 64, color: "bg-rose-500/10 border-rose-500/30", radius: "rounded-full" },
  { id: 2, content: "🥑", size: 80, color: "bg-emerald-500/10 border-emerald-500/30", radius: "rounded-[40%_60%_70%_30%/40%_50%_60%_50%]" },
  { id: 3, content: "🚀", size: 64, color: "bg-blue-500/10 border-blue-500/30", radius: "rounded-full" },
  { id: 4, content: "🥎", size: 56, color: "bg-lime-500/10 border-lime-500/30", radius: "rounded-full" },
  { id: 5, content: "🍔", size: 96, color: "bg-amber-500/10 border-amber-500/30", radius: "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]" },
  { id: 6, content: "🎸", size: 64, color: "bg-purple-500/10 border-purple-500/30", radius: "rounded-[50%_50%_30%_70%/50%_50%_70%_30%]" },
  { id: 7, content: "🧸", size: 80, color: "bg-orange-500/10 border-orange-500/30", radius: "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]" },
];

export function InteractiveToy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies;

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    
    // Lower gravity for a floating "toy" feel
    engine.world.gravity.y = 0.8;

    const width = containerRef.current.clientWidth;
    const height = 256; // h-64 = 256px

    // Create walls (invisible boundaries)
    const wallOptions = { isStatic: true, render: { visible: false } };
    const walls = [
      Bodies.rectangle(width / 2, -50, width, 100, wallOptions), // top
      Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions), // bottom
      Bodies.rectangle(-50, height / 2, 100, height, wallOptions), // left
      Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions) // right
    ];
    World.add(world, walls);

    // Create bodies
    const bodies = toys.map((toy, index) => {
      // Scatter them across the width
      const x = (width / (toys.length + 1)) * (index + 1);
      const y = Math.random() * 100 + 50;
      
      return Bodies.circle(x, y, toy.size / 2, {
        restitution: 0.6, // Bounciness
        friction: 0.1,
        frictionAir: 0.01,
        density: 0.005,
      });
    });

    World.add(world, bodies);

    // Add mouse control
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    World.add(world, mouseConstraint);

    // Sync DOM elements with Matter.js bodies
    let rafId: number;
    const updateDOM = () => {
      bodies.forEach((body, index) => {
        const el = elementsRef.current[index];
        if (el) {
          const { x, y } = body.position;
          el.style.transform = `translate(${x - toys[index].size / 2}px, ${y - toys[index].size / 2}px) rotate(${body.angle}rad)`;
        }
      });
      rafId = requestAnimationFrame(updateDOM);
    };
    rafId = requestAnimationFrame(updateDOM);

    // Run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      Matter.Body.setPosition(walls[3], { x: newWidth + 50, y: height / 2 });
      Matter.Body.setPosition(walls[0], { x: newWidth / 2, y: -50 });
      Matter.Body.setPosition(walls[1], { x: newWidth / 2, y: height + 50 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      Runner.stop(runner);
      Engine.clear(engine);
      World.clear(world, false);
    };
  }, []);

  return (
    <div 
      className="w-full h-64 border-t border-border/50 relative overflow-hidden flex items-center justify-center bg-background"
      ref={containerRef}
    >
      {/* Background Hint */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50 select-none">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Physics Playground</span>
        <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest mt-1">Grab and throw the toys!</span>
      </div>

      {/* DOM Elements linked to Physics Bodies */}
      <div className="absolute inset-0 pointer-events-none">
        {toys.map((toy, index) => (
          <div
            key={toy.id}
            ref={(el) => {
              elementsRef.current[index] = el;
            }}
            style={{
              width: toy.size,
              height: toy.size,
              position: "absolute",
              top: 0,
              left: 0,
            }}
            className={`flex items-center justify-center backdrop-blur-md border shadow-xl ${toy.color} ${toy.radius} pointer-events-auto active:cursor-grabbing hover:scale-105 transition-transform duration-75`}
            onMouseDown={(e) => {
              // Ensure cursor change happens instantly before physics catches it
              e.currentTarget.style.cursor = 'grabbing';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.cursor = 'grab';
            }}
          >
            <span className="text-3xl select-none drop-shadow-md pointer-events-none">{toy.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
