import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({ example: 'nouveau@example.com' })
  @IsEmail()
  public email!: string;
}
