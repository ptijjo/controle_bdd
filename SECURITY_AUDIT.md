# Audit de Sécurité et Robustesse
## Application de Contrôle - Rapport d'Analyse

**Date:** 19 janvier 2026  
**Contexte:** Application interne, max 10 utilisateurs, téléchargement Excel uniquement

---

## 🔴 FAILLES CRITIQUES

### 1. Routes Non Protégées - Accès Public aux Données Utilisateurs
**Fichier:** `src/routes/users.route.ts` (lignes 19, 22)

**Problème:**
```typescript
this.router.get(`${this.path}`,/*AuthMiddleware,RoleGuard(["chef_service"]), */this.user.getUsers);
this.router.post(`${this.path}`, /* AuthMiddleware, RoleGuard(["chef_service","controleur"]), */ this.user.inviteUser);
```

**Impact:** 
- N'importe qui peut lister tous les utilisateurs (GET /users)
- N'importe qui peut inviter de nouveaux utilisateurs (POST /users)
- Exposition des emails, noms, prénoms de tous les utilisateurs

**Recommandation:** Décommenter immédiatement les middlewares d'authentification et de rôle.

---

### 2. Validation Incomplète dans FormController
**Fichier:** `src/controllers/forms.controller.ts` (lignes 26-29)

**Problème:**
```typescript
const errors = await validate(formData);
if (errors.length > 0) {
  res.status(400).json({ message: 'Validation failed', errors });
}
// ❌ Pas de return, le code continue même si la validation échoue !
```

**Impact:** Les données non validées peuvent être traitées et sauvegardées.

**Recommandation:** Ajouter `return` après l'envoi de l'erreur.

---

### 3. Exposition d'Informations Sensibles dans les Erreurs
**Fichier:** `src/services/token.service.ts` (ligne 16)

**Problème:**
```typescript
catch (error) {
  throw new HttpException(400, error); // ❌ Expose l'erreur brute
}
```

**Impact:** Peut révéler des détails sur la structure interne, les secrets, etc.

**Recommandation:** Utiliser un message générique : `"Token d'invitation invalide ou expiré"`

---

### 4. Path Traversal Potentiel
**Fichier:** `src/services/file.service.ts` (ligne 16)

**Problème:**
```typescript
const filePath = path.join(process.cwd(), 'controle', filename);
// ❌ Pas de validation que le fichier est bien dans le répertoire autorisé
```

**Impact:** Si `filename` peut être contrôlé par l'utilisateur, accès à d'autres fichiers.

**Recommandation:** Valider que le chemin résolu est bien dans le répertoire autorisé.

---

## 🟠 FAILLES IMPORTANTES

### 5. Rate Limiting Insuffisant
**Fichier:** `src/routes/users.route.ts`, `src/routes/forms.route.ts`

**Problème:**
- Rate limiting uniquement sur `/login` et `/signup`
- Pas de protection sur les autres endpoints sensibles

**Impact:** 
- Attaques par force brute sur les endpoints utilisateurs
- DoS sur le téléchargement de fichiers
- Spam d'invitations

**Recommandation:** Ajouter rate limiting sur tous les endpoints publics et authentifiés.

---

### 6. Gestion de l'IP - Risque de Spoofing
**Fichier:** `src/controllers/auth.controller.ts` (ligne 40)

**Problème:**
```typescript
const ipAddress = String(req.ip || 'unknown');
```

**Impact:** Si l'application est derrière un proxy, `req.ip` peut être falsifié.

**Recommandation:** Utiliser `req.headers['x-forwarded-for']` ou configurer Express avec `trust proxy`.

---

### 7. Validation des Signatures Base64
**Fichier:** `src/controllers/forms.controller.ts` (ligne 38)

**Problème:**
```typescript
if (!formData.controllerSignature || !formData.chauffeurSignature) {
  // ❌ Vérifie seulement la présence, pas le format ni la taille
}
```

**Impact:**
- Injection de données malformées
- Attaques DoS avec de très grandes chaînes base64
- Pas de validation que c'est une image valide

**Recommandation:** 
- Valider le format base64
- Limiter la taille (max 500KB par exemple)
- Optionnellement, valider que c'est une image valide

---

### 8. Pas de Protection CSRF
**Fichier:** `src/app.ts`

**Problème:** 
- Cookies avec `SameSite=None; Secure` mais pas de protection CSRF
- Pas de token CSRF sur les requêtes POST/PUT/DELETE

**Impact:** Attaques CSRF possibles si un utilisateur authentifié visite un site malveillant.

**Recommandation:** Ajouter un middleware CSRF ou utiliser `SameSite=Strict` si possible.

---

### 9. CORS Potentiellement Trop Permissif
**Fichier:** `src/app.ts` (ligne 50)

**Problème:**
```typescript
this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS, ... }));
```

**Impact:** Si `ORIGIN` est `*` ou trop large, permet les requêtes depuis n'importe quel domaine.

**Recommandation:** Vérifier que `ORIGIN` est bien restreint à votre frontend uniquement.

---

### 10. Pas de Validation de Taille pour les Données Excel
**Fichier:** `src/utils/saveToExcel.ts`

**Problème:** 
- Pas de limite sur le nombre de lignes
- Pas de validation de la taille du fichier Excel

**Impact:** 
- DoS en créant un fichier Excel énorme
- Consommation excessive de mémoire/disque

**Recommandation:** Ajouter des limites (max 10000 lignes, max 50MB par exemple).

---

## 🟡 AMÉLIORATIONS DE ROBUSTESSE

