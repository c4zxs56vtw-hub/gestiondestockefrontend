# Tests d’intégration frontend

Ces tests vérifient la collaboration entre présentation, cas d’usage, ports et adaptateur de transport. Ils ne remplacent pas les tests de garanties métier côté backend.

## Périmètre

```text
écran ou hook → cas d’usage → repository (port) → mock HTTP ou API de test → mapper DTO → état de l’écran
```

## Scénarios minimums

- une liste paginée affiche `content`, la page courante et les totaux ;
- une recherche réinitialise la page à zéro et transmet `q` ;
- une collection vide affiche un état vide, pas une erreur ;
- une réponse `400` associe `fieldErrors` aux champs correspondants ;
- une réponse `404` affiche une absence de ressource localisée ;
- une réponse `409` affiche un conflit métier sans message technique ;
- une erreur réseau distingue l’absence de réponse d’une erreur HTTP ;
- une mutation désactive son bouton pendant l’envoi ;
- un succès rafraîchit le produit, les mouvements, les alertes et le dashboard concernés ;
- une tentative incertaine est rejouable avec la même `Idempotency-Key` ;
- aucune mutation n’est rejouée automatiquement ;
- une réponse `204` n’est pas lue comme JSON.

## Modes

En mode mock, les tests utilisent l’état mémoire déterministe. En mode API, ils utilisent un serveur de test conforme à `docs/openapi.yaml`. Aucun écran ne change de code selon le mode.

## Hors périmètre

L’atomicité mouvement + stock, la concurrence, la persistance de l’idempotence pendant 24 heures et les contraintes de références sont des tests backend/intégration API. Le frontend vérifie le mapping et l’affichage de leurs réponses.
