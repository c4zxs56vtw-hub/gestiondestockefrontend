import type { StockStatus } from '../../../../shared/domain/models'

const labels: Record<StockStatus, string> = {
  IN_STOCK: 'En stock',
  LOW_STOCK: 'Stock faible',
  OUT_OF_STOCK: 'Rupture de stock',
}

const symbols: Record<StockStatus, string> = {
  IN_STOCK: '✓',
  LOW_STOCK: '!',
  OUT_OF_STOCK: '×',
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
  return <span className={`status ${status.toLowerCase()}`} role="status"><i aria-hidden="true">{symbols[status]}</i>{labels[status]}</span>
}
