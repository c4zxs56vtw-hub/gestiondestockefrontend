# Validation des fixtures et réponses simulées

Le mode mock doit respecter le même contrat que l’API réelle. Une fixture n’est pas une source de vérité indépendante : elle doit être valide contre le schéma OpenAPI correspondant.

## Règle

Pour chaque handler MSW :

1. identifier l’`operationId` de la route ;
2. valider le corps de requête contre le schéma de requête ;
3. valider la réponse simulée contre le schéma de succès ou d’erreur ;
4. vérifier les headers (`Content-Type`, `Location`, `Idempotency-Key`) ;
5. vérifier le code HTTP annoncé.

## Collections

Les réponses de liste doivent toujours contenir :

```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 0,
  "totalPages": 0
}
```

Une collection vide est valide ; une propriété manquante ne l’est pas.

## Problem Details

Les erreurs simulées doivent respecter `application/problem+json` et contenir `type`, `title`, `status`, `detail`, `instance`, `code` et `fieldErrors`. `fieldErrors` reste un tableau vide lorsqu’aucune erreur de champ n’est présente.

## Scénarios obligatoires

- réponse produit complète avec fournisseur ;
- réponse produit avec `supplier: null` ;
- page vide ;
- création `201` avec ressource et `Location` ;
- suppression `204` sans corps ;
- validation `400` avec erreurs de champ ;
- conflit `409` avec code métier ;
- réponse réseau absente simulée séparément d’une réponse HTTP non JSON.

## Vérification

La validation est à exécuter après toute modification de fixture, handler ou `openapi.yaml`. Les fixtures invalides doivent faire échouer le test plutôt que d’être corrigées silencieusement par le composant.

Les garanties métier avancées restent testées séparément : la conformité au schéma ne prouve pas l’atomicité, la concurrence ou l’idempotence persistée.
