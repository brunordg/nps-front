"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const progressStyles = cva(
  "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      color: {
        primary: "bg-primary",
        secondary: "bg-secondary",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
)

const indicatorStyles = cva(
  "h-full flex-1 transition-all",
  {
    variants: {
      progress: {
        100: "w-full",
        0: "w-0",
      },
    },
  }
)

interface ProgressProps {
  value?: number
  color?: "primary" | "secondary"
  className?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, color = "primary" }, ref) => {
    return (
      <div ref={ref} className={cn(progressStyles({ color }), className)}>
        <div
          className={cn(indicatorStyles({ progress: Math.min(value, 100) }))}
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </div>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }
