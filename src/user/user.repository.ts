import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { DonateDto } from './dto/donate.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string): Promise<User> {
    const users = await this.userModel.find().exec();
    const userId = await users.find((user) => user.userId === id)?._id;

    const result = await this.userModel
      .findOne(userId)
      .populate('followers', '', this.userModel)
      .exec();

    return result;
  }

  async changePassword(userId: string, newPassword: string): Promise<User[]> {
    return await this.userModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          password: newPassword,
        },
      },
    );
  }

  async findUserById(id: string): Promise<User[]> {
    return await this.userModel.find({ userId: id });
  }

  async find(usersFilterQuery: FilterQuery<User>): Promise<User[]> {
    return await this.userModel
      .find(usersFilterQuery)
      .populate('followers', '', this.userModel)
      .exec();
  }

  async buyDonate(dto: DonateDto, userId: string): Promise<User> {
    const donates = { VIP: 200, PREMIUM: 300, MASTER: 450, CHAOTIC: 550 };

    const user = await this.userModel.findOne({ userId });

    return await this.userModel.findOneAndUpdate({
      userId,
      $set: {
        donate: {
          name: dto.name,
          buyDate: Date.now(),
          serverName: dto.serverName,
        },
        balance: user.balance - donates[dto.name],
      },
    });
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);

    return await newUser.save();
  }

  async findOneBy(cond: LoginUserDto): Promise<User> {
    return await this.userModel.findOne(cond);
  }

  async findOneAndUpdate(_id: string, dto: UpdateUserDto): Promise<User> {
    const users = await this.userModel.find();
    const result = await this.userModel.findByIdAndUpdate(
      users.find((user) => user.userId === _id)._id,
      dto,
    );

    return result;
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    return await this.userModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          avatarUrl: avatarUrl,
        },
      },
    );
  }
}
