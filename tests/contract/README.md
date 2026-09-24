# Tests de contrat API

Les tests de contrat vérifient que le frontend et le backend parlent le même format. Leur source de vérité est `docs/openapi.yaml`; les exemples `.http` servent à reproduire les scénarios manuellement.

## Vérifications de routes

- `GET /dashboard` ;
- `GET/POST /products`, `GET/PUT /products/{id}`, `PATCH /products/{id}/status` ;
- `GET/POST /categories`, `GET/PUT/DELETE /categories/{id}` ;
- `GET/POST /suppliers`, `GET/PUT/DELETE /suppliers/{id}` ;
- `GET/POST /stock-movements`, `GET /stock-movements/{id}` ;
- `POST /stock-adjustments`.

Vérifier l’absence de `DELETE /products` et de `PUT`/`DELETE` sur les mouvements.

## Vérifications de schémas

- JSON en `camelCase` ;
- identifiants entiers positifs ;
- montants chaînes numériques en XAF ;
- dates ISO 8601 UTC ;
- unités `PIECE`, `BOX`, `CARTON` ;
- statuts produit et stock conformes ;
- champs nullable présents avec `null` ;
- collection `{content, page, size, totalElements, totalPages}` ;
- `fieldErrors` toujours tableau, vide lorsqu’il n’y a pas d’erreurs de champ.

## Vérifications de réponses

- `200` pour lectures et mises à jour ;
- `201` pour créations, avec `Location` si fourni ;
- `204` sans corps pour suppressions ;
- `400` pour validation ;
- `404` pour ressource absente ;
- `409` pour conflits métier ;
- `500` pour erreur inattendue.

## Headers et idempotence

Les créations de mouvements et d’ajustements exigent :

```http
Content-Type: application/json
Idempotency-Key: <UUID>
```

Une même clé avec une même requête doit renvoyer la réponse initiale. Une même clé avec un corps différent doit renvoyer `409 IDEMPOTENCY_KEY_REUSED`.

## Limites

Un test de contrat confirme la forme et le protocole. Il ne prouve pas l’atomicité du stock, la concurrence ou la persistance de l’idempotence ; ces garanties nécessitent des tests d’intégration backend dédiés.
## Validation du document OpenAPI

Avant toute évolution du contrat :

```bash
npx @redocly/cli lint docs/openapi.yaml
```

Le lint doit vérifier la syntaxe YAML, l’unicité des `operationId`, les références `$ref`, les paramètres, les schémas de succès et d’erreur, ainsi que les champs requis et nullable.

Après le lint, rejouer les fichiers `docs/http/*.http` et comparer les réponses aux schémas. Une modification du contrat doit mettre à jour dans le même changement `api-contract.md`, les exemples HTTP, les DTO/mappers et les tests concernés.

Le script `scripts/verify-backend-readonly.ps1` complète ces tests en vérifiant directement un backend réel sans mutation : `Content-Type`, champs essentiels du dashboard et structure paginée des collections. Il ne remplace pas la validation exhaustive des schémas OpenAPI.

## Types générés à jour

Les types de transport sont générés depuis `docs/openapi.yaml` dans `src/shared/infrastructure/api/generated/`. Ils ne doivent pas être recopiés ou édités manuellement. Une pull request qui modifie le contrat doit inclure la régénération des types, puis vérifier que les mappers, formulaires et tests TypeScript compilent encore.

## Typage compile-time et validation runtime

Le typage TypeScript ne suffit pas à valider une réponse reçue à l’exécution : un JSON externe peut être incomplet, mal typé ou non conforme malgré un cast réussi. Le client HTTP doit donc valider les réponses runtime contre les schémas du contrat avant de les mapper vers le domaine.

La chaîne attendue est :

```text
JSON réseau → validation runtime → mapper DTO → modèle frontend
```

Une réponse invalide doit produire une erreur contrôlée `INVALID_RESPONSE`, sans être transmise comme si elle était valide. Les types générés restent utiles pour le développement, l’autocomplétion et la compilation, mais ne remplacent pas cette validation.

Les garde-fous de test `tests/contract/runtime-schema-guards.ts` vérifient déjà la structure des collections paginées et des Problem Details. Pour une couverture complète de tous les schémas OpenAPI, ils pourront être remplacés ou complétés par un validateur JSON Schema (par exemple Ajv) alimenté directement par `docs/openapi.yaml`.
