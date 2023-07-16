import { z } from "zod";


export const SubredditCreationPayload = z.object({
    name: z.string().min(3).max(25),
})


export type SubredditCreationPayload = z.infer<typeof SubredditCreationPayload>;
