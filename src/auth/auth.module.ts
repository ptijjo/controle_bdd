import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { BcryptService } from '../utils/bcrpt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UserModule),
    MailModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('ACCESS_TOKEN_SECRET');
        const expiresRaw =
          config.get<string>('ACCESS_TOKEN_EXPIRES_SEC') ?? '900';
        const expiresIn = Number(expiresRaw);
        return {
          secret,
          signOptions: {
            expiresIn: Number.isFinite(expiresIn) ? expiresIn : 900,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    BcryptService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, BcryptService, RolesGuard],
})
export class AuthModule {}
