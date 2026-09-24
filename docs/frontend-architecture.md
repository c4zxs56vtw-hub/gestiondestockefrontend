# Architecture frontend StockPilot

## Objectif

L’interface doit pouvoir passer du mode mock au backend réel sans réécrire les pages. Les écrans dépendent de cas d’usage et de ports internes, jamais d’un appel HTTP concret.

## Organisation

```text
src/
  app/
    composition-root.ts       composition des implémentations
  features/
    products/
      domain/                  modèles et ports
      application/             cas d’usage
      infrastructure/          repositories mock ou HTTP
      presentation/            pages, composants, hooks
    categories/
    suppliers/
    stock-movements/
    inventory/
    dashboard/
  shared/
    domain/                    modèles vraiment transverses
    application/               abstractions applicatives communes
    infrastructure/             HTTP, DTO et mappers de frontière
    presentation/               composants UI et hooks génériques
```

Les sous-dossiers sont créés lorsqu’ils portent une responsabilité réelle ; aucune couche vide n’est ajoutée uniquement pour remplir une arborescence.

## Règles de dépendance

```text
presentation → application → domain
infrastructure → ports du domain/application
composition-root → implémentations concrètes
```

- `domain` ne dépend ni de React, ni de HTTP, ni des DTO générés.
- `application` orchestre les cas d’usage à partir des ports.
- `infrastructure` traduit les DTO HTTP et gère le client réseau.
- `presentation` affiche les états et déclenche les cas d’usage injectés.
- Les échanges entre fonctionnalités passent par des exports publics ou des ports explicites.
- Aucun import profond arbitraire ni cycle de dépendances.

## Flux d’une lecture

```text
Écran React
  → hook / cas d’usage
  → ProductRepository (port)
  → repository mock ou HTTP
  → client HTTP / MSW ou API distante
  → mapper DTO → modèle frontend
  → état loading / success / empty / error
```

Un composant ne fait pas de `fetch`, ne lit pas les fixtures et ne contient pas de règle métier importante.

## Pagination et frontières

L’API renvoie `PaginatedResponseDto<T>`. Le mapper `toPage()` convertit cette forme HTTP en `Page<T>`, utilisée par l’application. Les modèles frontend restent donc indépendants du nommage ou des détails de transport.

Les mappers de fonctionnalité, comme `toProduct()`, recopient explicitement les champs du DTO HTTP vers le modèle frontend. Ils préservent les valeurs `null`, gardent les montants sous forme de chaînes et isolent la présentation d’une évolution du transport.

Les types TypeScript générés ne constituent pas une validation runtime. Une réponse externe est validée contre son schéma avant le mapper ; un JSON invalide devient une erreur contrôlée et n’entre jamais dans le domaine.

Le formatage est centralisé dans `src/shared/presentation/formatters.ts` : XAF sans symbole ambigu, quantités avec unité explicite et dates affichées dans le fuseau métier `Africa/Douala`. Les montants ne sont pas convertis en flottants pour l’affichage.

Un repository HTTP frontend représente un accès à une API distante. Il ne remplace pas le Repository de persistance qui sera développé dans Spring Boot.

## Modes d’exécution

- `VITE_API_MODE=mock` : adaptateurs en mémoire, utiles pour le démarrage, les parcours et les tests d’interface.
- `VITE_API_MODE=api` : repositories HTTP et backend réel ; aucune bascule silencieuse vers les fixtures.

Le passage API utilise les mêmes ports. Il nécessite `VITE_API_BASE_URL=http://localhost:8080/api/v1` et un redémarrage après modification des variables Vite.

## Mutations de stock

Les quantités ne sont pas mises à jour de façon optimiste. Après confirmation serveur, les listes produits, le produit concerné, les mouvements, les alertes et le dashboard sont rafraîchis. Les mutations de mouvements réutilisent la même clé d’idempotence lors d’une nouvelle tentative incertaine.

Les clés de requêtes sont struc
turées dans `src/shared/application/query-invalidation.ts`. Une mutation n’écrit pas une seconde copie globale des données serveur : elle invalide les clés concernées et laisse le repository ou le client de requêtes recharger la source officielle.
