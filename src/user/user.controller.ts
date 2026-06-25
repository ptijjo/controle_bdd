import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '../common/dto/user-response.dto';
import {
  toUserResponseDto,
  toUserResponseDtoList,
} from '../common/serialize-user';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../generated/prisma/client.js';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.controleur, Role.chef_service)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des utilisateurs' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  async getAllUser() {
    const users = await this.userService.getAllUser();
    return toUserResponseDtoList(users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail utilisateur' })
  @ApiParam({ name: 'id', description: 'Identifiant utilisateur (cuid)' })
  @ApiOkResponse({ type: UserResponseDto })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    return toUserResponseDto(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mise à jour utilisateur' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.updateUser(id, dto);
    return toUserResponseDto(user);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id' })
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}
