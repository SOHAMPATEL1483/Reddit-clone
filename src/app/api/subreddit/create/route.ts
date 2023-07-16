import db from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { ZodError, z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
import { SubredditCreationPayload } from "@/validators/subreddit";

export async function POST(request: Request)
{
    try
    {
        const session = await getServerSession(authOptions);
        if (!session)
            return new Response('Unauthorized', { status: 401 });

        let body = await request.json();
        const { name } = SubredditCreationPayload.parse(body);
        const subredditExists = await db.subreddit.findFirst({
            where: {
                name,
            }
        });
        if (subredditExists)
            return new Response("Subreddit Already exists", { status: 409 });

        const subreddit = await db.subreddit.create({
            data: {
                name: name,
                creatorId: session?.user.id as string,
            }
        });
        console.log("success");
        return new Response('Successfully created Subreddit', { status: 200 })

    } catch (error)
    {
        if (error instanceof ZodError)
        {
            return new Response(JSON.stringify(error.flatten().fieldErrors), { status: 422 });
        }
        return new Response('Couldn\'t create subreddit', { status: 400 });


    }
}