### 11. Gestion d'Erreur dans getConnected
**Fichier:** `src/controllers/users.controller.ts` (lignes 35-42)

**Problème:**
```typescript
if (!req.user) {
  res.status(401).json({message:"Non authetifié"}) // ❌ Pas de return
}
// Code continue même si pas authentifié
```

**Recommandation:** Ajouter `return` après l'envoi de l'erreur.

---

### 12. Validation Middleware - Whitelist Désactivée
**Fichier:** `src/middlewares/validation.middleware.ts` (ligne 14)

**Problème:**
```typescript
whitelist = false, forbidNonWhitelisted = false
```

**Impact:** Les propriétés supplémentaires non définies dans le DTO sont acceptées.

**Recommandation:** Activer `whitelist: true` pour rejeter les propriétés inconnues.

---

### 13. Pas de Logging des Actions Sensibles
**Fichier:** Tous les controllers

**Problème:** 
- Pas de logs pour les suppressions d'utilisateurs
- Pas de logs pour les modifications de rôles
- Pas de logs pour les téléchargements de fichiers

**Recommandation:** Ajouter un logging structuré pour toutes les actions sensibles.

---

### 14. Pas de Validation de l'ID dans les Routes
**Fichier:** `src/controllers/users.controller.ts` (lignes 24-33, 63-73, 75-84)

**Problème:**
```typescript
const userId = String(req.params.id);
// ❌ Pas de validation du format (doit être un cuid)
```

**Impact:** Requêtes inutiles à la base de données avec des IDs invalides.

**Recommandation:** Valider le format de l'ID avant la requête DB.

---

### 15. Gestion des Concurrences sur le Fichier Excel
**Fichier:** `src/utils/saveToExcel.ts`

**Problème:**
- Pas de verrouillage lors de l'écriture simultanée
- Risque de corruption si deux utilisateurs sauvegardent en même temps

**Recommandation:** 
- Utiliser un système de file d'attente
- Ou utiliser un verrou de fichier
- Ou migrer vers une base de données pour les données

---

### 16. Pas de Timeout sur les Requêtes
**Fichier:** `src/app.ts`

**Problème:** Pas de timeout configuré sur Express.

**Impact:** Requêtes qui peuvent bloquer indéfiniment.

**Recommandation:** Ajouter un timeout global (30-60 secondes).

---

### 17. Pas de Validation de l'Email dans l'Invitation
**Fichier:** `src/services/users.service.ts` (ligne 28)

**Problème:**
```typescript
const findUser: User = await this.user.findUnique({ where: { email: invitationData.email } });
// ❌ Vérifie seulement l'existence, pas si l'email est déjà invité récemment
```

**Impact:** Spam d'invitations au même email.

**Recommandation:** Ajouter un délai minimum entre deux invitations au même email.

---

### 18. Cookie Secure - Dépend de HTTPS
**Fichier:** `src/services/auth.service.ts` (ligne 100)

**Problème:**
```typescript
return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};SameSite=None; Secure`;
```

**Impact:** Si l'application n'est pas en HTTPS, le cookie `Secure` ne fonctionnera pas.

**Recommandation:** Vérifier que l'application est bien servie en HTTPS en production.

---

## ✅ POINTS POSITIFS

1. ✅ Utilisation de Prisma (protection contre SQL injection)
2. ✅ Hashage des mots de passe avec bcrypt (10 rounds)
3. ✅ Validation des entrées avec class-validator
4. ✅ Protection contre les attaques par force brute (lock account, IP blocking)
5. ✅ Utilisation de Helmet pour les headers de sécurité
6. ✅ Rate limiting sur l'authentification
7. ✅ JWT avec expiration
8. ✅ HttpOnly cookies
9. ✅ Validation des rôles avec RoleGuard

---

## 📋 PLAN D'ACTION PRIORITAIRE

### Priorité 1 (Immédiat)
1. ✅ Décommenter les middlewares d'authentification sur `/users`
2. ✅ Corriger la validation dans `FormController` (ajouter return)
3. ✅ Sécuriser la gestion d'erreur dans `TokenService`
4. ✅ Ajouter return dans `getConnected`

### Priorité 2 (Cette semaine)
5. ✅ Ajouter rate limiting sur tous les endpoints
6. ✅ Valider les signatures base64 (format + taille)
7. ✅ Corriger la gestion de l'IP (trust proxy)
8. ✅ Activer whitelist dans ValidationMiddleware

### Priorité 3 (Ce mois)
9. ✅ Ajouter protection CSRF ou SameSite=Strict
10. ✅ Ajouter logging des actions sensibles
11. ✅ Valider les IDs avant les requêtes DB
12. ✅ Ajouter timeout sur Express
13. ✅ Gérer les concurrences sur le fichier Excel

---

## 🔒 RECOMMANDATIONS GÉNÉRALES

1. **Environnement:** S'assurer que tous les secrets sont dans `.env` et jamais commités
2. **HTTPS:** Forcer HTTPS en production
3. **Monitoring:** Ajouter un système de monitoring pour détecter les anomalies
4. **Backup:** Mettre en place des backups réguliers de la base SQLite
5. **Tests:** Ajouter des tests de sécurité (injection, XSS, CSRF, etc.)
6. **Documentation:** Documenter les procédures de sécurité et d'incident

---

**Note:** Étant donné le contexte (application interne, 10 utilisateurs max), certaines failles sont moins critiques mais doivent quand même être corrigées pour une meilleure robustesse.
