import { z } from "zod";


export const SubredditCreationPayload = z.object({
    name: z.string().min(3).max(25),
})


export type SubredditCreationPayload = z.infer<typeof SubredditCreationPayload>;


export const SubredditSubscribeTogglePayload = z.object({
    subredditId: z.string(),
    subscribe: z.boolean(),
});


export type SubredditSubscribeTogglePayload = z.infer<typeof SubredditSubscribeTogglePayload>;