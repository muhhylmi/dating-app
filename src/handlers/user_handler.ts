import { NextFunction, Request, Response } from "express";
import { LoginInput, SignupInput, UserModel } from "../models/user_models";
import { UserUsecase } from "../usecases/user_usecase";
import { responseSuccess } from "../utils/wrapper";
import { SwipeInput } from "../models/swipe_models";
import { PremiumModel } from "../models/premium_models";

class UserHandler {
  private readonly userUsecase: UserUsecase;
  constructor(useCase: UserUsecase){
    this.userUsecase = useCase;
  }  
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SignupInput = {
        name: req.body.name,
        gender: req.body.gender,
        email: req.body.email,
        birthDate: req.body.birthDate,
        password: req.body.password
      };
      const result = await this.userUsecase.signup(request);
      responseSuccess(res, 201, "Horray request successfully created", result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginInput = {
        email: req.body.email,
        password: req.body.password
      };
      const result = await this.userUsecase.login(request);
      responseSuccess(res, 200, "Horray request successfully created", result);
    } catch (error) {
      next(error);
    }
  }

  async swipeList(req: Request, res: Response, next: NextFunction) {
    try {
      const { users } = req.body;
      const request: UserModel = {
        id: users.id,
        email: users.email,
        name: users.name,
        birthDate: users.birthDate,
        gender: users.gender
      };
      const result = await this.userUsecase.swipeList(request);
      responseSuccess(res, 200, "Horray request successfully created", result);
    } catch (error) {
      next(error);
    }
  }

  async swipe(req: Request, res: Response, next: NextFunction) {
    try {
      const request: SwipeInput = {
        status: req.body.status,
        swipedUserId: req.body.swipedUserId,
        swiperId: req.body.users.id
      };
      const result = await this.userUsecase.swipe(request);
      responseSuccess(res, 201, "Horray request successfully created", result);
    } catch (error) {
      next(error);
    }
  }

  async purchasePremium(req: Request, res: Response, next: NextFunction) {
    try {
      const request: PremiumModel = {
        hasNoSwipeLimit: true,
        userId: req.body.users.id
      };
      const result = await this.userUsecase.purchasePremium(request);
      responseSuccess(res, 201, "Horray request successfully created", result);
    } catch (error) {
      next(error);
    }
  }}

export default UserHandler;