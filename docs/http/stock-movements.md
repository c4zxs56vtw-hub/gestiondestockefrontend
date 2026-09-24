# Mouvements de stock

## Entrée

```http
POST /api/v1/stock-movements
Content-Type: application/json
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "productId": 42,
  "type": "IN",
  "quantity": 12,
  "supplierId": 7,
  "reference": "BL-2026-0091",
  "note": null
}
```

## Sortie

```json
{
  "productId": 42,
  "type": "OUT",
  "quantity": 2,
  "supplierId": null,
  "reference": null,
  "note": "Préparation commande client"
}
```

Une sortie sans commentaire, un produit archivé ou un stock insuffisant produit une erreur métier `409` ou de validation `400` selon le cas.
