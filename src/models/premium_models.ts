export type PremiumModel = {
    id?: number;
    userId: number;
    hasNoSwipeLimit: boolean;
};

export type PremiumResponse = PremiumModel | null;