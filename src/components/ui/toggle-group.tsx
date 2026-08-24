import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<{ variant: "default" | "outline"; size: "default" | "sm" | "lg" }>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & { className?: string; variant?: "default" | "outline"; size?: "default" | "sm" | "lg" }>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref as React.Ref<HTMLDivElement> }
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}>
    <ToggleGroupContext.Provider value={{ variant: variant || "default", size: size || "default" }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName




export { ToggleGroup }
