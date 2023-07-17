import { SubredditSubscribeTogglePayload } from "@/validators/subreddit";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
import db from "@/lib/prisma";


export async function POST(request: Request)
{
    try
    {
        const session = await getServerSession(authOptions);
        if (!session)
            return new Response('Unauthorized', { status: 401 });

        const body = await request.json();
        const { subredditId, subscribe } = SubredditSubscribeTogglePayload.parse(body);

        if (subscribe)
        {
            let subscription = await db.subscription.create({
                data: {
                    subredditId: subredditId,
                    userId: session.user.id,
                }
            });
        }
        else
        {
            await db.subscription.delete({
                where: {
                    userId_subredditId: {
                        subredditId: subredditId,
                        userId: session.user.id,
                    }
                }
            })
        }
        return new Response('Successfully subscribed to subreddit', { status: 200 })
    } catch (error)
    {
        console.error(error);
        if (error instanceof ZodError)
            return new Response(JSON.stringify(error.flatten().fieldErrors), { status: 422 });
        return new Response('Couldn\'t subscribe to this subreddit', { status: 400 });
    }

}