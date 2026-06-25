import { SetMetadata } from '@nestjs/common';
import { Role } from '../../generated/prisma/client.js';

export const ROLES_KEY = 'roles';

/** Rôles Prisma autorisés sur la route (au moins un doit correspondre à `req.user.role`). */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
