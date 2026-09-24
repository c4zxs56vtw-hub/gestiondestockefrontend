# Couverture des opérations déclarées

Chaque requête émise par un repository HTTP, un handler MSW ou un fichier `.http` doit correspondre à une opération déclarée dans `docs/openapi.yaml`.

## Vérification

Pour chaque appel, comparer le triplet :

```text
méthode HTTP + chemin + operationId
```

Exemples attendus :

| Requête frontend | Opération déclarée |
|---|---|
| `GET /dashboard` | `getDashboard` |
| `GET /products` | `listProducts` |
| `POST /products` | `createProduct` |
| `POST /stock-movements` | `createStockMovement` |
| `POST /stock-adjustments` | `createStockAdjustment` |

Les opérations de catégories, fournisseurs, détail produit, mise à jour et statuts doivent recevoir leur propre `operationId` avant d’être utilisées par un repository ou un écran.

## Règles

- aucune route construite dynamiquement en dehors du client HTTP centralisé ;
- aucun endpoint non présent dans OpenAPI ;
- aucun changement de méthode pour contourner une réponse backend ;
- les paramètres et headers doivent être déclarés dans l’opération correspondante ;
- les fichiers `.http`, les handlers MSW et les repositories utilisent les mêmes chemins.

## Contrôle de pull request

Une modification d’un repository ou d’un handler doit vérifier :

1. l’existence de l’opération dans OpenAPI ;
2. la concordance exacte de la méthode et du chemin ;
3. la présence du schéma de requête et des réponses attendues ;
4. la mise à jour de l’exemple `.http` correspondant.
