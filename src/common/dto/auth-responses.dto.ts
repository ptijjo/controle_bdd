import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto.js';

export class AuthTokensResponseDto {
  @ApiProperty({ description: 'JWT d’accès (header Authorization: Bearer)' })
  access_token!: string;

  @ApiProperty({
    description:
      'JWT de rafraîchissement (corps mobile ; cookie httpOnly `refresh_token` côté web)',
  })
  refresh_token!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}

class InvitationEmailDataDto {
  @ApiProperty({ example: 'nouveau@example.com' })
  email!: string;
}

export class InvitationVerifyResponseDto {
  @ApiProperty({ type: InvitationEmailDataDto })
  data!: InvitationEmailDataDto;
}
