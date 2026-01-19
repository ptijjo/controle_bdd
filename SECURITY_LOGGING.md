# Système de Logging Structuré des Actions Sensibles

Ce document décrit le système de logging structuré implémenté pour tracer toutes les actions sensibles de l'application.

## Vue d'Ensemble

Le système de logging utilise Winston avec un format JSON structuré pour faciliter l'analyse et le monitoring. Toutes les actions sensibles sont automatiquement loggées avec des métadonnées complètes.

## Actions Loggées

### Authentification
- `LOGIN_SUCCESS` : Connexion réussie
- `LOGIN_FAILED` : Tentative de connexion échouée
- `LOGOUT` : Déconnexion
- `SIGNUP` : Création de compte

### Gestion des Utilisateurs
- `USER_CREATED` : Création d'utilisateur
- `USER_UPDATED` : Modification d'utilisateur
- `USER_DELETED` : Suppression d'utilisateur (critique)
- `USER_INVITED` : Invitation d'utilisateur
- `USER_ROLE_CHANGED` : Changement de rôle (critique)

### Formulaires
- `FORM_CREATED` : Création de formulaire
- `FILE_DOWNLOADED` : Téléchargement de fichier Excel

### Événements de Sécurité
- `IP_BLOCKED` : Blocage d'IP (critique)
- `ACCOUNT_LOCKED` : Verrouillage de compte (critique)
- `RATE_LIMIT_EXCEEDED` : Dépassement de rate limit
- `UNAUTHORIZED_ACCESS` : Tentative d'accès non autorisé
- `INVALID_TOKEN` : Token invalide ou expiré

## Format des Logs

Les logs sont enregistrés au format JSON pour faciliter l'analyse :

```json
{
  "type": "SECURITY",
  "action": "USER_DELETED",
  "userId": "clx1234567890",
  "userEmail": "admin@example.com",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "details": {
    "targetUserId": "clx0987654321",
    "targetUserEmail": "deleted@example.com",
    "deletedUserRole": "agent",
    "actorRole": "chef_service"
  },
  "timestamp": "2026-01-19T10:30:00.000Z"
}
```

## Utilisation

### Dans les Controllers

```typescript
import { securityLogger, SecurityAction } from '@/utils/securityLogger';

// Log d'une action utilisateur
securityLogger.logUserAction(
  SecurityAction.USER_DELETED,
  req.user, // Utilisateur qui effectue l'action
  targetUserId, // ID de l'utilisateur cible
  targetUserEmail, // Email de l'utilisateur cible
  req.ip, // Adresse IP
  { additionalDetails: '...' } // Détails supplémentaires
);
```

### Dans les Services

```typescript
// Log d'un événement de sécurité critique
securityLogger.logSecurityEvent(
  SecurityAction.IP_BLOCKED,
  ipAddress,
  { failedAttempts: 3, blockedUntil: new Date() }
);
```

## Fichiers de Logs

Les logs sont enregistrés dans :
- `src/logs/debug/` : Logs de debug et info
- `src/logs/error/` : Logs d'erreur et événements critiques

Les fichiers sont organisés par date avec rotation automatique (30 jours de rétention).

## Analyse des Logs

### Recherche d'actions spécifiques

```bash
# Rechercher toutes les suppressions d'utilisateurs
grep "USER_DELETED" src/logs/debug/*.log

# Rechercher les tentatives d'accès non autorisé
grep "UNAUTHORIZED_ACCESS" src/logs/error/*.log

# Rechercher les blocages d'IP
grep "IP_BLOCKED" src/logs/error/*.log
```

### Analyse avec jq (si disponible)

```bash
# Extraire toutes les actions d'un utilisateur spécifique
cat src/logs/debug/*.log | jq 'select(.userEmail == "admin@example.com")'

# Compter les tentatives de connexion échouées
cat src/logs/debug/*.log | jq 'select(.action == "LOGIN_FAILED")' | wc -l
```

## Monitoring Recommandé

Pour un monitoring efficace, il est recommandé de :

1. **Centraliser les logs** : Utiliser un système comme ELK Stack, Splunk, ou CloudWatch
2. **Alertes** : Configurer des alertes pour les événements critiques :
   - `USER_DELETED`
   - `IP_BLOCKED`
   - `ACCOUNT_LOCKED`
   - `RATE_LIMIT_EXCEEDED` (si fréquent)
3. **Tableaux de bord** : Créer des visualisations pour :
   - Nombre de connexions par jour
   - Tentatives d'accès non autorisé
   - Actions administratives
   - Événements de sécurité

## Sécurité des Logs

⚠️ **Important** : Les logs peuvent contenir des informations sensibles. Assurez-vous de :
- Ne pas logger les mots de passe
- Ne pas logger les tokens complets (seulement les IDs)
- Chiffrer les logs en transit et au repos si nécessaire
- Limiter l'accès aux fichiers de logs

## Exemples de Requêtes d'Analyse

### Trouver toutes les actions d'un utilisateur dans les dernières 24h

```bash
grep -h "admin@example.com" src/logs/debug/*.log | \
  jq 'select(.timestamp > "2026-01-18T00:00:00Z")'
```

### Identifier les IPs suspectes

```bash
grep "LOGIN_FAILED\|UNAUTHORIZED_ACCESS\|INVALID_TOKEN" src/logs/debug/*.log | \
  jq -r '.ipAddress' | sort | uniq -c | sort -rn
```

### Audit des suppressions d'utilisateurs

```bash
grep "USER_DELETED" src/logs/debug/*.log | \
  jq '{timestamp, actor: .userEmail, target: .details.targetUserEmail}'
```
