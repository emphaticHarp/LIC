import { toast as customToast } from '@/lib/toast'

interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = (props: ToastProps) => {
    const { title, description, variant = 'default' } = props

    if (variant === 'destructive') {
      customToast.error(title || 'Error', description)
    } else {
      customToast.success(title || 'Success', description)
    }
  }

  return { toast }
}
