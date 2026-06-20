/* Animated, monochrome backgrounds for service cards — pure CSS, one variant
   per service icon key. Intensity stays subtle; hover lifts the card itself. */

function MarqueeRow({ words, duration, reverse = false }: { words: string[]; duration: number; reverse?: boolean }) {
  const row = [...words, ...words] // duplicated for seamless loop
  return (
    <div className="flex overflow-hidden">
      <div
        className="flex shrink-0 gap-2 pr-2"
        style={{
          animation: `marquee ${duration}s linear infinite${reverse ? ' reverse' : ''}`,
        }}
      >
        {row.map((w, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded border border-neutral-200 bg-white px-2 py-0.5 text-[10px] text-neutral-400"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}

function WebDesignArt() {
  // shifting layout skeleton
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="h-2 w-16 rounded bg-neutral-300" style={{ animation: 'pulse-dot 3s ease-in-out infinite' }} />
      <div className="grid flex-1 grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded bg-neutral-200"
            style={{ animation: `float-y 4s ease-in-out ${i * 0.5}s infinite` }}
          />
        ))}
      </div>
      <div className="h-4 w-20 rounded bg-neutral-800" style={{ animation: 'float-y 4s ease-in-out 0.8s infinite' }} />
    </div>
  )
}

function BrandingArt() {
  // fanned identity cards slowly breathing
  return (
    <div className="relative h-full">
      {[
        { r: -10, x: '12%', d: 0 },
        { r: 0, x: '32%', d: 0.6 },
        { r: 10, x: '52%', d: 1.2 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute top-1/2 h-3/5 w-1/3 -translate-y-1/2 rounded border border-neutral-200 bg-white shadow-sm"
          style={{
            left: c.x,
            rotate: `${c.r}deg`,
            animation: `float-y 5s ease-in-out ${c.d}s infinite`,
          }}
        >
          <div className="m-2 h-5 w-5 rounded-full border-2 border-neutral-800" />
          <div className="mx-2 mt-1 h-1.5 w-3/5 rounded bg-neutral-300" />
          <div className="mx-2 mt-1 h-1.5 w-2/5 rounded bg-neutral-200" />
        </div>
      ))}
    </div>
  )
}

function StoreArt() {
  // product tags drifting by
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      <MarqueeRow words={['TEES', 'HOODIES', 'CAPS', 'DENIM', 'DROPS']} duration={18} />
      <MarqueeRow words={['NEW IN', 'CHECKOUT', 'CART', 'RESTOCK', 'SALE']} duration={24} reverse />
      <MarqueeRow words={['SHIPPING', 'LOOKBOOK', 'SIZES', 'RETURNS', 'FITS']} duration={20} />
    </div>
  )
}

function StrategyArt() {
  // rising bars
  return (
    <div className="flex h-full items-end justify-center gap-2 p-5">
      {[0.5, 0.8, 0.4, 1, 0.65, 0.9].map((h, i) => (
        <div
          key={i}
          className="w-4 origin-bottom rounded-t bg-neutral-300"
          style={{ height: `${h * 100}%`, animation: `bar-grow 3.2s ease-in-out ${i * 0.3}s infinite` }}
        />
      ))}
    </div>
  )
}

function ConsultationArt() {
  // chat bubbles pulsing in sequence
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-5">
      {[
        { w: '60%', self: false, d: 0 },
        { w: '45%', self: true, d: 1 },
        { w: '70%', self: false, d: 2 },
      ].map((b, i) => (
        <div
          key={i}
          className={`h-6 rounded-xl ${b.self ? 'self-end bg-neutral-800' : 'self-start bg-neutral-200'}`}
          style={{ width: b.w, animation: `pulse-dot 4.5s ease-in-out ${b.d}s infinite` }}
        />
      ))}
    </div>
  )
}

function ManagementArt() {
  // checklist ticking
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2" style={{ animation: `tick-in 4s ease ${i * 1.2}s infinite` }}>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">✓</span>
          <span className={`h-2 rounded bg-neutral-200 ${i === 0 ? 'w-2/3' : i === 1 ? 'w-1/2' : 'w-3/5'}`} />
        </div>
      ))}
    </div>
  )
}

const ART: Record<string, () => React.JSX.Element> = {
  layout: WebDesignArt,
  'pen-tool': BrandingArt,
  'shopping-bag': StoreArt,
  compass: StrategyArt,
  'message-circle': ConsultationArt,
  settings: ManagementArt,
}

export default function ServiceArt({ icon }: { icon: string }) {
  const Art = ART[icon] ?? WebDesignArt
  return (
    <div className="h-32 overflow-hidden rounded border border-neutral-100 bg-neutral-50" aria-hidden="true">
      <Art />
    </div>
  )
}
