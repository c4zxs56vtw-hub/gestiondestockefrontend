# Parcours E2E Playwright

Les tests E2E vérifient l’application depuis le navigateur. Ils utilisent le mode mock pour les parcours déterministes, puis un serveur API de test pour les vérifications contractuelles réelles.

## Parcours principal

1. Ouvrir `/` et vérifier le dashboard.
2. Vérifier les KPI, le badge « Données simulées » et la période du graphique.
3. Ouvrir **Catégories** et créer une catégorie.
4. Ouvrir **Fournisseurs** et créer un fournisseur.
5. Ouvrir **Produits** depuis la navigation.
6. Créer un produit en sélectionnant la catégorie et le fournisseur créés.
7. Rechercher un SKU existant.
8. Appliquer un filtre et vérifier que la page revient à zéro.
9. Rechercher une valeur inexistante et vérifier l’état vide.
10. Ouvrir une alerte stock faible.
11. Créer une entrée via le formulaire de mouvement.
12. Vérifier le message de succès après confirmation serveur.
13. Vérifier le rafraîchissement du produit, de l’historique et du dashboard.

## Création produit avec stock initial nul

Après la création de la catégorie et du fournisseur :

- renseigner SKU, nom, description, références, unité, prix et seuil ;
- vérifier que le formulaire ne contient aucun champ de quantité ;
- soumettre le formulaire une seule fois ;
- vérifier le succès après la réponse serveur `201` ;
- vérifier que le produit créé possède `quantityInStock = 0` et `stockVersion = 0` ;
- vérifier qu’un stock initial éventuel doit ensuite passer par un mouvement `IN`.

## Enregistrer une entrée

- ouvrir le formulaire d’entrée depuis le produit actif ;
- sélectionner le produit et saisir une quantité entière strictement positive ;
- sélectionner éventuellement le fournisseur ;
- renseigner une référence et un commentaire si nécessaire ;
- vérifier l’envoi de `Content-Type: application/json` et d’un `Idempotency-Key` UUID ;
- désactiver le bouton pendant l’envoi pour empêcher les doubles soumissions ;
- attendre la réponse serveur `201` avant d’afficher le succès ;
- vérifier le stock actualisé, la nouvelle version, l’historique et les KPI du dashboard ;
- rejouer la même intention avec la même clé et vérifier l’absence de doublon.

## Vérification après l’entrée

- **Stock produit** : vérifier que la quantité affichée augmente exactement de la quantité validée et que `stockVersion` progresse d’une unité.
- **Historique** : vérifier qu’un nouveau mouvement `IN` apparaît avec date, produit, delta positif, stock avant et stock après.
- **Dashboard** : vérifier que les KPI et la série de mouvements sont rechargés depuis `/dashboard`, sans additionner localement des quantités d’unités différentes.
- **Alertes** : vérifier qu’un produit sorti de `LOW_STOCK` n’apparaît plus dans la vue correspondante.
- **Erreur de rafraîchissement** : si une requête secondaire échoue, afficher l’erreur de la vue concernée sans masquer le succès de la mutation confirmée.

## Enregistrer une sortie valide

- ouvrir le formulaire de sortie sur un produit actif disposant d’un stock suffisant ;
- saisir une quantité entière strictement positive et inférieure ou égale au stock disponible ;
- vérifier qu’aucun fournisseur ne peut être renseigné pour une sortie ;
- saisir un commentaire obligatoire, par exemple « Préparation commande client » ;
- envoyer la requête avec une nouvelle `Idempotency-Key` UUID ;
- vérifier le succès `201` puis la diminution exacte du stock ;
- vérifier le mouvement `OUT` avec delta négatif, stock avant et stock après ;
- vérifier que le mouvement validé n’expose aucune action de modification ou suppression.

## Tenter une sortie supérieure au stock

- ouvrir le formulaire de sortie sur un produit actif ;
- saisir une quantité strictement supérieure au stock disponible ;
- saisir le commentaire obligatoire ;
- soumettre avec une `Idempotency-Key` UUID ;
- attendre `409 INSUFFICIENT_STOCK` ;
- afficher un message métier compréhensible, sans stack trace ;
- conserver la quantité saisie pour permettre la correction ;
- vérifier que le stock, `stockVersion`, l’historique, les alertes et le dashboard ne changent pas ;
- ne pas afficher de message de succès et réactiver le bouton après la réponse.

## Parcours d’erreur

- soumettre un produit invalide et vérifier les erreurs près des champs ;
- soumettre une sortie supérieure au stock et vérifier `INSUFFICIENT_STOCK` ;
- simuler un backend inaccessible et vérifier le message réseau ;
- réessayer sans double soumission ;
- provoquer un conflit de version d’inventaire et vérifier le rechargement avant confirmation.

## Responsive

Exécuter au minimum sur :

