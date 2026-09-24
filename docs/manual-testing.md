# Guide de tests manuels

## Préparation

1. Démarrer le frontend en mode mock.
2. Vérifier la présence du badge « Données simulées ».
3. Ouvrir les outils développeur sur l’onglet Network.
4. Pour le backend réel, passer `VITE_API_MODE=api`, vérifier `VITE_API_BASE_URL`, puis redémarrer Vite.

## Dashboard

- Vérifier les compteurs produits actifs, stock faible, rupture et valeur indicative.
- Changer la période du graphique.
- Vérifier qu’une journée sans mouvement reste représentée par zéro.
- Ouvrir une alerte et vérifier la navigation vers le contexte produit.

## Produits

- Rechercher par nom et SKU.
- Vérifier l’état aucun résultat.
- Tester filtre, tri et pagination.
- Créer ou modifier les métadonnées sans champ de quantité.
- Vérifier qu’un produit archivé n’accepte aucun mouvement.

## Mouvements et inventaire

- Créer une entrée avec une clé d’idempotence.
- Rejouer la même requête et vérifier l’absence de doublon.
- Tenter une sortie supérieure au stock.
- Effectuer un ajustement avec un motif.
- Rejouer un ajustement avec une ancienne version et vérifier le conflit.

## Résilience

- Arrêter le backend et vérifier l’erreur localisée avec « Réessayer ».
- Vérifier qu’une mutation incertaine n’est pas rejouée automatiquement.
- Vérifier les erreurs `400`, `404`, `409` et `500` dans Network.
- Vérifier qu’une erreur CORS ne conduit pas à proposer `mode: "no-cors"`.

## Responsive et accessibilité

- Vérifier 375, 768 et 1440 pixels.
- Vérifier l’absence de débordement horizontal global.
- Vérifier le défilement propre du tableau.
- Naviguer uniquement au clavier et contrôler le focus visible.
- Vérifier que les icônes seules possèdent un nom accessible.
- Activer `prefers-reduced-motion` et vérifier la réduction des transitions.
