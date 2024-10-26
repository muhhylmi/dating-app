/* eslint-disable no-unused-vars */
import { UserModel, UserResponse } from "../models/user_models";

type TUserRepo = {
    create: (user: UserModel) => Promise<UserResponse>
    findOne: (query: object) => Promise<UserResponse>
    findMany: (query: object) => Promise<UserResponse[]>
    updateOne: (id: number, data: object) => Promise<UserResponse>
    updateMany: (query: object, data: object) => Promise<number>
};

export default TUserRepo;