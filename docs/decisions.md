# Décisions d’architecture

Ce fichier conserve les choix structurants et leurs conséquences. Il ne remplace pas le contrat API ni les règles métier détaillées.

## D-001 — Stack frontend

**Décision :** Vite + React + TypeScript.

**Pourquoi :** démarrage léger, typage des modèles frontend et build statique adapté à un backend séparé.

**Conséquence :** les variables publiques utilisent `VITE_*`; aucun secret ne doit y être placé.

## D-002 — Séparation par ports

**Décision :** les écrans dépendent de ports de repository et de cas d’usage, pas d’un client HTTP concret.

**Pourquoi :** conserver le même parcours lorsque le mode mock est remplacé par l’API réelle.

**Conséquence :** la composition concrète se fait dans `src/app/composition-root.ts`; aucun `fetch` dans un composant.

## D-003 — CRUD en mémoire avant les garanties avancées

**Décision :** commencer par un CRUD en mémoire pour valider l’interface, les DTO et les parcours.

**Limite :** ce démarrage ne constitue pas une garantie métier de production.

**Suite :** implémenter ensuite atomicité, concurrence, version de stock, idempotence persistée et contraintes de références côté backend.

## D-004 — Contrat de pagination explicite

**Décision :** toutes les collections renvoient `{ content, page, size, totalElements, totalPages }`.

**Pourquoi :** éviter les réponses de collection ambiguës et permettre une pagination stable côté frontend.

**Conséquence :** `PaginatedResponseDto<T>` est mappé vers `Page<T>` à la frontière infrastructure.

## D-005 — Valeurs monétaires

**Décision :** devise XAF et montants transmis comme chaînes numériques entières.

**Pourquoi :** éviter les erreurs de flottants côté JSON et garder le contrat compatible avec un calcul backend précis.

**Conséquence :** l’interface affiche une valeur indicative, jamais une valorisation FIFO ou un coût moyen pondéré.

## D-006 — Dashboard comme source des KPI

**Décision :** les indicateurs globaux viennent de `GET /dashboard`.

**Pourquoi :** une page de produits filtrée ne représente pas nécessairement l’inventaire complet.

**Conséquence :** les compteurs d’état actuel sont distingués des mouvements filtrés par période.

## D-007 — Immutabilité des mouvements

**Décision :** un mouvement validé ne peut pas être modifié ou supprimé.

**Pourquoi :** conserver une piste d’audit fiable.

**Conséquence :** une correction est un nouvel ajustement justifié.

## D-008 — Idempotence des mutations de stock

**Décision :** `POST /stock-movements` et `POST /stock-adjustments` exigent `Idempotency-Key`.

**Pourquoi :** permettre une nouvelle tentative réseau sans doubler le stock.

**Conséquence :** le frontend ne rejoue pas automatiquement une mutation et réutilise la même clé pour une intention inchangée.

## D-009 — CORS explicite

**Décision :** autoriser explicitement l’origine frontend et ne jamais proposer `mode: "no-cors"`.

**Pourquoi :** `no-cors` rend la réponse opaque et empêche la lecture des erreurs, du JSON et de `Location`.

**Conséquence :** le backend doit traiter l’origine, les méthodes, les headers et le preflight `OPTIONS`.

## D-010 — Démarrage backend sans framework imposé

**Décision :** JPA, MapStruct et `GlobalExceptionHandler` ne sont pas requis pour commencer.

**Pourquoi :** avancer par étapes pédagogiques, avec des implémentations simples et testables.

**Conséquence :** ces outils restent des évolutions possibles, pas des prérequis du CRUD initial.

## Hypothèses de travail

Ces hypothèses permettent de poursuivre l’implémentation sans bloquer le projet
sur des choix qui pourront rester internes au frontend ou au backend.

- Le frontend est une application monoposte sans authentification dans cette V1.
- Le fuseau d’affichage métier est `Africa/Douala`; les dates échangées avec l’API
  restent en UTC au format ISO 8601.
- Le mode mock doit reproduire le chemin HTTP prévu par le contrat, afin que le
  passage au backend réel ne change ni les écrans ni les cas d’usage.
- Les données de démonstration sont déterministes et réinitialisables; elles ne
  représentent pas une persistance durable.
- Les écrans affichent les erreurs localement lorsqu’un module échoue; une panne
  d’un endpoint ne doit pas bloquer toute la navigation.
- Les décisions non encore couvertes par le contrat sont laissées à la frontière
  d’infrastructure et ne sont pas transformées en règles implicites dans les
  composants React.
- Les outils backend (JPA, Hibernate, MapStruct, gestionnaire global d’erreurs)
  restent optionnels pour le premier CRUD en mémoire.

Si une hypothèse devient fausse, elle devra être remplacée par une décision
explicite et vérifiée contre `docs/openapi.yaml`, plutôt que corrigée uniquement
dans l’interface.
