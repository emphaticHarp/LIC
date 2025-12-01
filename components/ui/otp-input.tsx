"use client"

import { OTPInput } from "input-otp"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  className?: string
}

export function OTPInputComponent({ value, onChange, maxLength = 6, className }: OTPInputProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <OTPInput
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        render={({ slots }) => (
          <>
            {slots.map((slot, index) => (
              <slot key={index} />
            ))}
          </>
        )}
      />
    </div>
  )
}
