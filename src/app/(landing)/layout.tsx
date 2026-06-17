export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#0a0b0f] selection:bg-primary/30 font-sans text-foreground">
      {children}
    </div>
  );
}
