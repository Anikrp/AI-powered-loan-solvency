"use client"

import * as React from "react"
import type { TooltipProps } from "recharts"
import { cn } from "@/lib/utils"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | undefined>(undefined)

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig
}) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn("space-y-4", className)}
        {...props}
        style={{
          ...Object.entries(config).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [`--color-${key}`]: value.color,
            }),
            {},
          ),
          ...props.style,
        }}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  className,
  ...props
}: TooltipProps<any, any> & {
  formatter?: (value: number, key: string) => React.ReactNode
  labelFormatter?: (label: string) => React.ReactNode
}) {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("ChartTooltipContent must be used within a ChartContainer")
  }

  const { config } = context

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className={cn("rounded-lg border bg-background p-2 shadow-sm", className)} {...props}>
      <div className="grid gap-2">
        {labelFormatter ? labelFormatter(label) : <div className="text-xs font-medium">{label}</div>}
        <div className="grid gap-1">
          {payload.map(({ value, name }) => {
            const dataKey = String(name)
            const color = config[dataKey]?.color

            return (
              <div key={dataKey} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                <span className="text-xs text-muted-foreground">{config[dataKey]?.label ?? dataKey}</span>
                <span className="ml-auto text-xs font-medium">{formatter ? formatter(value, dataKey) : value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const ChartTooltip = ChartTooltipContent

