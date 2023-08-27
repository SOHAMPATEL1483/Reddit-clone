import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
import { CommentVoteCreationPayload } from "@/validators/comment";

export async function POST(request: Request)
{
    try
    {
        const session = await getServerSession(authOptions);
        if (!session)
            return new Response('Unauthorized', { status: 401 });

        let request_body = await request.json();
        const { type, commentId } = CommentVoteCreationPayload.parse(request_body);

        const existing_vote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId,
            }
        });

        if (existing_vote?.type === type)
        {
            await db.commentVote.delete({
                where: {
                    userId_commentId: {
                        userId: session.user.id,
                        commentId,
                    }
                }
            });
        }
        else
        {
            const vote = await db.commentVote.upsert({
                create: {
                    type: type,
                    commentId,
                    userId: session.user.id,
                },
                update: {
                    type: type,
                },
                where: {
                    userId_commentId: {
                        userId: session.user.id,
                        commentId,
                    }

                }
            });
            console.log(vote);
        }
        return new Response("successfully voted the post", { status: 200 });
    } catch (error)
    {
        if (error instanceof ZodError)
            return new Response(JSON.stringify(error.flatten().fieldErrors), { status: 422 });
        return new Response('Couldn\'t vote', { status: 400 });


    }
}