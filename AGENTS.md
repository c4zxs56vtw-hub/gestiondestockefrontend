# Instructions du dépôt StockPilot

## Périmètre

Ce dépôt est consacré au frontend React/TypeScript de StockPilot, à ses contrats HTTP, à ses mocks et à sa documentation d’intégration.

## Interdiction de générer le backend

Ne pas générer de backend complet dans ce dépôt.

En particulier :

- ne pas créer de projet Spring Boot ou de fichiers Java complets ;
- ne pas générer d’entités JPA, repositories JPA ou migrations de base de données ;
- ne pas imposer MapStruct ;
- ne pas imposer ni générer un `GlobalExceptionHandler` ;
- ne pas implémenter la persistance, la sécurité ou les contrôleurs backend comme si elles étaient livrées.

La documentation peut décrire le contrat API, les responsabilités backend, les règles métier, les exemples HTTP et une roadmap pédagogique. Elle ne doit pas contenir d’implémentation Java complète.

## Démarrage autorisé

Le CRUD en mémoire, les repositories mock, les DTO frontend, les mappers HTTP, les fichiers `.http` et les tests frontend sont autorisés pour valider les parcours et préparer l’intégration.

Le CRUD mémoire ne doit pas être présenté comme une garantie métier de production. Les garanties avancées — atomicité, concurrence, version de stock, idempotence persistée et contraintes de références — sont documentées comme des étapes backend ultérieures.

## Règles frontend

- Aucun `fetch` directement dans un composant React.
- Les écrans utilisent des cas d’usage et des ports internes.
- Les fixtures ne sont jamais importées directement par les écrans.
- Les secrets ne doivent jamais être placés dans une variable `VITE_*`.
- Les modifications de stock attendent la confirmation serveur et ne sont pas optimistes.

## Frontières architecturales

- Le domaine ne dépend ni de React, ni de HTTP, ni des DTO générés.
- L’application dépend du domaine et de ses ports ; elle orchestre les cas d’usage.
- L’infrastructure implémente les ports, centralise le client HTTP et mappe les DTO.
- La présentation utilise les cas d’usage injectés et gère les états loading, empty, error et success.
- La composition des implémentations concrètes se fait à la périphérie dans `src/app/composition-root.ts`.
- Une fonctionnalité ne contourne pas les exports publics d’une autre fonctionnalité par des imports profonds arbitraires.
- Ne pas créer de couche vide uniquement pour remplir une arborescence.

## Primauté du contrat

- `docs/openapi.yaml` est la source de vérité machine-readable des échanges HTTP.
- `docs/api-contract.md` explique ce même contrat en français et ne doit pas le contredire.
- Les fichiers `.http`, les DTO, les mocks, les mappers, les formulaires et les tests doivent réutiliser les mêmes noms, statuts et contraintes.
- Toute divergence détectée doit être corrigée au niveau du contrat et de ses adaptateurs avant d’être masquée dans un composant.
- Ne pas inventer d’endpoint non défini par le contrat pour simplifier l’interface.
- Respecter `camelCase`, les DTO paginés explicites, les codes d’erreur stables, les montants en chaînes numériques XAF et les dates ISO UTC.
- Une validation frontend améliore l’expérience, mais ne remplace jamais la validation backend décrite par le contrat.
- Les types de transport générés doivent rester synchronisés avec `docs/openapi.yaml` et ne sont pas édités manuellement.
- Aucun test, script de diagnostic ou écran développeur ne doit créer, modifier ou supprimer des données réelles implicitement.
- Toute mutation réelle doit être explicitement déclenchée par une action utilisateur identifiée, avec confirmation lorsque l’action est sensible.
- Les calculs et changements de stock ne doivent jamais vivre uniquement dans l’UI : le backend reste l’autorité pour le stock validé, les deltas, les versions, les KPI et la valeur indicative.
- L’UI peut calculer un écart prévisionnel pour aider l’utilisateur, mais doit envoyer l’intention au backend et attendre sa réponse avant d’afficher le résultat confirmé.
- Ne jamais prétendre qu’un test, un lint, un build ou une vérification visuelle a été effectué sans exécution ou inspection réelle et traçable.
- Distinguer explicitement : vérification exécutée avec succès, vérification échouée, vérification bloquée et vérification non effectuée.
