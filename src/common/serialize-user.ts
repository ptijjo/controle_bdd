import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto.js';

const serializeOptions = {
  excludeExtraneousValues: true,
  enableImplicitConversion: true,
} as const;

/** Sérialise un utilisateur (entité ou profil auth) sans champs sensibles. */
export function toUserResponseDto(source: object): UserResponseDto {
  return plainToInstance(UserResponseDto, source, serializeOptions);
}

export function toUserResponseDtoList(sources: object[]): UserResponseDto[] {
  return sources.map((item) => toUserResponseDto(item));
}
