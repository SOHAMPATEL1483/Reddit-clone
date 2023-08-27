import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
import { CommentCreationPayload } from "@/validators/comment";

export async function POST(request: Request)
{
    try
    {
        const session = await getServerSession(authOptions);
        if (!session)
            return new Response('Unauthorized', { status: 401 });

        let request_body = await request.json();
        const { body, postId, replyToId } = CommentCreationPayload.parse(request_body);

        const comment = await db.comment.create({
            data: {
                authorId: session.user.id,
                body,
                postId,
                replyToId,

            }

        });
        console.log(comment);
        return new Response('SUCCESS', { status: 200 });

    } catch (error)
    {
        if (error instanceof ZodError)
            return new Response(JSON.stringify(error.flatten().fieldErrors), { status: 422 });
        return new Response('Couldn\'t submit your comment', { status: 400 });


    }
}