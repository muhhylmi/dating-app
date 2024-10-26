import { Router } from "express";
import UserHandler from "../handlers/user_handler";
import { UserUsecase } from "../usecases/user_usecase";
import TUserRepo from "../repositories/type_user_repo";
import { UserRepo } from "../repositories/user_repo";
import prisma from "../utils/prisma";

const router = Router();
const userRepo: TUserRepo = new UserRepo(prisma);
const userUsecase: UserUsecase = new UserUsecase(userRepo);
const handler = new UserHandler(userUsecase);

router.post('/api/signup', 
  (req, res, next) => handler.signup(req, res, next)
);

export default router;