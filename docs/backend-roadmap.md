# Roadmap Spring Boot

## Principe de démarrage

Cette roadmap ne rend pas JPA, MapStruct ou un `GlobalExceptionHandler` obligatoires pour commencer. Une première version peut utiliser des implémentations simples en mémoire, des mappers explicites locaux et une gestion d’erreur limitée au contrôleur. Ces outils pourront être introduits plus tard lorsqu’ils réduiront réellement la duplication ou faciliteront la persistance.

## Deux niveaux à ne pas confondre

Le CRUD en mémoire est un démarrage technique : il permet de brancher les écrans, vérifier les DTO, la pagination et les parcours de lecture/écriture. Il ne constitue pas une garantie métier et ne doit pas être présenté comme une implémentation de production.

Les garanties métier sont indépendantes du choix de stockage : validation des quantités, impossibilité de stock négatif, transitions d’archivage, unicité du SKU, version de stock, atomicité mouvement + stock, idempotence et protection des références utilisées. Elles doivent être portées par le service métier et couvertes par des tests, même avec un repository en mémoire.

## Progression prévue

- **Étape de démarrage** : CRUD en mémoire, contrats JSON, pagination et branchement des écrans.
- **Étapes suivantes** : validations et règles de stock, mouvements immuables, ajustements avec version, conflits, idempotence et concurrence.
- **Évolutions ultérieures** : persistance durable, sécurité, observabilité et optimisation.

Les fonctionnalités avancées seront implémentées ensuite, de façon incrémentale, et ne doivent pas être supposées disponibles dans le simple CRUD initial.

1. Catégories et fournisseurs : entités, DTO camelCase, controllers CRUD, contraintes et erreurs `*_IN_USE`.
2. Produits : SKU unique, prix `BigDecimal`, statut, stock initial à zéro ; `Long` pour les identifiants.
3. Recherche : `Pageable`, liste blanche de tri, recherche insensible à la casse et pagination stable.
4. Entrées/sorties : service transactionnel, validation de stock et mouvement immuable ; `Instant` pour les dates.
5. Ajustements : `stockVersion`, conflit optimiste, motif obligatoire et tests concurrents.
6. Dashboard : compteurs globaux, valeur indicative en `BigDecimal`, série quotidienne de mouvements par type.
7. Idempotence : clé UUID, déduplication transactionnelle 24 h, tests réseau et concurrence.
8. Persistance et sécurité : migrations, authentification, autorisation et observabilité.

À chaque étape : tester l’endpoint avec les exemples du contrat, ouvrir l’écran concerné, vérifier les états vide/erreur/conflit, puis ajouter le test d’intégration correspondant.
