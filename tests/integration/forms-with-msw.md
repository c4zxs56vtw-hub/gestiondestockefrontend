# Formulaires avec MSW

MSW doit intercepter les requêtes au niveau HTTP, après le repository et le client HTTP. Le chemin testé reste :

```text
formulaire → cas d’usage → repository HTTP → client HTTP → MSW handler
```

Les composants ne lisent pas les handlers directement et ne contournent pas le repository.

## Formulaire produit

### Succès

- Intercepter `POST /products` et répondre `201` avec un produit complet.
- Vérifier que le message de succès apparaît uniquement après la réponse.
- Vérifier que le formulaire est réinitialisé ou fermé selon le parcours choisi.
- Vérifier l’invalidation de la liste produits.

### Validation backend

- Répondre `400 VALIDATION_ERROR` avec `fieldErrors` sur `name`, `sku` ou `categoryId`.
- Vérifier que chaque message est affiché près du champ correspondant.
- Vérifier que les valeurs saisies restent disponibles pour correction.

### Conflit métier

- Répondre `409 SKU_ALREADY_EXISTS`.
- Afficher un message métier compréhensible sans stack trace.
- Ne pas afficher de succès avant la confirmation serveur.

## Formulaire de mouvement

### Entrée

- Intercepter `POST /stock-movements`.
- Vérifier `Content-Type: application/json`.
- Vérifier la présence d’un UUID `Idempotency-Key`.
- Répondre `201` et vérifier le rafraîchissement du produit, des mouvements, des alertes et du dashboard.

### Sortie refusée

- Répondre `409 INSUFFICIENT_STOCK`.
- Vérifier que le formulaire reste ouvert et que la quantité saisie est conservée.
- Vérifier que le bouton est réactivé après la réponse.

### Erreur réseau

- Faire échouer le handler avec une erreur réseau.
- Vérifier l’affichage d’un message « serveur inaccessible ».
- Vérifier qu’aucun succès n’est annoncé.
- Réessayer avec la même clé d’idempotence, jamais avec une nouvelle intention implicite.

## Formulaire d’inventaire

- Répondre `201` pour un ajustement valide.
- Répondre `409 STOCK_VERSION_CONFLICT` pour une version obsolète.
- Vérifier le rechargement du stock actuel et la demande d’une nouvelle confirmation.
- Vérifier que l’ancien ajustement n’est jamais réappliqué automatiquement.

## Matrice de handlers

| Scénario | Réponse MSW | Vérification UI |
|---|---:|---|
| Création produit | `201` | succès après serveur |
| Erreur champ | `400` | erreur près du champ |
| SKU existant | `409` | conflit métier |
| Entrée stock | `201` | invalidation des données |
| Stock insuffisant | `409` | formulaire conservé |
| Backend inaccessible | réseau | retry explicite |
| Version obsolète | `409` | rechargement + confirmation |

MSW est un outil de test et de simulation HTTP. Il ne remplace ni les validations backend ni les tests de concurrence et d’atomicité.

## Règles d’affichage

| Situation | Code | Comportement attendu |
|---|---:|---|
| Création confirmée | `201` | message de succès clair, fermeture ou réinitialisation du formulaire, données rafraîchies |
| Mise à jour confirmée | `200` | message de succès et retour à la donnée actualisée |
| Validation | `400` | erreurs affichées près des champs, saisie conservée |
| Ressource absente | `404` | message de ressource introuvable, action de retour ou nouvelle tentative |
| Conflit métier | `409` | explication métier, aucune modification optimiste, action adaptée |
| Erreur serveur | `500` | message générique sans stack trace, nouvelle tentative explicite |
| Réseau inaccessible | absence de réponse | message de connexion, même mutation rejouable avec la même clé |

Pendant toute requête de mutation, le bouton de soumission est désactivé et affiche un état pending. Une réponse de succès ne doit jamais être affichée avant la confirmation du serveur. Une erreur ne doit pas effacer une saisie utile à la correction.

## Mapping des `fieldErrors`

La réponse Problem Details conserve un tableau réseau :

```json
{
  "code": "VALIDATION_ERROR",
  "fieldErrors": [
    {"field": "name", "message": "Le nom du produit est obligatoire."},
    {"field": "categoryId", "message": "La catégorie est obligatoire."}
  ]
}
```

Le mapper partagé transforme ce tableau en dictionnaire de formulaire :

```ts
{
  name: 'Le nom du produit est obligatoire.',
  categoryId: 'La catégorie est obligatoire.'
}
```

Chaque message est rendu près du champ concerné. Les erreurs sans champ restent des erreurs générales ; elles ne doivent pas être forcées dans un champ arbitraire.
