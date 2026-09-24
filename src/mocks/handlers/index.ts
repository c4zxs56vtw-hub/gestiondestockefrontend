import { dashboardHandlers } from './dashboard-handlers'
import { categoryHandlers } from './category-handlers'
import { supplierHandlers } from './supplier-handlers'
import { productHandlers } from './product-handlers'
import { movementHandlers } from './movement-handlers'

export const handlers = [
  ...dashboardHandlers,
  ...categoryHandlers,
  ...supplierHandlers,
  ...productHandlers,
  ...movementHandlers,
]
