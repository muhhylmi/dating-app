/* eslint-disable no-unused-vars */
import { SwipeModel, SwipeResponse } from "../models/swipe_models";

export type TSwipeRepo = {
    create:(req: SwipeModel)=> Promise<SwipeResponse>
    count:(req: object) => Promise<number>
    findOne: (req: object) => Promise<SwipeResponse>
};