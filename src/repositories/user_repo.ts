import { PrismaClient } from "@prisma/client";
import { UserModel, UserResponse } from "../models/user_models";
import TUserRepo from "./type_user_repo";
import { TDatabases } from "../infra/databases";

export class UserRepo implements TUserRepo {
  private readonly prisma: PrismaClient;
  constructor(db: TDatabases){
    this.prisma = db.getSqlClient();
  }

  async create(user: UserModel): Promise<UserResponse> {
    const newUser = await this.prisma.user.create({
      data: {
        name: user.name,
        gender: user.gender,
        email: user.email,
        birthdate: user.birthDate,
        password: user.password || "default"
      }
    });
    user.id = newUser.id;
    return user;
  }

  async findOne(query: object): Promise<UserResponse> {
    const user = await this.prisma.user.findFirst({
      where: { isDeleted: false, ...query }
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.email,
      gender: user.gender,
      birthDate: user.birthdate,
      password: user.password
    };
  }

  async findMany(query: object): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      where: { isDeleted: false, ...query }
    });
    return users.map(user => {
      return {
        id: user.id,
        email: user.email,
        name: user.email,
        gender: user.gender,
        birthDate: user.birthdate
      };
    });
  }

  async updateOne(id: number, data: object): Promise<UserResponse> {
    const user = await this.prisma.user.update({
      where: { id }, data
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      name: user.email,
      gender: user.gender,
      birthDate: user.birthdate,
      password: user.password
    };
  }

  async updateMany(query: object, data: object): Promise<number> {
    const users = await this.prisma.user.updateMany({
      where: { isDeleted: false, ...query }, data
    });
    return users.count;
  }
}