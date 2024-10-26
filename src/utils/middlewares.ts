import { NextFunction, Request, Response } from "express";
import { HttpException } from "./exception";
import jwt from 'jsonwebtoken';
import TUserRepo from "../repositories/type_user_repo";
import { JwtPayload } from "../models/jwt_payload";
import config from "../infra/config";

export const basicAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw next(new HttpException(401, "Invalid Token"));
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username !== config.BASIC_AUTH_USERNAME) {
      throw new HttpException(401, "Credentials is invalid");
    }
    if (password !== config.BASIC_AUTH_PASSWORD) {
      throw new HttpException(401, "Credentials is invalid");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction, repo: TUserRepo) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw next(new HttpException(401, "Invalid Token"));
    }

    const token = authHeader.split(' ')[1];
    const decode = await jwt.verify(token, config.JWTPRIVATEKEY) as JwtPayload;
    if (!decode) {
      throw next(new HttpException(400, "Invalid Token"));
    }

    const user = await repo.findOne({
      email: decode.email
    });
    if (!user) {
      throw new HttpException(400, "Invalid Token");
    }

    req.body.users = user;

    next();
  } catch (error) {
    next(error);
  }
};