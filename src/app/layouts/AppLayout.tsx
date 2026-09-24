import { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { cn } from '@/shared/presentation/components/ui/cn'

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/products': 'Produits',
  '/categories': 'Catégories',
  '/suppliers': 'Fournisseurs',
  '/stock-movements': 'Mouvements de stock',
  '/stock-movements/new': 'Nouveau mouvement',
  '/inventory': 'Inventaire',
  '/alerts': 'Alertes de stock',
  '/developer/api': 'Documentation API',
}

function usePageTitle() {
  const { pathname } = useLocation()
  const exact = ROUTE_TITLES[pathname]
  if (exact) return exact
  const parent = Object.keys(ROUTE_TITLES).find(
    (k) => k !== '/' && pathname.startsWith(k + '/'),
  )
  return parent ? ROUTE_TITLES[parent] : 'StockPilot'
}

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const title = usePageTitle()

  return (
    <div className="flex h-full bg-surface-base">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden
          />
          <div className="relative flex h-full w-64">
            <Sidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-4 lg:px-6 bg-white border-b border-surface-border shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {import.meta.env.VITE_API_MODE === 'mock' && (
              <Link
                to="/developer/api"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-warning-light border border-warning-border text-warning-text text-xs font-medium px-2.5 py-1 hover:bg-amber-100 transition-colors"
                title="Voir la documentation API"
              >
                ⚗️ Données simulées
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
