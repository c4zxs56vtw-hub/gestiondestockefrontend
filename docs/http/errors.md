# Erreurs HTTP

Format : `application/problem+json`.

```json
{
  "type": "urn:stockpilot:problem:validation",
  "title": "Requête invalide",
  "status": 400,
  "detail": "Certains champs sont invalides.",
  "instance": "/api/v1/products",
  "code": "VALIDATION_ERROR",
  "fieldErrors": [
    {"field": "name", "message": "Le nom du produit est obligatoire."}
  ]
}
```

Codes principaux : `RESOURCE_NOT_FOUND` (404), `VALIDATION_ERROR` (400), `INSUFFICIENT_STOCK` (409), `PRODUCT_ARCHIVED` (409), `STOCK_VERSION_CONFLICT` (409), `IDEMPOTENCY_KEY_REUSED` (409) et `INTERNAL_ERROR` (500).
