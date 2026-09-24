import { Code2, ExternalLink, BookOpen, Server, Lightbulb } from 'lucide-react'
import { PageHeader } from '@/shared/presentation/components/PageHeader'

const ENDPOINTS = [
  { method: 'GET', path: '/api/v1/dashboard', description: 'Données tableau de bord (KPIs, série journalière, mouvements récents)' },
  { method: 'GET', path: '/api/v1/products', description: 'Liste paginée des produits (filtres : q, categoryId, supplierId, status, stockStatus)' },
  { method: 'POST', path: '/api/v1/products', description: 'Créer un nouveau produit' },
  { method: 'GET', path: '/api/v1/products/{id}', description: 'Détail d\'un produit par ID' },
  { method: 'PUT', path: '/api/v1/products/{id}', description: 'Mettre à jour un produit (sauf SKU et unité après le premier mouvement)' },
  { method: 'PATCH', path: '/api/v1/products/{id}/archive', description: 'Archiver un produit (stock doit être à 0)' },
  { method: 'GET', path: '/api/v1/categories', description: 'Liste paginée des catégories' },
  { method: 'POST', path: '/api/v1/categories', description: 'Créer une catégorie' },
  { method: 'GET', path: '/api/v1/categories/{id}', description: 'Détail d\'une catégorie' },
  { method: 'PUT', path: '/api/v1/categories/{id}', description: 'Modifier une catégorie' },
  { method: 'DELETE', path: '/api/v1/categories/{id}', description: 'Supprimer une catégorie (si non utilisée)' },
  { method: 'GET', path: '/api/v1/suppliers', description: 'Liste paginée des fournisseurs' },
  { method: 'POST', path: '/api/v1/suppliers', description: 'Créer un fournisseur' },
  { method: 'GET', path: '/api/v1/suppliers/{id}', description: 'Détail d\'un fournisseur' },
  { method: 'PUT', path: '/api/v1/suppliers/{id}', description: 'Modifier un fournisseur' },
  { method: 'DELETE', path: '/api/v1/suppliers/{id}', description: 'Supprimer un fournisseur (si non utilisé)' },
  { method: 'GET', path: '/api/v1/stock-movements', description: 'Liste paginée des mouvements (filtres : productId, type, from, to)' },
  { method: 'POST', path: '/api/v1/stock-movements', description: 'Créer un mouvement (IN ou OUT) — requiert Idempotency-Key' },
  { method: 'GET', path: '/api/v1/stock-movements/{id}', description: 'Détail d\'un mouvement' },
  { method: 'POST', path: '/api/v1/inventory/adjustments', description: 'Créer un ajustement de stock (requiert expectedStockVersion)' },
]

const METHOD_STYLES: Record<string, string> = {
  GET: 'bg-info-light text-info-text',
  POST: 'bg-success-light text-success-text',
  PUT: 'bg-warning-light text-warning-text',
  PATCH: 'bg-primary-50 text-primary-700',
  DELETE: 'bg-danger-light text-danger-text',
}

const BUSINESS_RULES = [
  'Les montants (purchasePrice, salePrice) sont des chaînes numériques entières en XAF (ex: "450000").',
  'Les dates sont en ISO 8601 UTC. L\'affichage utilise le fuseau Africa/Douala (UTC+1).',
  'Un produit archivé ne peut plus recevoir de mouvements. Il faut que son stock soit à 0.',
  'Les mouvements POST requièrent le header Idempotency-Key pour éviter les doublons.',
  'Les ajustements requièrent expectedStockVersion pour détecter les conflits de concurrence.',
  'La suppression d\'une catégorie ou d\'un fournisseur est refusée si des produits actifs y sont rattachés.',
  'Le backend est l\'autorité pour le stock validé. L\'UI n\'effectue pas de mise à jour optimiste.',
  'Les listes sont paginées : page (0-indexé), size, sort (ex: "name,asc"), totalElements, totalPages.',
  'Les erreurs suivent le format RFC 9457 (application/problem+json) avec le champ code stable.',
]

export function ApiDocsPage() {
  return (
    <div>
      <PageHeader
        title="Documentation API"
        description="Référence des contrats HTTP que le backend Spring Boot doit implémenter."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-surface-border shadow-card">
          <div className="px-5 pt-5 pb-3 flex items-center gap-2">
            <Server className="h-4 w-4 text-gray-400" aria-hidden />
            <h2 className="text-sm font-semibold text-gray-700">Endpoints ({ENDPOINTS.length})</h2>
          </div>
          <div className="divide-y divide-surface-border">
            {ENDPOINTS.map((ep) => (
              <div key={ep.path + ep.method} className="px-5 py-3 flex items-center gap-3">
                <span className={`shrink-0 inline-flex items-center rounded px-2 py-0.5 text-xs font-mono font-bold ${METHOD_STYLES[ep.method] ?? 'bg-gray-100 text-gray-600'}`}>
                  {ep.method}
                </span>
                <span className="font-mono text-xs text-gray-700 shrink-0">{ep.path}</span>
                <span className="text-xs text-gray-500 truncate">{ep.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* OpenAPI link */}
          <div className="bg-white rounded-lg border border-surface-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="h-4 w-4 text-primary" aria-hidden />
              <h2 className="text-sm font-semibold text-gray-700">Spécification OpenAPI</h2>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Le fichier <code className="bg-gray-100 px-1 rounded">docs/openapi.yaml</code> est la source de vérité machine-readable.
            </p>
            <a
              href="/docs/openapi.yaml" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Voir docs/openapi.yaml
            </a>
          </div>

          {/* Business rules */}
          <div className="bg-white rounded-lg border border-surface-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" aria-hidden />
              <h2 className="text-sm font-semibold text-gray-700">Règles métier clés</h2>
            </div>
            <ul className="space-y-2">
              {BUSINESS_RULES.map((rule, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Learning tip */}
          <div className="bg-info-light border border-info-border rounded-lg p-4">
            <div className="flex gap-2">
              <Lightbulb className="h-4 w-4 text-info shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="text-xs font-semibold text-info-text mb-1">Pour le backend Spring Boot</p>
                <p className="text-xs text-gray-600">
                  Ces mocks simulent exactement ce que votre backend doit produire. Activez le mode API (<code className="bg-white/60 px-1 rounded">VITE_API_MODE=api</code>) pour connecter votre backend réel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
