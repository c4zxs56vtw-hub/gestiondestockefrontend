# Ajustements d’inventaire

```http
POST /api/v1/stock-adjustments
Content-Type: application/json
Idempotency-Key: 1d6f0a1e-8a8c-4f28-9c6a-9b14b6ecf231
```

```json
{
  "productId": 42,
  "countedQuantity": 17,
  "expectedStockVersion": 8,
  "reason": "Écart constaté lors du comptage du 23/09"
}
```

Si `expectedStockVersion` ne correspond plus au backend, répondre `409 STOCK_VERSION_CONFLICT`. Le frontend recharge alors le produit et demande une nouvelle confirmation ; il ne réapplique jamais automatiquement l’ancien écart.
