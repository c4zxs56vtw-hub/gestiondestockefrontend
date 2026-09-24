import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/routes'
import { QueryProvider } from './app/providers/QueryProvider'
import { ToastProvider } from './shared/presentation/components/ui/toast'

export default function App() {
  return (
    <QueryProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryProvider>
  )
}
