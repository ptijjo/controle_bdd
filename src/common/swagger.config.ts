import { type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwaggerIfDevelopment(app: INestApplication): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const port = process.env.PORT ?? '8585';
  const config = new DocumentBuilder()
    .setTitle('Contrôle Transdev — API')
    .setDescription(
      [
        'API NestJS pour la saisie des contrôles, l’authentification JWT et la gestion des utilisateurs.',
        '',
        '**Authentification**',
        '- `POST /auth/login` : access token (Bearer) + refresh (cookie httpOnly sur `/auth` ou corps `refresh_token`).',
        '- `POST /auth/refresh` : renouvellement des jetons.',
        '- `GET /auth/me` : profil de l’utilisateur connecté.',
        '',
        '**Rôles** : `controleur`, `chef_service`, `agent`. Certaines routes exigent un rôle élevé.',
        '',
        '**Rate limiting** : limite globale configurable via `THROTTLE_LIMIT` / `THROTTLE_TTL_MS`.',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Développement local')
    .addTag('auth', 'Connexion, jetons, invitations, inscription')
    .addTag('users', 'Gestion des comptes (contrôleur / chef de service)')
    .addTag('formulaire', 'Formulaires de contrôle et export Excel')
    .addTag('health', 'Santé de l’API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Jeton d’accès obtenu via POST /auth/login',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
