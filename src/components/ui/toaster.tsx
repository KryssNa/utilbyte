import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import * as ToastPrimitives from "@radix-ui/react-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...(props as React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>)}></Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
