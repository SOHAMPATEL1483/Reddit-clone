import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { PostCreationPayload } from "@/validators/post";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request)
{
    try
    {
        const session = await getServerSession(authOptions);
        if (!session)
            return new Response('Unauthorized', { status: 401 });

        let request_body = await request.json();
        const { title, body, subredditName } = PostCreationPayload.parse(request_body);

        let subreddit = await db.subreddit.findFirst({
            where: {
                name: subredditName,
            }
        })
        if (!subreddit)
            return new Response("subreddit doesn't exist", { status: 422 });

        const post = await db.post.create({
            data: {
                title: title,
                body: body,
                authorid: session.user.id,
                subredditId: subreddit.id,
            }
        })

        return new Response(post.id, { status: 200 })

    } catch (error)
    {
        if (error instanceof ZodError)
            return new Response(JSON.stringify(error.flatten().fieldErrors), { status: 422 });
        return new Response('Couldn\'t submit your post', { status: 400 });


    }
}