import z from 'zod';

export const swipeSchema = z.object({
  swipedUserId: z.number().min(1, "SwipedUserId is invalid"),
  status: z.enum(["LIKE", "PASS"]),
});

export type SwipeModel = {
    id? : number;
    swiperId: number;
    swipedUserId: number;
    status: Status;
}
export type Status = "LIKE" | "PASS"
export type SwipeResponse = SwipeModel | null;
export type SwipeInput = z.infer<typeof swipeSchema> & {
    swiperId: number;
};
