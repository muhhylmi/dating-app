import { LoginInput, SignupInput, UserResponse } from "../models/user_models";
import TUserRepo from "../repositories/type_user_repo";
import bcrypt from 'bcrypt';
import { HttpException } from "../utils/exception";
import jwt from 'jsonwebtoken';
import config from "../infra/config";

export class UserUsecase {
  private readonly repository: TUserRepo;
  constructor(repository: TUserRepo){
    this.repository = repository;
  }

  async signup(user: SignupInput): Promise<UserResponse> {
    const existsUser = await this.repository.findOne({
      email: user.email
    });
    if (existsUser) {
      throw new HttpException(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await this.repository.create(user);
    if (newUser) {
      delete newUser.password;
    }

    return newUser;
  }

  async login (req: LoginInput): Promise<object> {
    try {
      const user = await this.repository.findOne({
        email: req.email
      });

      if (!user || !user.password) {
        throw new HttpException(400, "Credential is not valid");
      }
    
      const passwordValid = await bcrypt.compare(req.password, user.password);
      if (!passwordValid) {
        throw new HttpException(400, "Credential is not valid");
      }
            
      const token = jwt.sign({
        username: user.name,
        userId: user.id,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate
      }, config.JWTPRIVATEKEY, { expiresIn: '1h'});
    
      return {
        accessToken: token,
        username: user.name,
        userId: user.id,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate
      };   
    } catch (error) {
      throw new HttpException(400, "Something error: " + error);
    }
        
        
  }
}
