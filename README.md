# StockPilot

Frontend React/TypeScript de gestion de stock pour une application métier, avec un dashboard initial, des données simulées et un contrat API prêt à être branché sur un backend Spring Boot.

## Démarrage

Pré-requis : Node.js 20+.

```bash
npm install
npm run dev
```

Le serveur Vite démarre généralement sur `http://localhost:5173`.

En développement uniquement, la route `http://localhost:5173/developer/api` affiche l’état de configuration API et les routes du contrat. Elle est statique, ne nécessite aucune API supplémentaire et n’est pas rendue dans un build de production.

## Configuration

Copier `.env.example` vers `.env` :

```env
VITE_API_MODE=mock
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

- `mock` : données simulées en mémoire, réinitialisées après rechargement.
- `api` : backend réel à l’URL `VITE_API_BASE_URL`.

Ne jamais mettre de secret dans une variable `VITE_*` : ces valeurs sont visibles dans le bundle navigateur.

## Scripts

```bash
npm run dev       # développement local
npm run dev:mock  # développement explicite en mode mock
npm run dev:api   # développement avec le backend réel, sans mock
npm run typecheck # vérification TypeScript sans produire de bundle
npm run lint      # analyse statique ESLint
npm run test      # tests unitaires Vitest
npm run test:watch # tests unitaires en mode watch
npm run build     # vérification TypeScript et build de production
npm run preview   # prévisualisation du build
npm run validate:openapi # lint du contrat OpenAPI
npm run api:lint         # alias explicite du lint API
npm run api:generate     # régénération des types TypeScript depuis OpenAPI
npm run api:check        # lint + détection de dérive des types + typecheck
npm run test:contract   # validation du contrat
npm run verify:backend  # smoke test GET du backend réel
npm run api:smoke       # alias explicite du smoke test API en lecture seule
npm run test:e2e        # parcours Playwright mobile, tablette et desktop
```

`validate:openapi` utilise Redocly via `npx`. `test:e2e` nécessite l’installation et la configuration de Playwright ; il n’exécute pas de mutation réelle implicitement. Les commandes de diagnostic backend restent en lecture seule.

Vérifier un backend réel sans modifier ses données :

```powershell
.\scripts\verify-backend-readonly.ps1
.\scripts\verify-backend-readonly.ps1 -BaseUrl http://localhost:8080/api/v1
```

Ce script utilise uniquement `GET` sur le dashboard et les collections paginées. Il n’envoie aucune requête de création, modification ou suppression.
Avant de l’exécuter, utiliser `VITE_API_MODE=api` et désactiver tout service worker MSW actif. Le script ne bascule jamais vers des données mockées.
Règle de sécurité : aucun diagnostic, test ou écran développeur ne crée ou ne supprime implicitement des données réelles.
En fin d’exécution, il imprime le rapport des routes effectivement testées et leur statut ; il ne prétend pas avoir vérifié les mutations ou les garanties métier non appelées.

## Structure principale

```text
src/
  app/                  composition des dépendances
  features/products/    domaine et repository produit
  shared/               modèles et DTO partagés
  App.tsx               composition de l’interface actuelle
  styles.css            tokens et styles responsive
docs/
  http/                 exemples .http exécutables
  openapi.yaml          contrat API machine-readable
```

## Documentation

Commencer par [docs/README.md](./docs/README.md), puis suivre le [parcours HTTP](./docs/http/learning-order.md).

Documents importants :

- [Contrat API](./docs/api-contract.md)
- [Règles métier](./docs/business-rules.md)
- [Guide d’intégration](./docs/integration-guide.md)
- [Architecture frontend](./docs/frontend-architecture.md)
- [Roadmap backend](./docs/backend-roadmap.md)
- [Tests manuels](./docs/manual-testing.md)

## Limites actuelles

Le CRUD en mémoire sert au démarrage et à la validation des parcours frontend/API. Les garanties métier avancées — atomicité, concurrence, idempotence persistée et version de stock — seront implémentées ensuite côté backend et couvertes par des tests dédiés.

Aucun code Java complet n’est fourni dans ce projet. JPA, MapStruct et `GlobalExceptionHandler` ne sont pas requis pour commencer.
