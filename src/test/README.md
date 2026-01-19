# Tests Unitaires - Base de Données

Ce dossier contient les tests unitaires pour la base de données de l'application.

## Structure

- `setup.ts` : Configuration et setup de la base de données de test
- `auth.service.test.ts` : Tests pour le service d'authentification
- `users.service.test.ts` : Tests pour le service des utilisateurs
- `database.test.ts` : Tests pour les modèles de base de données (User, LoginAttempts, IpBlock)

## Exécution des tests

Pour exécuter tous les tests :
```bash
npm test
```

Pour exécuter un fichier de test spécifique :
```bash
npm test auth.service.test.ts
```

Pour exécuter les tests en mode watch :
```bash
npm test -- --watch
```

## Configuration

Les tests utilisent une base de données SQLite séparée (`test.db`) qui est créée et supprimée automatiquement lors de l'exécution des tests.

## Notes

- La base de données de test est nettoyée avant chaque test
- Les tests sont isolés et ne modifient pas la base de données de développement
- La base de données de test est supprimée après l'exécution de tous les tests
