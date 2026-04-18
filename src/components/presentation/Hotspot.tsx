import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type HotspotDef, TAG_COLORS } from './slideData'

interface HotspotProps {
  def: HotspotDef
  visible: boolean
  onClose?: () => void   // called when user dismisses (reveals next hotspot)
  actionButton?: {
    label: string
    onClick: () => void
  }
}

export function Hotspot({ def, visible, onClose, actionButton }: HotspotProps) {
  const { top, left, annotation } = def
  const [isOpen, setIsOpen] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down'>('down')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Reset open state when visibility changes
  useEffect(() => {
    if (!visible) setIsOpen(false)
  }, [visible])

  // Close on click-outside
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // Flip direction + clamp horizontal overflow after popover mounts
  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current || !popoverRef.current) return

    const btnRect = buttonRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - btnRect.bottom
    const spaceAbove = btnRect.top
    setDirection(spaceBelow < 260 && spaceAbove > 260 ? 'up' : 'down')

    popoverRef.current.style.transform = 'translateX(-50%)'
    requestAnimationFrame(() => {
      if (!popoverRef.current) return
      const popRect = popoverRef.current.getBoundingClientRect()
      if (popRect.right > window.innerWidth - 16) {
        const overflow = popRect.right - (window.innerWidth - 16)
        popoverRef.current.style.transform = `translateX(calc(-50% - ${overflow}px))`
      } else if (popRect.left < 16) {
        const overflow = 16 - popRect.left
        popoverRef.current.style.transform = `translateX(calc(-50% + ${overflow}px))`
      }
    })
  }, [isOpen])

  function handleDismiss() {
    setIsOpen(false)
    onClose?.()
  }

  function handleActionClick() {
    setIsOpen(false)
    onClose?.()          // also advances to next hotspot
    actionButton?.onClick()
  }

  if (!visible) return null

  return (
    <div
      className="absolute pointer-events-auto"
      style={{ top, left, transform: 'translate(-50%, -50%)', zIndex: isOpen ? 9999 : 30 }}
    >
      {/* Pulse rings — hidden when popover is open */}
      {!isOpen && (
        <>
          <div
            className="absolute inset-0 rounded-full bg-linx-yellow/50 animate-pulse-ring"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="absolute inset-0 rounded-full bg-linx-yellow/30 animate-pulse-ring"
            style={{ animationDelay: '0.5s' }}
          />
        </>
      )}

      {/* Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(v => !v)}
        className={cn(
          'relative z-10 flex h-7 w-7 items-center justify-center rounded-full',
          'bg-linx-yellow border-2 border-slate-900 shadow-offset',
          'text-xs font-black text-slate-900',
          'transition-transform duration-150',
          isOpen ? 'scale-110 shadow-offset-md' : 'hover:scale-110',
        )}
        aria-label={`Hotspot ${annotation.number}: ${annotation.title}`}
      >
        {annotation.number}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={cn(
            'absolute w-72 rounded-xl border border-slate-200 bg-white shadow-offset-md',
            'animate-scale-in left-1/2',
            direction === 'down' ? 'top-[calc(100%+10px)]' : 'bottom-[calc(100%+10px)]',
          )}
          style={{ transform: 'translateX(-50%)', zIndex: 9999 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 rounded-t-xl border-b border-slate-100 bg-slate-50 px-3 py-2.5">
            <span className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold',
              TAG_COLORS[annotation.tag],
            )}>
              {annotation.tag}
            </span>
            {/* Green checkmark "done" button — replaces old X */}
            <button
              onClick={handleDismiss}
              title="Got it — show next"
              className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white transition-all hover:bg-green-600 hover:scale-110"
            >
              <Check size={11} strokeWidth={3} />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 py-3">
            <div className="flex items-start gap-2 mb-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-linx-yellow text-[10px] font-black text-slate-900 mt-0.5">
                {annotation.number}
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {annotation.title}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              {annotation.body}
            </p>
            {actionButton && (
              <button
                onClick={handleActionClick}
                className="mt-3 w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white transition-all hover:bg-slate-700"
              >
                {actionButton.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
