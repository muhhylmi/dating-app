/* eslint-disable no-unused-vars */
import { UserModel } from "../models/user_models";

type TUserRepo = {
    create: (user: UserModel) => Promise<UserModel>
};

export default TUserRepo;