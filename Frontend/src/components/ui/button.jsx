import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.45)] hover:brightness-105 active:translate-y-0 active:scale-[0.98]",
        destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 hover:shadow-[0_4px_16px_rgba(225,29,72,0.35)] active:scale-[0.98]",
        outline: "border border-slate-700/80 bg-slate-900/60 backdrop-blur-md shadow-sm hover:bg-slate-800 hover:text-foreground hover:border-slate-600 active:scale-[0.98]",
        secondary: "bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-sm hover:bg-slate-700 active:scale-[0.98]",
        ghost: "hover:bg-slate-800/70 hover:text-foreground active:scale-[0.98]",
        link: "text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
