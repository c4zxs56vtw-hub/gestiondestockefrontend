# Règles métier

Ces règles s’appliquent aussi pendant un démarrage avec un repository en mémoire. Le stockage temporaire facilite le CRUD et les tests d’interface ; il ne doit pas être confondu avec une persistance de production ni affaiblir les garanties métier.

## Produits

- Un produit est créé `ACTIVE`, avec `quantityInStock = 0` et `stockVersion = 0`.
- Le stock initial est créé par un mouvement `IN`, jamais dans le formulaire produit.
- Le SKU est normalisé en majuscules, sans espaces en début ou fin, et reste unique même parmi les produits archivés.
- Le nom et la catégorie existante sont obligatoires.
- Le fournisseur est facultatif ; s’il est fourni, il doit exister.
- Les prix et le seuil sont des valeurs entières non négatives.
- Après le premier mouvement, SKU et unité ne sont plus modifiables.
- L’archivage est possible uniquement avec un stock nul.
- Une tentative d’archivage avec un stock supérieur à zéro renvoie `409 PRODUCT_HAS_STOCK` et ne change pas le statut.
- Aucun mouvement n’est autorisé sur un produit archivé ; la réactivation reste possible.

## États de stock

```text
OUT_OF_STOCK : quantityInStock = 0
LOW_STOCK   : 0 < quantityInStock <= minimumStock
IN_STOCK    : quantityInStock > minimumStock
```

La quantité est entière et ne mélange jamais les unités `PIECE`, `BOX` et `CARTON` dans un même calcul transversal.

## Entrées et sorties

- Une entrée ajoute une quantité strictement positive et peut référencer un fournisseur.
- Une sortie retire une quantité strictement positive et ne peut jamais rendre le stock négatif.
- Une sortie exige un commentaire non vide et interdit un fournisseur.
- La vérification du stock et l’écriture du mouvement sont atomiques côté backend.

## Ajustements d’inventaire

- `quantityDelta = countedQuantity - stock actuel`.
- Un ajustement sans changement est refusé.
- `countedQuantity` est entière et supérieure ou égale à zéro.
- Un motif non vide est obligatoire et devient la note du mouvement résultant.
- `expectedStockVersion` doit correspondre à la version actuelle.
- En cas de conflit, le frontend recharge le produit et demande une nouvelle confirmation ; il ne réapplique pas l’ancien ajustement.

## Mouvements et historique

- Le backend calcule `quantityBefore`, `quantityDelta`, `quantityAfter` et incrémente `stockVersion`.
- Le mouvement et la mise à jour du stock forment une seule opération atomique.
- Un mouvement validé n’est ni modifié ni supprimé.
- Une correction passe par un nouveau mouvement justifié.
- Les informations produit et fournisseur de l’historique sont des instantanés.

## Référentiels

- Une catégorie utilisée par un produit ne peut pas être supprimée.
- Un fournisseur utilisé par un produit ou un mouvement ne peut pas être supprimé.
- Les références de produits archivés comptent également.

## Valeur indicative

```text
Somme(quantityInStock × purchasePrice)
```

Le calcul porte sur les produits actifs et est fourni par le backend. Il s’agit d’une valeur indicative du stock, pas d’une valorisation FIFO ni d’un coût moyen pondéré. La devise V1 est `XAF` et les montants sont transmis comme chaînes numériques entières, sans flottants.

## Autorité du backend

Le frontend ne constitue pas la source de vérité du stock. Il peut afficher un écart prévisionnel pendant un inventaire, mais le backend calcule et valide `quantityBefore`, `quantityDelta`, `quantityAfter`, `stockVersion`, les KPI et la valeur indicative. Aucun changement confirmé ne doit être déduit d’une seule page chargée ni d’un calcul local non confirmé.

## Idempotence

`POST /stock-movements` et `POST /stock-adjustments` exigent une clé UUID par intention utilisateur. Même clé + même requête renvoie le résultat initial ; même clé + requête différente renvoie `409 IDEMPOTENCY_KEY_REUSED`. La déduplication doit être atomique avec l’opération de stock et la clé est conservée 24 heures.

## Validation frontend

Les validateurs frontend normalisent le SKU, contrôlent les bornes de longueur, les entiers monétaires, les quantités positives et les champs conditionnels. Ils affichent les erreurs près du champ concerné, mais ne remplacent jamais les validations backend.

## Affichage des états

L’interface affiche toujours le libellé textuel de l’état, accompagné d’un symbole et d’une couleur secondaire : `En stock`, `Stock faible` ou `Rupture de stock`. La couleur seule ne porte jamais l’information.
