# Types HTTP générés

Ce dossier est réservé aux types générés depuis `docs/openapi.yaml`.

Commande prévue :

```bash
npm run api:generate
```

Ne pas modifier manuellement le fichier généré. Après toute modification du contrat :

1. valider OpenAPI avec le lint ;
2. régénérer les types ;
3. vérifier les mappers et les formulaires ;
4. lancer le build TypeScript ;
5. rejouer les tests de contrat et les exemples `.http`.

Les modèles du domaine frontend restent indépendants de ces types. Les mappers à la frontière convertissent les types générés vers les modèles métier.
`npm run api:check` exécute le lint OpenAPI, compare une génération temporaire au fichier versionné et lance le typecheck. Il échoue si le contrat et les types sont désynchronisés, sans modifier les fichiers générés. Utiliser `npm run api:generate` explicitement lorsqu’une régénération est nécessaire.
