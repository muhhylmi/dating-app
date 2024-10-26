import { PrismaClient } from "@prisma/client";
import { UserModel } from "../models/user_models";
import TUserRepo from "./type_user_repo";

export class UserRepo implements TUserRepo {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient){
    this.prisma = prisma;
  }

  async create(user: UserModel): Promise<UserModel> {
    await this.prisma.user.create({
      data: {
        name: user.name,
        gender: user.gender,
        email: user.email,
        password: user.password,
        birthdate: user.birthDate
      }
    });
    return user;
  }
}