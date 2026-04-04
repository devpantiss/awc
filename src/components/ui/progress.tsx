interface ProgressProps {
  value?: number
  className?: string
  max?: number
}

export function Progress({ value = 0, className = "", max = 100 }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div 
      className={`relative w-full overflow-hidden rounded-full bg-slate-200 ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full w-full flex-1 bg-slate-900 transition-all duration-500 ease-in-out"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
}