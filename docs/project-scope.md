# 1. Objectif et répartition du travail

## Objectif

Livrer un frontend React/TypeScript StockPilot réellement navigable, utilisable en mode mock, documenté par un contrat API exhaustif et prêt à consommer un backend Spring Boot conforme sans réécrire les écrans.

## Responsabilité du frontend

- construire les écrans métier et la navigation ;
- gérer formulaires, validations, recherche, filtres et pagination ;
- afficher loading, succès, état vide, erreurs et conflits ;
- utiliser les ports, cas d’usage, repositories et mappers ;
- simuler les échanges HTTP et valider les réponses contre le contrat ;
- fournir les scripts, tests et exemples `.http` ;
- documenter précisément les attentes du backend.

## Responsabilité du backend

Le backend Spring Boot est développé par le propriétaire du projet. Il devra ensuite fournir :

- les routes déclarées dans `docs/openapi.yaml` ;
- les validations métier et la persistance ;
- l’atomicité des mouvements et du stock ;
- la concurrence et les versions de stock ;
- l’idempotence persistée ;
- les erreurs Problem Details ;
- les règles de références, archivage et historique immuable.

## Frontière

Le frontend ne génère pas le backend et ne déplace pas les garanties métier dans les composants. Le CRUD en mémoire sert à explorer les parcours et à préparer l’intégration ; il ne constitue pas une implémentation de production.

## Résultat attendu

Une fois le backend conforme au contrat, passer de `VITE_API_MODE=mock` à `VITE_API_MODE=api` doit conserver les mêmes écrans et cas d’usage. Seuls les adaptateurs de transport et la composition des repositories changent.
