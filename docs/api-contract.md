# Contrat API StockPilot

Base de développement : `http://localhost:8080/api/v1`. JSON camelCase, dates ISO UTC, affichage métier Africa/Douala. Toutes les collections utilisent `page` (index 0), `size` (1–100, défaut 20) et `sort=field,direction`.

## DTO explicite de collection paginée

Chaque endpoint de collection renvoie exactement ce DTO, même lorsque `content` est vide :

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0
}
```

Le frontend le représente par `PaginatedResponseDto<T>` à la frontière HTTP, puis le convertit en `Page<T>` via `toPage`. Une page au-delà des résultats reste un succès `200` avec `content` vide et les totaux réels.

Lorsqu’une recherche ou un filtre change, le frontend remet `page` à `0`. Les champs de tri sont limités à une liste blanche par endpoint ; le frontend utilise `name,asc` par défaut pour les produits.

| Écran | Méthode | Route |
|---|---|---|
| Dashboard | GET | `/dashboard` |
| Produits | GET, POST, GET, PUT, PATCH | `/products`, `/products/{id}`, `/products/{id}/status` |
| Catégories | GET, POST, GET, PUT, DELETE | `/categories` |
| Fournisseurs | GET, POST, GET, PUT, DELETE | `/suppliers` |
| Mouvements | GET, POST, GET | `/stock-movements` |
| Inventaire | POST | `/stock-adjustments` |

Les créations renvoient 201 + `Location`; les suppressions 204. Les mouvements validés sont immuables. Les POST de mouvement et d’ajustement exigent `Idempotency-Key` (UUID), conservée 24 h. Une même clé et une requête identique renvoient la réponse initiale ; une réutilisation différente renvoie 409.

Les erreurs sont `application/problem+json` avec `type`, `title`, `status`, `detail`, `instance`, `code` et `fieldErrors`. Codes minimum : `VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`, `SKU_ALREADY_EXISTS`, `INSUFFICIENT_STOCK`, `PRODUCT_ARCHIVED`, `PRODUCT_HAS_STOCK`, `CATEGORY_IN_USE`, `SUPPLIER_IN_USE`, `STOCK_VERSION_CONFLICT`, `NO_STOCK_CHANGE`, `IDEMPOTENCY_KEY_REUSED`, `INTERNAL_ERROR`.
Les suppressions renvoient `204 No Content` sans corps. Le client ne tente pas de parser du JSON après une réponse 204.
