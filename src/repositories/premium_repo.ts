import { PrismaClient } from "@prisma/client";
import { PremiumModel, PremiumResponse } from "../models/premium_models";
import { TPremiumRepo } from "./type_premium_repo";
import { TDatabases } from "../infra/databases";

export class PremiumRepo implements TPremiumRepo {
  private readonly prisma: PrismaClient;
  constructor(db: TDatabases){
    this.prisma = db.getSqlClient();
  }

  async create(premium: PremiumModel): Promise<PremiumResponse> {
    const newPremium = await this.prisma.premium.create({
      data: {
        id: premium.id,
        userId: premium.userId,
        hasNoSwipeLimit: premium.hasNoSwipeLimit
      }
    });
    premium.id = newPremium.id;
    return premium;
  }

  async findOne(query: object): Promise<PremiumResponse> {
    const swipeCount = await this.prisma.premium.findFirst({
      where: query
    });
    return swipeCount;
  }
}