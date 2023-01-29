import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.repository.create({
      userId: uuidv4(),
      login: dto.login,
      avatarUrl: '',
      email: dto.email,
      password: dto.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll() {
    return this.repository.find({});
  }

  async changePassword(userId: string, newPassword: string) {
    return await this.repository.changePassword(userId, newPassword);
  }

  async findById(_id: string): Promise<User> {
    return this.repository.findOne(_id);
  }

  async findByCond(cond: LoginUserDto): Promise<User> {
    return this.repository.findOneBy(cond);
  }

  async update(_id: string, dto: UpdateUserDto): Promise<User> {
    const result = await this.repository.findOneAndUpdate(_id, dto);

    return result;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return await this.repository.updateAvatar(userId, avatarUrl);
  }
}
