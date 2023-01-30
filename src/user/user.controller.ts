import {
  Request,
  Controller,
  Get,
  Body,
  Param,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { DonateDto } from './dto/donate.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') _id: string): Promise<User> {
    return this.userService.findById(_id);
  }

  @Get()
  async getUsers() {
    return this.userService.findAll();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('donate')
  async buyDonate(@Request() req, @Body() dto: DonateDto): Promise<User> {
    return this.userService.buyDonate(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  async changePassword(@Request() req, @Body() { newPassword }) {
    return this.userService.changePassword(req.user.id, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateAvatar(
    @Param('id') userId: string,
    @Body() { avatarUrl }: { avatarUrl: string },
  ) {
    return this.userService.updateAvatar(userId, avatarUrl);
  }
}
