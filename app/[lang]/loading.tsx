export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-6">
        <p className="font-display text-3xl font-light italic text-ink">Taxsi</p>
        <div className="relative h-px w-32 overflow-hidden bg-clay/15">
          <span
            className="absolute inset-y-0 left-0 w-1/3 bg-gold"
            style={{ animation: 'loading-shuttle 1.4s ease-in-out infinite' }}
          />
        </div>
      </div>
      <style>{`
        @keyframes loading-shuttle {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
