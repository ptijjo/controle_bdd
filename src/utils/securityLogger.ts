import { logger } from './logger';
import { User } from '@interfaces/users.interface';

export enum SecurityAction {
  // Authentification
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  SIGNUP = 'SIGNUP',
  
  // Utilisateurs
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_INVITED = 'USER_INVITED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  
  // Formulaires
  FORM_CREATED = 'FORM_CREATED',
  FILE_DOWNLOADED = 'FILE_DOWNLOADED',
  
  // Sécurité
  IP_BLOCKED = 'IP_BLOCKED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  INVALID_TOKEN = 'INVALID_TOKEN',
}

export interface SecurityLogData {
  action: SecurityAction;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  timestamp?: Date;
}

class SecurityLogger {
  /**
   * Log une action de sécurité avec un format structuré
   */
  public log(data: SecurityLogData): void {
    const logEntry = {
      type: 'SECURITY',
      action: data.action,
      userId: data.userId,
      userEmail: data.userEmail,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      details: data.details || {},
      timestamp: data.timestamp || new Date().toISOString(),
    };

    // Log au format JSON pour faciliter l'analyse
    logger.info(JSON.stringify(logEntry));

    // Log aussi au format lisible pour la console
    logger.info(`[SECURITY] ${data.action} - User: ${data.userEmail || data.userId || 'N/A'} - IP: ${data.ipAddress || 'N/A'}`);
  }

  /**
   * Log une action critique (erreur, blocage, etc.)
   */
  public logCritical(data: SecurityLogData): void {
    const logEntry = {
      type: 'SECURITY_CRITICAL',
      action: data.action,
      userId: data.userId,
      userEmail: data.userEmail,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      details: data.details || {},
      timestamp: data.timestamp || new Date().toISOString(),
    };

    logger.error(JSON.stringify(logEntry));
    logger.error(`[SECURITY_CRITICAL] ${data.action} - User: ${data.userEmail || data.userId || 'N/A'} - IP: ${data.ipAddress || 'N/A'}`);
  }

  /**
   * Log une action d'authentification
   */
  public logAuth(action: SecurityAction, email: string, ipAddress: string, success: boolean, details?: Record<string, any>): void {
    this.log({
      action,
      userEmail: email,
      ipAddress,
      details: {
        success,
        ...details,
      },
    });
  }

  /**
   * Log une action utilisateur (création, modification, suppression)
   */
  public logUserAction(
    action: SecurityAction,
    actor: User,
    targetUserId?: string,
    targetUserEmail?: string,
    ipAddress?: string,
    details?: Record<string, any>
  ): void {
    this.log({
      action,
      userId: actor.id,
      userEmail: actor.email,
      ipAddress,
      details: {
        actorRole: actor.role,
        targetUserId,
        targetUserEmail,
        ...details,
      },
    });
  }

  /**
   * Log une action de formulaire
   */
  public logFormAction(action: SecurityAction, user: User, ipAddress?: string, details?: Record<string, any>): void {
    this.log({
      action,
      userId: user.id,
      userEmail: user.email,
      ipAddress,
      details: {
        userName: `${user.nom} ${user.prenom}`,
        ...details,
      },
    });
  }

  /**
   * Log un événement de sécurité critique
   */
  public logSecurityEvent(action: SecurityAction, ipAddress?: string, details?: Record<string, any>): void {
    this.logCritical({
      action,
      ipAddress,
      details,
    });
  }
}

export const securityLogger = new SecurityLogger();
