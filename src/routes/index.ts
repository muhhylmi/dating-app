import { Router } from "express";
import UserHandler from "../handlers/user_handler";
import { UserUsecase } from "../usecases/user_usecase";
import TUserRepo from "../repositories/type_user_repo";
import { UserRepo } from "../repositories/user_repo";
import prisma from "../utils/prisma";
import { validate } from "../utils/validation";
import { loginSchema, signupSchema } from "../models/user_models";
import { basicAuthMiddleware, jwtAuthMiddleware } from "../utils/middlewares";
import { TSwipeRepo } from "../repositories/type_swipe_repo";
import { SwipeRepo } from "../repositories/swipe_repo";
import { TPremiumRepo } from "../repositories/type_premium_repo";
import { PremiumRepo } from "../repositories/premium_repo";
import { swipeSchema } from "../models/swipe_models";

const router = Router();
const userRepo: TUserRepo = new UserRepo(prisma);
const swipeRepo: TSwipeRepo = new SwipeRepo(prisma);
const premiumRepo: TPremiumRepo = new PremiumRepo(prisma);
const userUsecase: UserUsecase = new UserUsecase(userRepo, swipeRepo, premiumRepo);
const handler = new UserHandler(userUsecase);

router.post('/api/signup',
  (req, res, next) => basicAuthMiddleware(req, res, next),
  validate(signupSchema),
  (req, res, next) => handler.signup(req, res, next)
);
router.post('/api/login',
  (req, res, next) => basicAuthMiddleware(req, res, next),
  validate(loginSchema),
  (req, res, next) => handler.login(req, res, next)
);
router.post('/api/swipe',
  (req, res, next) => jwtAuthMiddleware(req, res, next, userRepo),
  validate(swipeSchema),
  (req, res, next) => handler.swipe(req, res, next)
);
router.post('/api/purchase-premium',
  (req, res, next) => jwtAuthMiddleware(req, res, next, userRepo),
  (req, res, next) => handler.purchasePremium(req, res, next)
);

export default router;