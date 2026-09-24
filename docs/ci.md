# CI

La configuration `.github/workflows/ci.yml` contrôle automatiquement :

- installation reproductible avec `npm ci` ;
- lint ESLint ;
- contrat OpenAPI ;
- dérive entre `openapi.yaml` et les types générés ;
- tests unitaires ;
- build de production.

Le smoke test du backend réel est séparé et désactivé par défaut. Il peut être activé avec la variable de repository `STOCKPILOT_API_SMOKE=true` et une `STOCKPILOT_API_BASE_URL`. Il utilise uniquement des requêtes `GET` et ne doit jamais recevoir de secret dans une variable `VITE_*`.

La CI ne lance aucune mutation réelle implicitement. Les tests E2E peuvent être ajoutés dans un job séparé lorsque les navigateurs Playwright sont installés et que le scénario mock est stabilisé.
