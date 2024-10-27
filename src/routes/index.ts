import { Router } from "express";
import UserHandler from "../handlers/user_handler";
import { UserUsecase } from "../usecases/user_usecase";
import TUserRepo from "../repositories/type_user_repo";
import { UserRepo } from "../repositories/user_repo";
import { validate } from "../utils/validation";
import { loginSchema, signupSchema } from "../models/user_models";
import { basicAuthMiddleware, jwtAuthMiddleware } from "../utils/middlewares";
import { TSwipeRepo } from "../repositories/type_swipe_repo";
import { SwipeRepo } from "../repositories/swipe_repo";
import { TPremiumRepo } from "../repositories/type_premium_repo";
import { PremiumRepo } from "../repositories/premium_repo";
import { swipeSchema } from "../models/swipe_models";
import {Databases, TDatabases} from "../infra/databases";

const router = Router();
const db:TDatabases = new Databases();
const userRepo: TUserRepo = new UserRepo(db);
const swipeRepo: TSwipeRepo = new SwipeRepo(db);
const premiumRepo: TPremiumRepo = new PremiumRepo(db);
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
router.get('/api/swipe-list',
  (req, res, next) => jwtAuthMiddleware(req, res, next, userRepo),
  (req, res, next) => handler.swipeList(req, res, next)
);

export default router;