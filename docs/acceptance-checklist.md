# Checklist d’acceptation StockPilot

Légende : `[x]` vérifié ou livré, `[ ]` à implémenter ou vérifier avec le backend réel.

## Interface et navigation

- [x] Dashboard affiché comme écran initial.
- [x] Sidebar avec logo typographique StockPilot et navigation.
- [x] Sidebar repliable sur desktop.
- [x] Navigation mobile sous forme de panneau avec scrim et fermeture accessible.
- [x] Fil d’Ariane et titre de page visibles.
- [x] Badge explicite « Données simulées ».
- [x] Tous les boutons visibles déclenchent une action ou une notification compréhensible.

## Design system et responsive

- [x] Tokens de couleurs, espacements, rayons, ombres et hauteur de contrôle définis.
- [x] Titres et cartes dimensionnés pour une application métier dense.
- [x] États `hover`, `focus-visible` et transitions sobres.
- [x] `prefers-reduced-motion` respecté.
- [ ] Vérification finale à 375 px.
- [ ] Vérification finale à 768 px.
- [ ] Vérification finale à 1440 px.
- [x] Pas de débordement horizontal global ; le tableau possède son propre défilement.

## Dashboard

- [x] Valeur indicative du stock affichée avec devise XAF.
- [x] Produits actifs, stock faible et mouvements affichés.
- [x] Graphique utilisant des nombres de mouvements.
- [x] Sélection de période disponible.
- [x] Alertes de stock visibles sans dépendre du survol.
- [ ] KPI et séries alimentés par `GET /dashboard` réel.

## Produits et référentiels

- [x] Recherche par nom ou SKU et état « aucun résultat ».
- [x] Tableau lisible avec défilement interne.
- [ ] Pagination backend et filtres catégorie/fournisseur/statut/stock.
- [ ] Création, modification, consultation et archivage branchés aux routes API.
- [ ] Quantité absente des formulaires de métadonnées produit.
- [ ] CRUD catégories et fournisseurs branché aux routes API.
- [ ] Confirmations pour suppressions et archivage sensible.

## Mouvements et inventaire

- [x] Contrat documenté pour entrées, sorties et ajustements.
- [x] Exemples HTTP de succès et conflits métier.
- [ ] Formulaires d’entrée et sortie branchés à l’API.
- [ ] Après une entrée, stock produit, historique, alertes et dashboard sont invalidés puis rechargés séparément.
- [ ] Mouvements validés non modifiables et non supprimables dans l’interface.
- [ ] Parcours inventaire avec stock système, comptage, écart et motif.
- [ ] Conflit de `stockVersion` géré avec rechargement et nouvelle confirmation.

## Résilience et erreurs

- [x] Contrat Problem Details documenté.
- [x] CORS documenté sans proposer `mode: "no-cors"`.
- [x] Aucun secret prévu dans une variable `VITE_*`.
- [ ] États loading/skeleton, erreur API et nouvelle tentative sur chaque écran connecté.
- [ ] Distinction complète entre erreur réseau, erreur de contrat et conflit métier.
- [ ] Aucune mutation rejouée automatiquement après erreur réseau.

## Architecture et intégration

- [x] DTO paginé explicite `PaginatedResponseDto<T>`.
- [x] Mapper DTO HTTP vers modèle métier `Page<T>`.
- [x] Port de repository produit et composition à la périphérie.
- [x] Documentation OpenAPI, HTTP, architecture et roadmap.
- [ ] Repository HTTP réel et MSW branchés derrière les mêmes ports.
- [ ] Tests contractuels et E2E ajoutés.

## Garanties métier futures

- [ ] Atomicité mouvement + mise à jour du stock.
- [ ] Stock négatif impossible.
- [ ] Unicité du SKU, y compris produits archivés.
- [ ] Version de stock et conflits concurrents.
- [ ] Idempotence persistée pendant 24 heures.
- [ ] Protection des catégories et fournisseurs référencés.

Le CRUD en mémoire constitue le démarrage technique. Les garanties métier avancées seront implémentées ensuite côté backend et ne doivent pas être considérées comme acquises par la seule présence des exemples HTTP ou des fixtures.
- [ ] Double clic sur une mutation : une seule requête et un seul mouvement créé.
