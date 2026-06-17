export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background selection:bg-primary/30 font-sans text-foreground">
      {children}
    </div>
  );
}
