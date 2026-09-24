# Couverture des handlers MSW

Chaque opération utilisée par l’interface doit avoir un handler MSW correspondant en mode mock. La couverture ne signifie pas seulement « route existante » : les réponses importantes doivent être simulables.

## Matrice minimale

| Opération | Succès | Validation | Conflit / erreur métier | Réseau |
|---|---:|---:|---:|---:|
| `getDashboard` | ✓ | — | ✓ `500` | ✓ |
| `listProducts` | ✓ | ✓ paramètres invalides | — | ✓ |
| `getProduct` | ✓ | — | ✓ `404` | ✓ |
| `createProduct` | ✓ `201` | ✓ `400` | ✓ SKU dupliqué | ✓ |
| `updateProduct` | ✓ `200` | ✓ `400` | ✓ identité verrouillée | ✓ |
| `changeProductStatus` | ✓ `200` | ✓ `400` | ✓ stock non nul | ✓ |
| `listCategories` / `listSuppliers` | ✓ | ✓ filtres | — | ✓ |
| `createCategory` / `createSupplier` | ✓ `201` | ✓ `400` | ✓ référence utilisée | ✓ |
| `listStockMovements` | ✓ | ✓ filtres | — | ✓ |
| `createStockMovement` | ✓ `201` | ✓ `400` | ✓ stock insuffisant / archivé | ✓ |
| `getStockMovement` | ✓ | — | ✓ `404` | ✓ |
| `createStockAdjustment` | ✓ `201` | ✓ `400` | ✓ version / aucun changement | ✓ |

## Contrôles

- chaque handler est associé à un `operationId` déclaré dans OpenAPI ;
- chaque scénario utilise le même format DTO que l’API réelle ;
- les handlers renvoient les codes et headers attendus ;
- les mutations vérifient `Idempotency-Key` ;
- les erreurs Problem Details contiennent `fieldErrors`, même vide ;
- un test échoue si une requête attendue n’a aucun handler ;
- un test échoue si un handler reste inutilisé sans justification.

## Scénario non couvert

Un écran ne doit pas afficher de données de démonstration silencieuses lorsqu’un handler manque. Le test doit signaler l’opération non couverte et l’interface doit afficher une erreur localisée.

Cette matrice couvre le transport simulé. L’atomicité, la concurrence et l’idempotence persistée restent des garanties à vérifier côté backend.
