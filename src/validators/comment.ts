import { z } from "zod";
import { Comment, CommentVote, User } from "@prisma/client";



export const CommentCreationPayload = z.object({
    postId: z.string(),
    body: z.string(),
    replyToId: z.string().optional().nullable(),

})

export type CommentCreationPayload = z.infer<typeof CommentCreationPayload>;


export const CommentVoteCreationPayload = z.object({
    type: z.enum(["UP", "DOWN"]),
    commentId: z.string(),
})

export type CommentVoteCreationPayload = z.infer<typeof CommentVoteCreationPayload>


export type ExtendedComment = Comment & {
    Author: User;
    CommentVote: CommentVote[];
    replies: any;
};
