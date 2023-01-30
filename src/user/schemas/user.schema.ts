import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

class Donate {
  name?: string;
  buyDate?: Date;
}

@Schema()
export class User {
  @Prop()
  userId: string;

  @Prop()
  login: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  balance: number;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  donate: Donate;
}

export const UserSchema = SchemaFactory.createForClass(User);
