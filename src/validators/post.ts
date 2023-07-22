import { z } from "zod";
import { OutputData } from "@editorjs/editorjs";
import { Comment, Post, PostVote, Subreddit, User } from "@prisma/client";


export const PostCreationPayload = z.object({
    title: z.string().min(3).max(255),
    body: z.any(),
    subredditName: z.string(),
})

export type PostCreationPayload = z.infer<typeof PostCreationPayload>

export const PostVoteCreationPayload = z.object({
    type: z.enum(["UP", "DOWN"]),
    postid: z.string(),
})

export type PostVoteCreationPayload = z.infer<typeof PostVoteCreationPayload>

export type ExtendedPost = Post & {
    Author: User,
    Comment: Comment[],
    PostVote: PostVote[],
    Subreddit: Subreddit,
}