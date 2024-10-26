import { UserModel } from "../models/user_models";
import TUserRepo from "../repositories/type_user_repo";
import bcrypt from 'bcrypt';

export class UserUsecase {
  private readonly repository: TUserRepo;
  constructor(repository: TUserRepo){
    this.repository = repository;
  }

  async signup(user: UserModel): Promise<UserModel> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    return await this.repository.create(user);
  }
}
