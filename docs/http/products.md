# Produits

## Collection paginée

```http
GET /api/v1/products?q=clavier&stockStatus=LOW_STOCK&page=0&size=20&sort=name,asc
Accept: application/json
```

Réponse `200` :

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0
}
```

## Création

```http
POST /api/v1/products
Content-Type: application/json
```

```json
{
  "sku": "KB-2048",
  "name": "Clavier mécanique K2",
  "description": null,
  "categoryId": 2,
  "supplierId": null,
  "unit": "PIECE",
  "purchasePrice": "84000",
  "salePrice": "110000",
  "minimumStock": 10
}
```

La création initialise le stock à zéro. Le stock initial passe ensuite par un mouvement `IN`.
