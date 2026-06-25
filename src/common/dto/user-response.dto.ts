import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role } from '../../generated/prisma/client.js';

/** Profil utilisateur exposé par l’API (sans secrets ni métadonnées de verrouillage). */
export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: 'clxyz123' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'agent@example.com' })
  email!: string;

  @Expose()
  @ApiProperty({ example: 'Dupont' })
  nom!: string;

  @Expose()
  @ApiProperty({ example: 'Jean' })
  prenom!: string;

  @Expose()
  @ApiProperty({ enum: Role, example: Role.agent })
  role!: Role;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @Expose()
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
