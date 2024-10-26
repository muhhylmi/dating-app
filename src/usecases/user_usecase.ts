import { LoginInput, SignupInput, UserResponse } from "../models/user_models";
import TUserRepo from "../repositories/type_user_repo";
import bcrypt from 'bcrypt';
import { HttpException } from "../utils/exception";
import jwt from 'jsonwebtoken';
import config from "../infra/config";
import { SwipeInput, SwipeResponse } from "../models/swipe_models";
import { TSwipeRepo } from "../repositories/type_swipe_repo";
import { TPremiumRepo } from "../repositories/type_premium_repo";

export class UserUsecase {
  private readonly repository: TUserRepo;
  private readonly swipeRepo: TSwipeRepo;
  private readonly premiumRepo: TPremiumRepo;

  constructor(repository: TUserRepo, swipeRepo: TSwipeRepo, premiumRepo: TPremiumRepo){
    this.repository = repository;
    this.swipeRepo = swipeRepo;
    this.premiumRepo = premiumRepo;
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
        name: user.name,
        userId: user.id,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate
      }, config.JWTPRIVATEKEY, { expiresIn: '1h'});
    
      return {
        accessToken: token,
        name: user.name,
        userId: user.id,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate
      };   
    } catch (error) {
      throw new HttpException(400, "Something error: " + error);
    }     
  }

  async swipe(req: SwipeInput): Promise<SwipeResponse> {
    const existingSwipe = await this.swipeRepo.findOne({
      swiperId: req.swiperId,
      swipedUserId: req.swipedUserId,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      },
    });
  
    if (existingSwipe) {
      throw new HttpException(403, 'You have already swiped on this profile today');
    }

    const swipesToday = await this.swipeRepo.count({
      swiperId: req.swiperId,
      createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    const userPremium = await this.premiumRepo.findOne({ userId: req.swiperId } );

    if (swipesToday >= 10 && !userPremium?.hasNoSwipeLimit) {
      throw new HttpException(403, 'Swipe limit reached');
    }

    const swipe = await this.swipeRepo.create({
      status: req.status,
      swiperId: req.swiperId,
      swipedUserId: req.swipedUserId
    });

    return swipe;
  }
}
