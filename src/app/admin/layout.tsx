export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--charcoal)] text-white">
      {children}
    </div>
  );
}
