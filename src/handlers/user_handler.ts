import { NextFunction, Request, Response } from "express";
import { SignupInput } from "../models/user_models";
import { UserUsecase } from "../usecases/user_usecase";
import { responseSuccess } from "../utils/wrapper";

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
}

export default UserHandler;