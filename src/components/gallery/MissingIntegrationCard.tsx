import { PlusCircle } from 'lucide-react'

interface MissingIntegrationCardProps {
  onRequest?: () => void
}

export function MissingIntegrationCard({ onRequest }: MissingIntegrationCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={onRequest}
        className="group flex h-36 w-36 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-200 bg-white transition-all duration-200 hover:border-linx-orange hover:bg-orange-50"
      >
        <PlusCircle size={22} className="text-slate-300 transition-colors group-hover:text-linx-orange" />
        <span className="mt-1 text-[9px] font-semibold text-slate-300 group-hover:text-linx-orange">Request</span>
      </div>
      <span className="text-center text-[11px] font-semibold text-slate-400 max-w-[7rem] leading-tight">
        Don't see your app?
      </span>
    </div>
  )
}
