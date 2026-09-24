# Documentation StockPilot

Commencer par [Objectif et répartition du travail](./project-scope.md).

## Parcours recommandé

1. [Contrat API](./api-contract.md) — routes, pagination, statuts et erreurs.
2. [Règles métier](./business-rules.md) — stock, mouvements, ajustements et référentiels.
3. [Guide d’intégration](./integration-guide.md) — modes mock/API et configuration.
4. [Architecture frontend](./frontend-architecture.md) — responsabilités et dépendances.
5. [Exemples HTTP](./http/README.md) — requêtes exécutables dans l’ordre d’apprentissage.
6. [Roadmap backend](./backend-roadmap.md) — progression Spring Boot sans imposer JPA, MapStruct ou un handler global au démarrage.

## Documentation complémentaire

- [Checklist d’acceptation](./acceptance-checklist.md) — état de couverture et travaux restants.
- [Décisions](./decisions.md) — choix techniques et limites assumées.
- [Tests manuels](./manual-testing.md) — scénarios de vérification par écran.
- [Tests et vérifications](./tests-and-verifications.md) — stratégie statique, contrat, intégration, E2E, responsive et accessibilité.
- [Tests d’intégration](../tests/integration/README.md) — scénarios entre écrans, cas d’usage, ports et transport.
- [Formulaires avec MSW](../tests/integration/forms-with-msw.md) — succès, erreurs de champs, conflits et réseau.
- [Tests de contrat](../tests/contract/README.md) — routes, schémas, statuts et headers attendus.
- [Parcours Playwright](../tests/e2e/README.md) — scénarios E2E, responsive et accessibilité.
- [Livrables et critères de fin](./deliverables-and-done.md) — définition du terminé et périmètre restant.
- [CI](./ci.md) — contrôles automatisés et smoke test backend optionnel.
- [Validation des mocks](../tests/contract/mock-schema-validation.md) — fixtures et réponses simulées alignées sur OpenAPI.
- [Couverture des opérations](../tests/contract/operation-coverage.md) — requêtes frontend alignées sur les `operationId` déclarés.
- [Couverture MSW](../tests/contract/msw-handler-coverage.md) — handlers et scénarios simulés par opération.
- [OpenAPI](./openapi.yaml) — source de vérité machine-readable.

## Convention de lecture

Le CRUD en mémoire permet de démarrer l’intégration frontend/API. Les garanties métier avancées sont documentées séparément et seront implémentées ensuite, avec des tests dédiés, indépendamment de la technologie de persistance.
