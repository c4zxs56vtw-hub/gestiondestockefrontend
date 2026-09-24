import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Truck, ArrowLeftRight,
  ClipboardList, Bell, ChevronLeft, ChevronRight, Code2,
} from 'lucide-react'
import { cn } from '@/shared/presentation/components/ui/cn'
import { MockBadge } from '@/shared/presentation/components/MockBadge'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/products', icon: Package, label: 'Produits' },
  { to: '/categories', icon: Tag, label: 'Catégories' },
  { to: '/suppliers', icon: Truck, label: 'Fournisseurs' },
  { to: '/stock-movements', icon: ArrowLeftRight, label: 'Mouvements' },
  { to: '/inventory', icon: ClipboardList, label: 'Inventaire' },
  { to: '/alerts', icon: Bell, label: 'Alertes' },
] as const

const DEV_ITEMS = [
  { to: '/developer/api', icon: Code2, label: 'Documentation API' },
] as const

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(to + '/')
    return (
      <NavLink
        to={to}
        title={collapsed ? label : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors duration-150 group',
          isActive
            ? 'bg-sidebar-active text-sidebar-text-active font-medium'
            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
          collapsed && 'justify-center px-2',
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden />
        {!collapsed && <span className="truncate">{label}</span>}
        {collapsed && <span className="sr-only">{label}</span>}
      </NavLink>
    )
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-sidebar-bg border-r border-sidebar-border transition-all duration-200',
        collapsed ? 'w-14' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center px-4 h-14 border-b border-sidebar-border', collapsed && 'justify-center px-2')}>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-white">
            stock<span className="text-accent-400">pilot</span>
          </span>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-accent-400" aria-label="StockPilot">SP</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5" aria-label="Navigation principale">
        {!collapsed && (
          <p className="px-3 py-1 text-2xs font-semibold uppercase tracking-widest text-sidebar-text-label mb-1">
            Menu principal
          </p>
        )}
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="my-3 border-t border-sidebar-border" />

        {!collapsed && (
          <p className="px-3 py-1 text-2xs font-semibold uppercase tracking-widest text-sidebar-text-label mb-1">
            Développement
          </p>
        )}
        {DEV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Mock badge */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <MockBadge />
        </div>
      )}

      {/* Collapse button */}
      <div className="border-t border-sidebar-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-3 text-sidebar-text hover:text-white hover:bg-sidebar-hover transition-colors"
          aria-label={collapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" aria-hidden />
            : <ChevronLeft className="h-4 w-4" aria-hidden />
          }
        </button>
      </div>
    </aside>
  )
}
