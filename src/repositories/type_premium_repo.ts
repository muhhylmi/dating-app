/* eslint-disable no-unused-vars */
import { PremiumModel, PremiumResponse } from "../models/premium_models";

export type TPremiumRepo = {
    findOne: (req: object) => Promise<PremiumResponse>
    create: (req: PremiumModel) => Promise <PremiumResponse>
};