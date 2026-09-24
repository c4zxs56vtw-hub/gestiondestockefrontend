# Exemples HTTP StockPilot

Cette section contient les exemples de communication entre le frontend et l’API. La source de vérité reste [../openapi.yaml](../openapi.yaml) et la documentation lisible se trouve dans [../api-contract.md](../api-contract.md).

Pour apprendre progressivement, suivre [learning-order.md](./learning-order.md).

## Base URL

```text
http://localhost:8080/api/v1
```

Dans chaque fichier `.http`, la base est déclarée une seule fois :

```http
@baseUrl = http://localhost:8080/api/v1
GET {{baseUrl}}/products
```

Les routes ne doivent pas répéter l’hôte ou `/api/v1`. Pour changer d’environnement, modifier uniquement `@baseUrl` ou utiliser `http-client.env.json`.

## Conventions

- Requêtes JSON : `Content-Type: application/json`.
- Réponses JSON : `Accept: application/json`.
- Collections : `{ content, page, size, totalElements, totalPages }`.
- Mutations de stock : header `Idempotency-Key` UUID obligatoire.
- Dates techniques : ISO 8601 UTC.
- Montants : chaînes numériques entières en XAF.

## Fichiers prévus

- `dashboard.md` : KPI globaux et série quotidienne.
- `products.md` : recherche, filtres, pagination et création.
- `stock-movements.md` : entrées, sorties et erreurs de stock.
- `stock-adjustments.md` : inventaire, version et conflits.
- `errors.md` : Problem Details et codes frontend.

Les fichiers `.http` sont directement exécutables depuis IntelliJ IDEA ou l’extension REST Client de VS Code :

- `dashboard.http`
- `products.http`
- `categories.http`
- `suppliers.http`
- `stock-movements.http`
- `stock-adjustments.http`
- `outcomes.http` : scénarios de succès, validation et conflits métier.

Les identifiants et l’URL de base peuvent être adaptés dans chaque fichier. `http-client.env.json` fournit également un environnement `dev` pour les clients qui le supportent.
