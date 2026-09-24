# Guide d’intégration frontend / API

## 1. Démarrage frontend

```text
cp .env.example .env
```

Configuration par défaut :

```env
VITE_API_MODE=mock
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

`mock` permet de valider les écrans avec des données déterministes en mémoire. Un rechargement complet réinitialise cet état. Modifier une variable Vite exige un redémarrage du serveur de développement ou une nouvelle construction.

## 2. Passage à l’API réelle

Lorsque le backend expose le contrat de [openapi.yaml](./openapi.yaml), utiliser :

```env
VITE_API_MODE=api
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Le mode API ne lit aucune fixture et ne revient pas silencieusement au mode mock. Une indisponibilité backend doit afficher une erreur localisée avec une action « Réessayer ».

## 3. Pré-requis du backend

Le backend doit fournir les routes listées dans [api-contract.md](./api-contract.md), avec :

- JSON en `camelCase` ;
- pagination `{ content, page, size, totalElements, totalPages }` ;
- montants sous forme de chaînes numériques entières en XAF ;
- dates techniques ISO 8601 UTC ;
- erreurs `application/problem+json` ;
- `Idempotency-Key` obligatoire pour les créations de mouvements et ajustements.

Le frontend ne transmet jamais la quantité dans une modification de métadonnées produit. Toute variation de stock passe par un mouvement ou un ajustement dédié.

Pour vérifier la disponibilité du backend réel sans effet de bord, exécuter `scripts/verify-backend-readonly.ps1`. Le script ne fait que des `GET` et vérifie le dashboard ainsi que les collections paginées.
Cette vérification exige `VITE_API_MODE=api`, aucun handler MSW actif et aucun fallback vers les fixtures. Elle teste directement la `VITE_API_BASE_URL` fournie et valide les champs essentiels des réponses ainsi que leur `Content-Type`. La validation complète contre les schémas OpenAPI reste couverte par les tests de contrat et le lint OpenAPI.

La commande équivalente est `npm run api:smoke`. Elle ne crée, ne modifie et ne supprime aucune donnée réelle.

## CORS : ne pas utiliser `mode: "no-cors"`

`mode: "no-cors"` n’est pas une correction. Il transforme la réponse en réponse opaque : le frontend ne peut plus lire le statut, le JSON d’erreur, la pagination ou le header `Location`. Cela masque donc le problème au lieu de le résoudre.

En cas d’erreur CORS, corriger la configuration du backend : origine `http://localhost:5173`, méthodes nécessaires, headers `Content-Type` et `Idempotency-Key`, ainsi que les requêtes preflight `OPTIONS`.

## 4. Mutations et reprise

Pendant une mutation, le bouton de soumission est désactivé pour empêcher les doubles clics. Une erreur réseau n’est pas rejouée automatiquement. L’utilisateur peut réessayer avec la même clé d’idempotence afin que le backend renvoie la réponse initiale sans doubler le stock.

Les mouvements validés ne sont ni modifiés ni supprimés côté interface. Une correction passe par un nouvel ajustement justifié.

## 5. Vérification manuelle

1. Ouvrir le dashboard et vérifier les KPI globaux et la période choisie.
2. Ouvrir Produits, tester recherche, filtre, tri, pagination et état vide.
3. Créer une entrée puis vérifier l’invalidation du produit, des mouvements, des alertes et du dashboard.
4. Tenter une sortie supérieure au stock et vérifier le conflit métier.
5. Ouvrir Inventaire, provoquer un changement de version et vérifier le parcours de conflit.
6. Tester le backend arrêté : l’écran concerné doit afficher l’erreur et rester navigable.

Ce guide décrit l’intégration du frontend et le contrat d’échange ; il ne nécessite ni JPA, ni MapStruct, ni `GlobalExceptionHandler` pour le démarrage backend.
## Sécurité des variables Vite

Ne jamais placer de secret dans une variable `VITE_*`. Ces variables sont injectées dans le bundle frontend et peuvent être inspectées par tout utilisateur du navigateur.

Les variables `VITE_*` doivent contenir uniquement de la configuration publique : URL d’API, mode d’exécution ou identifiant public. Les mots de passe, clés privées, tokens d’administration, secrets de signature et identifiants de base de données restent côté backend.