- `375 × 812` : menu mobile, formulaires empilés, tableau défilable ;
- `768 × 1024` : navigation et grille intermédiaire ;
- `1440 × 900` : sidebar complète, grille dashboard et tableau.

## Accessibilité

- parcourir la page au clavier ;
- vérifier le focus visible ;
- ouvrir et fermer le panneau mobile au clavier ;
- vérifier les noms accessibles des boutons iconographiques ;
- vérifier les messages d’erreur associés aux champs ;
- activer `prefers-reduced-motion`.

## Règles de stabilité

- utiliser des rôles et labels accessibles plutôt que des sélecteurs CSS fragiles ;
- utiliser des données déterministes et une horloge contrôlée ;
- attendre un état observable, jamais un délai arbitraire ;
- réinitialiser l’état mock entre les tests ;
- ne pas tester les détails visuels internes lorsqu’un comportement observable suffit.

Ces scénarios valident le frontend. Les garanties d’atomicité, de concurrence et de persistance de l’idempotence restent couvertes par les tests backend correspondants.
## Vérifier l’absence de mouvement après un refus

Avant la tentative de sortie, relever le nombre de mouvements et la dernière `stockVersion`. Après la réponse `409 INSUFFICIENT_STOCK` :

- relire `GET /stock-movements?productId=...` ;
- vérifier qu’aucun nouveau mouvement `OUT` n’a été ajouté ;
- vérifier que le total de mouvements est identique ;
- vérifier que `quantityInStock` et `stockVersion` sont inchangés ;
- vérifier qu’aucune invalidation de succès n’est affichée.

## Réaliser un ajustement d’inventaire

- rechercher un produit actif ;
- afficher et mémoriser le stock système ainsi que `stockVersion` ;
- saisir la quantité physiquement comptée ;
- vérifier l’affichage de l’écart prévisionnel `countedQuantity - stock système` ;
- saisir un motif non vide ;
- demander une confirmation avant l’envoi ;
- envoyer `countedQuantity`, `expectedStockVersion` et `reason` avec une `Idempotency-Key` UUID ;
- attendre `201` avant d’afficher le succès ;
- vérifier le stock actualisé, la nouvelle version et le mouvement `ADJUSTMENT` créé.

## Simuler un conflit de version

- ouvrir un produit et mémoriser son `stockVersion` ;
- modifier son stock par une autre entrée ou sortie avant de confirmer l’inventaire ;
- soumettre l’ajustement avec l’ancienne valeur `expectedStockVersion` ;
- attendre `409 STOCK_VERSION_CONFLICT` ;
- afficher un message expliquant que le stock a changé depuis le comptage ;
- recharger le stock actuel et sa nouvelle version ;
- demander une nouvelle confirmation à l’utilisateur ;
- vérifier que l’ancien ajustement n’a pas été réappliqué automatiquement ;
- vérifier qu’aucun mouvement `ADJUSTMENT` n’a été créé lors du premier refus.

## Vérifier le refus d’archivage avec stock

- ouvrir un produit actif dont `quantityInStock > 0` ;
- demander son archivage ;
- confirmer l’action sensible si une confirmation est proposée ;
- attendre `409 PRODUCT_HAS_STOCK` ;
- afficher un message indiquant que le stock doit d’abord être ramené à zéro ;
- vérifier que le statut reste `ACTIVE` ;
- vérifier qu’aucune suppression, mutation de stock ou modification partielle n’a été effectuée.
## Vérifier qu’un double clic ne crée pas deux mouvements

- ouvrir le formulaire d’entrée ou de sortie valide ;
- renseigner les champs requis ;
- déclencher deux clics rapides sur le bouton de soumission ;
- vérifier que le bouton passe en état `pending` et devient désactivé après le premier clic ;
- vérifier dans Network qu’une seule requête de mutation est envoyée ;
- vérifier qu’une seule `Idempotency-Key` est utilisée pour cette intention ;
- attendre un seul `201` et vérifier qu’un seul mouvement apparaît dans l’historique ;
- vérifier que le stock n’est modifié qu’une seule fois.

## Vérifier un parcours mobile

- lancer le navigateur avec une largeur de `375 px` ;
- vérifier que la sidebar est remplacée par un bouton de menu accessible ;
- ouvrir le panneau mobile et vérifier le scrim, le focus visible et la fermeture au clavier ;
- naviguer vers Produits, puis fermer le panneau ;
- vérifier que les actions importantes restent visibles sans survol ;
- remplir un formulaire avec des champs empilés et des contrôles utilisables au toucher ;
- vérifier que le tableau défile horizontalement dans son conteneur uniquement ;
- vérifier qu’aucun débordement horizontal n’existe sur la page entière ;
- vérifier qu’un message d’erreur de champ reste visible près du champ concerné.
