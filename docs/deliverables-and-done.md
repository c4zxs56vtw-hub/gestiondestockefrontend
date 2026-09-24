# 15. Livrables et critères de fin

## Livrables

- application frontend React/TypeScript démarrable localement ;
- dashboard StockPilot responsive avec données mock clairement signalées ;
- navigation desktop repliable et panneau mobile accessible ;
- modèles frontend, ports, cas d’usage et mappers de frontière ;
- DTO paginé explicite et normalisation des erreurs HTTP ;
- validateurs de formulaires et affichage des états de stock ;
- route de développement `/developer/api` sans API supplémentaire ;
- contrat `docs/openapi.yaml` et documentation lisible associée ;
- exemples `.http` regroupés par ordre d’apprentissage ;
- script read-only de vérification du vrai backend ;
- documentation architecture, règles métier, intégration, tests et décisions ;
- checklist d’acceptation et parcours Playwright documentés.

## Critères de fin frontend

Le livrable frontend est terminé lorsque :

- l’application démarre en mode mock sans backend ;
- le mode API utilise la base URL configurée sans fallback silencieux ;
- aucun secret n’est présent dans `VITE_*` ;
- les écrans affichent loading, succès, vide, erreur et nouvelle tentative ;
- les validations de formulaires sont attachées aux champs concernés ;
- les réponses `204`, non JSON et réseau sont traitées sans stack trace ;
- la pagination, les filtres et les invalidations suivent le contrat ;
- les largeurs 375, 768 et 1440 px sont vérifiées ;
- aucun débordement horizontal global n’est présent ;
- les tests de contrat, fixtures et handlers mock sont alignés sur OpenAPI ;
- les calculs d’autorité du stock ne sont pas implémentés uniquement dans les composants ;
- le script backend read-only ne fait que des `GET` et produit un rapport réel.

## Critères de fin backend

Ils ne sont pas considérés comme livrés par le CRUD mémoire. Ils devront être validés ensuite côté API :

- stock non négatif et opération mouvement + stock atomique ;
- unicité du SKU, y compris archivés ;
- archivage uniquement avec stock nul ;
- version de stock et conflits concurrents ;
- idempotence persistée pendant 24 heures ;
- protection des catégories et fournisseurs référencés ;
- historique de mouvements immuable ;
- tests de concurrence et de persistance.

## Hors périmètre de ce dépôt

Ce dépôt ne livre aucun backend Java complet, aucune configuration JPA obligatoire, aucun MapStruct imposé et aucun `GlobalExceptionHandler` requis pour démarrer.
