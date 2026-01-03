'use client'

import { cn } from "@/lib/utils"

interface ScrollingHeadlineProps {
  text: string
  className?: string
  speed?: 'slow' | 'normal' | 'fast'
}

export function ScrollingHeadline({
  text,
  className,
  speed = 'normal'
}: ScrollingHeadlineProps) {
  const speedMap = {
    slow: 'animate-scroll-slow',
    normal: 'animate-scroll-normal',
    fast: 'animate-scroll-fast'
  }

  return (
    <div className={cn(
      "relative w-full overflow-hidden bg-gradient-to-r from-background via-background to-background py-4",
      className
    )}>
      <style>{`
        @keyframes scrollRTL {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll-slow {
          animation: scrollRTL 20s linear infinite;
        }

        .animate-scroll-normal {
          animation: scrollRTL 15s linear infinite;
        }

        .animate-scroll-fast {
          animation: scrollRTL 10s linear infinite;
        }
      `}</style>
      
      <div className={cn(
        "whitespace-nowrap text-2xl font-bold tracking-tight text-foreground",
        speedMap[speed]
      )}>
        {text}
      </div>
    </div>
  )
}
