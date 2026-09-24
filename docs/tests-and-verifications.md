# 14. Tests et vérifications

## Règle de reporting

Ne rapporter comme effectué que ce qui a réellement été exécuté. Une réponse HTTP `200` prouve que la page est servie, pas qu’elle a été inspectée visuellement. Une vérification visuelle nécessite un navigateur effectivement ouvert et inspecté. Tout contrôle impossible doit être marqué comme bloqué ou non effectué.

## Objectif

Vérifier séparément l’interface, le contrat HTTP et les garanties métier. Un test frontend réussi ne prouve pas à lui seul l’atomicité ou la concurrence du backend.

## 14.1 Vérifications statiques

- `npm run build` doit réussir sans erreur TypeScript.
- Les DTO utilisent les noms `camelCase` du contrat.
- Aucun composant ne contient d’appel `fetch` direct.
- Aucun secret ne se trouve dans une variable `VITE_*`.
- Aucun fichier Java complet n’est ajouté au dépôt.
- Les collections utilisent `PaginatedResponseDto<T>` puis `toPage()`.

## 14.2 Tests unitaires frontend

Tester sans navigateur ni API :

- normalisation d’un SKU en majuscules et sans espaces périphériques ;
- calcul d’état `IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK` ;
- conversion `PaginatedResponseDto<T>` vers `Page<T>` ;
- mapping explicite d’un `ProductResponseDto` vers `Product`, y compris `supplier: null` ;
- validation de formulaire avec erreurs attachées au champ concerné ;
- rendu des états avec libellé, symbole et couleur non exclusive ;
- formatage XAF, unités `PIECE`/`BOX`/`CARTON` et dates Africa/Douala ;
- construction de query params avec pagination, filtres, tri autorisé et retour à la page zéro ;
- invalidation du produit, des listes, des mouvements, des alertes et du dashboard après mutation ;
- vérification que le stock confirmé, les deltas, les versions et KPI viennent de la réponse backend ;
- construction des paramètres `page`, `size`, `sort` et filtres ;
- mapping des Problem Details vers une erreur de formulaire ;
- affichage des états `loading`, `empty`, `error`, `success` ;
- création et réutilisation d’une `Idempotency-Key` pendant une tentative.

### Principes

- Un test unitaire vérifie une fonction, un mapper ou un cas d’usage isolé.
- Les dépendances externes sont remplacées par des ports ou des doublures contrôlées.
- Les tests ne lisent ni fixtures directement depuis un écran ni variables d’un backend réel.
- Chaque test doit être déterministe et ne pas dépendre de l’heure système.

### Cas d’usage avec port simulé

Un cas d’usage reçoit son repository par injection. Le test fournit uniquement le comportement attendu du port :

```ts
const repository = {
  list: async () => ({
    content: [], page: 0, size: 20, totalElements: 0, totalPages: 0,
  }),
} as ProductRepository

const result = await listProducts(repository, {
  filters: { q: 'clavier', status: 'ACTIVE' },
  page: 0,
  size: 20,
})

expect(result.totalElements).toBe(0)
```

Le test vérifie le cas d’usage et ses paramètres, sans démarrer le serveur, sans `fetch` et sans importer une fixture depuis la présentation. Le repository mock ou HTTP peut ensuite être remplacé sans modifier le cas d’usage.

### Cas minimums

| Sujet | Cas nominal | Cas limite ou erreur |
|---|---|---|
| État du stock | stock supérieur au seuil → `IN_STOCK` | zéro → `OUT_OF_STOCK`, seuil atteint → `LOW_STOCK` |
| Pagination | page et totaux conservés | collection vide, page au-delà des résultats |
| Produit | SKU normalisé correctement | nom vide, prix négatif, seuil invalide |
| Mouvement | entrée positive acceptée | sortie supérieure au stock, produit archivé |
| Ajustement | écart calculé correctement | aucun changement, version obsolète |
| Erreur API | `fieldErrors` associé au bon champ | erreur non JSON ou réseau absent |
| Mutation | succès après confirmation serveur | bouton bloqué pendant l’envoi, pas de double soumission |

### Ce qui ne relève pas du test unitaire

L’atomicité du stock, la concurrence, la déduplication persistée de l’idempotence et les contraintes entre ressources sont des garanties backend. Elles nécessitent des tests d’intégration ou de concurrence côté API, pas seulement des tests de fonctions frontend.

## 14.3 Tests de contrat

À exécuter contre le mock puis contre l’API réelle :

- routes et méthodes conformes à `docs/openapi.yaml` ;
- pagination avec résultat et collection vide ;
- réponse `201` et header `Location` lorsque fourni ;
- réponses `204` sans tentative de lecture JSON ;
- erreurs `400`, `404`, `409` et `500` au format Problem Details ;
- `Idempotency-Key` obligatoire sur mouvements et ajustements ;
- aucune route `DELETE /products` ni modification de mouvement validé.

Les exemples exécutables se trouvent dans `docs/http/*.http`.

## 14.4 Tests d’intégration mock

Le chemin doit rester :

```text
écran → cas d’usage → port → repository mock → transport mock
```

Vérifier que :

- les écrans ne lisent pas directement les fixtures ;
- une création invalide remonte des erreurs de champ ;
- une mutation réussie rafraîchit les données concernées ;
- une erreur réseau n’est pas rejouée automatiquement ;
- le même envoi peut être retenté avec la même clé sans doublon.

## 14.5 Tests E2E

Parcours minimum :

1. Ouvrir le dashboard et changer la période.
2. Rechercher un produit et obtenir une liste vide.
3. Ouvrir une alerte de stock.
4. Créer une entrée et vérifier le message de succès.
5. Tenter une sortie supérieure au stock et vérifier le conflit.
6. Effectuer un inventaire avec motif.
7. Provoquer une erreur réseau, réessayer, puis vérifier l’absence de doublon.

## 14.6 Responsive et accessibilité

Vérifier aux largeurs 375, 768 et 1440 px :

- pas de débordement horizontal global ;
- tableau défilable dans son propre conteneur ;
- actions importantes visibles sans survol ;
- formulaires utilisables au clavier et sur mobile ;
- focus visible sur tous les contrôles ;
- icônes seules avec nom accessible ;
- contraste suffisant sans information portée uniquement par la couleur ;
- navigation mobile fermable au clavier ;
- animations réduites avec `prefers-reduced-motion`.

## 14.7 Répartition des garanties

Le CRUD mémoire vérifie les parcours et le contrat de base. Les tests backend ultérieurs devront vérifier atomiquement : stock non négatif, unicité SKU, version de stock, idempotence persistée, références utilisées et concurrence. Ces garanties ne doivent pas être déclarées couvertes par les seuls tests d’interface.
