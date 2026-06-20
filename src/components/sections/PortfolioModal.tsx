import { useEffect } from 'react'
import type { PortfolioItem } from '../../lib/types'
import Button from '../common/Button'

interface Props {
  item: PortfolioItem
  onClose: () => void
}

export default function PortfolioModal({ item, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
        style={{ animation: 'slide-fade-in 0.3s cubic-bezier(0.4,0,0.2,1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="aspect-video w-full object-cover" />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-neutral-100">
            <span className="text-sm text-neutral-400">Project media coming soon</span>
          </div>
        )}
        <div className="p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{item.category}</p>
          <h3 className="mt-2 text-2xl font-semibold text-black">{item.title}</h3>
          {item.client_name && <p className="mt-1 text-sm text-neutral-500">Client: {item.client_name}</p>}
          <p className="mt-4 leading-relaxed text-neutral-600">{item.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded bg-black px-8 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-neutral-800"
              >
                Visit Live Site ↗
              </a>
            )}
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
