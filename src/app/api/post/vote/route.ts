import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { PostVoteCreationPayload } from "@/validators/post";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request)
{
    try
    {
        const session = await getServerSession(authOptions);
        if (!session)
            return new Response('Unauthorized', { status: 401 });

        let request_body = await request.json();
        const { type, postid } = PostVoteCreationPayload.parse(request_body);

        const vote = await db.postVote.upsert({
            create: {
                type: type,
                postId: postid,
                userId: session.user.id,
            },
            update: {
                type: type,
            },
            where: {
                userId_postId: {
                    postId: postid,
                    userId: session.user.id,
                }

            }
        });
        console.log(vote);
        return new Response("successfully voted the post", { status: 200 });
    } catch (error)
    {
        if (error instanceof ZodError)
            return new Response(JSON.stringify(error.flatten().fieldErrors), { status: 422 });
        return new Response('Couldn\'t vote', { status: 400 });


    }
}