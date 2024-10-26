import { PrismaClient } from "@prisma/client";
import { TSwipeRepo } from "./type_swipe_repo";
import { SwipeModel, SwipeResponse } from "../models/swipe_models";

export class SwipeRepo implements TSwipeRepo {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient){
    this.prisma = prisma;
  }

  async create(swipe: SwipeModel): Promise<SwipeResponse> {
    const newSwipe = await this.prisma.swipe.create({
      data: {
        status: swipe.status,
        swipedUserId: swipe.swipedUserId,
        swiperId: swipe.swiperId
      }
    });
    swipe.id = newSwipe.id;
    return swipe;
  }

  async count(query: object): Promise<number> {
    const swipeCount = await this.prisma.swipe.count({
      where: query
    });
    return swipeCount;
  }

  async findOne(query: object): Promise<SwipeResponse> {
    const swipeCount = await this.prisma.swipe.findFirst({
      where: query
    });
    return swipeCount;
  }

  async findMany(query: object): Promise<SwipeResponse[]> {
    const swipes = await this.prisma.swipe.findMany({
      where: { isDeleted: false, ...query }
    });
    return swipes.map(swipe => {
      return {
        id: swipe.id,
        status: swipe.status,
        swipedUserId: swipe.swipedUserId,
        swiperId: swipe.swiperId
      };
    });
  }
}