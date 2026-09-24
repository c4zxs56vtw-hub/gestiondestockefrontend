import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/app/layouts/AppLayout'
import { DashboardPage } from '@/features/dashboard/presentation/pages/DashboardPage'
import { ProductsPage } from '@/features/products/presentation/pages/ProductsPage'
import { ProductDetailPage } from '@/features/products/presentation/pages/ProductDetailPage'
import { CategoriesPage } from '@/features/categories/presentation/pages/CategoriesPage'
import { SuppliersPage } from '@/features/suppliers/presentation/pages/SuppliersPage'
import { SupplierDetailPage } from '@/features/suppliers/presentation/pages/SupplierDetailPage'
import { MovementsPage } from '@/features/stock-movements/presentation/pages/MovementsPage'
import { MovementDetailPage } from '@/features/stock-movements/presentation/pages/MovementDetailPage'
import { NewMovementPage } from '@/features/stock-movements/presentation/pages/NewMovementPage'
import { InventoryPage } from '@/features/inventory/presentation/pages/InventoryPage'
import { AlertsPage } from '@/features/alerts/presentation/pages/AlertsPage'
import { ApiDocsPage } from '@/features/developer/presentation/pages/ApiDocsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'suppliers/:id', element: <SupplierDetailPage /> },
      { path: 'stock-movements', element: <MovementsPage /> },
      { path: 'stock-movements/new', element: <NewMovementPage /> },
      { path: 'stock-movements/:id', element: <MovementDetailPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'developer/api', element: <ApiDocsPage /> },
    ],
  },
])
