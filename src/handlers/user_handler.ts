import { Request, Response } from "express";
import { UserModel } from "../models/user_models";
import { UserUsecase } from "../usecases/user_usecase";

class UserHandler {
  private readonly userUsecase: UserUsecase;
  constructor(useCase: UserUsecase){
    this.userUsecase = useCase;
  }  
  async signup(req: Request, res: Response) {
    const request: UserModel = {
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      birthDate: req.body.birthDate,
      password: req.body.password
    };
    const result = await this.userUsecase.signup(request);
    
    res.status(201).json(result);
  }
}

export default UserHandler;