export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
        {/* Reuse the subtle hero background or a simplified version */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-background to-background pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md p-6">
        {children}
      </div>
    </div>
  )
}
