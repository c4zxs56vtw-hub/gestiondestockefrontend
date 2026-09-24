# Parcours d’apprentissage HTTP

Les exemples sont à exécuter dans cet ordre. Chaque étape ajoute une notion sans supposer que les garanties des étapes suivantes sont déjà disponibles.

## 01 — Lecture simple

1. `dashboard.http` — appeler `GET /dashboard` sans paramètres.
2. `dashboard.http` — ajouter `from` et `to` pour comprendre la période.

Objectif : lire une réponse JSON et distinguer les KPI d’état actuel de la série filtrée par période.

## 02 — Collections paginées

1. `products.http` — lister les produits.
2. `categories.http` — lister les catégories.
3. `suppliers.http` — lister les fournisseurs.

Objectif : comprendre `content`, `page`, `size`, `totalElements`, `totalPages`, puis ajouter recherche, filtre et tri.

## 03 — Consultation des ressources

1. `products.http` — consulter un produit.
2. `categories.http` — consulter une catégorie.
3. `suppliers.http` — consulter un fournisseur.

Objectif : utiliser un identifiant et observer une réponse `404` avec Problem Details.

## 04 — CRUD des métadonnées

1. `categories.http` — créer puis modifier une catégorie.
2. `suppliers.http` — créer puis modifier un fournisseur.
3. `products.http` — créer un produit avec stock initial à zéro.
4. `products.http` — modifier les métadonnées sans envoyer de quantité.

Objectif : distinguer les données descriptives des données de stock.

## 05 — Statuts et références utilisées

1. `products.http` — réactiver ou archiver un produit.
2. `categories.http` — essayer de supprimer une catégorie utilisée.
3. `suppliers.http` — essayer de supprimer un fournisseur référencé.

Objectif : observer les conflits métier et les conditions d’archivage/suppression.

## 06 — Historique des mouvements

1. `stock-movements.http` — lister l’historique paginé.
2. `stock-movements.http` — filtrer par produit, type et période.
3. `stock-movements.http` — consulter un mouvement.

Objectif : comprendre que l’historique validé est consultable mais immuable.

## 07 — Entrées et sorties

1. `stock-movements.http` — créer une entrée `IN`.
2. Vérifier le produit et le dashboard.
3. Créer une sortie `OUT` avec commentaire.
4. Essayer une sortie supérieure au stock.

Objectif : vérifier que le backend calcule stock avant, delta, stock après et version.

## 08 — Idempotence et inventaire

1. Rejouer exactement une entrée avec la même `Idempotency-Key`.
2. Modifier le corps avec la même clé pour obtenir `409 IDEMPOTENCY_KEY_REUSED`.
3. Exécuter `stock-adjustments.http` avec une version courante.
4. Rejouer avec une ancienne version pour observer `STOCK_VERSION_CONFLICT`.

Objectif : comprendre les reprises réseau sûres et les conflits d’inventaire. Ces garanties avancées viennent après le CRUD initial.
