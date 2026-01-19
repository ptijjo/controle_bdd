# Tests de Sécurité Automatisés

Ce document décrit les tests de sécurité automatisés implémentés pour l'application.

## Exécution des Tests

```bash
npm test security.test.ts
```

Ou pour exécuter tous les tests :
```bash
npm test
```

## Types de Tests Implémentés

### 1. Protection contre SQL Injection
- ✅ Rejet des tentatives d'injection SQL dans les emails
- ✅ Protection contre l'injection SQL dans les IDs utilisateur
- ✅ Validation que Prisma protège correctement contre les injections

### 2. Protection contre XSS (Cross-Site Scripting)
- ✅ Échappement des scripts dans les champs de formulaire
- ✅ Validation des payloads XSS communs
- ✅ Protection des signatures base64

### 3. Protection contre CSRF
- ✅ Exigence d'un token d'authentification pour les requêtes POST
- ✅ Exigence d'un token d'authentification pour les requêtes DELETE
- ✅ Validation que les cookies SameSite=Lax fonctionnent

### 4. Contrôle d'Accès et Autorisation
- ✅ Empêchement des utilisateurs normaux d'accéder aux endpoints admin
- ✅ Vérification que les admins peuvent accéder aux endpoints admin
- ✅ Protection contre la suppression d'autres utilisateurs

### 5. Validation des Entrées
- ✅ Rejet des emails invalides
- ✅ Rejet des mots de passe faibles
- ✅ Validation du format des signatures base64
- ✅ Validation de la taille des signatures

### 6. Rate Limiting
- ✅ Limitation des tentatives de connexion
- ✅ Limitation des tentatives d'invitation
- ✅ Vérification que les limites sont respectées

### 7. Protection contre les Tokens Invalides
- ✅ Rejet des tokens expirés
- ✅ Rejet des tokens avec signature invalide
- ✅ Rejet des tokens modifiés

### 8. Protection contre les Attaques par Force Brute
- ✅ Blocage d'IP après plusieurs tentatives avec emails inexistants
- ✅ Verrouillage de compte après plusieurs tentatives de mot de passe incorrect

### 9. Protection contre Path Traversal
- ✅ Empêchement de l'accès aux fichiers en dehors du répertoire autorisé
- ✅ Validation des chemins de fichiers

## Structure des Tests

Les tests sont organisés en suites de tests (`describe`) pour chaque type de vulnérabilité. Chaque test vérifie un aspect spécifique de la sécurité.

## Ajout de Nouveaux Tests

Pour ajouter de nouveaux tests de sécurité :

1. Ajoutez une nouvelle suite `describe` dans `security.test.ts`
2. Créez des tests spécifiques pour la vulnérabilité
3. Vérifiez que les tests passent avec `npm test`

## Exemple de Test

```typescript
describe('Nouvelle Protection', () => {
  it('devrait protéger contre X', async () => {
    const response = await request(server)
      .post('/endpoint')
      .send({ maliciousData: '...' });

    expect(response.status).toBe(400); // ou le code d'erreur attendu
  });
});
```
