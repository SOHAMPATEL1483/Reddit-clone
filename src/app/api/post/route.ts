import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import db from "@/lib/prisma";
import { Subscription } from "@prisma/client";


const schema = z.object({
    limit: z.number(),
    page: z.number(),
    subredditName: z.string().optional().nullable(),
})

//limit , page , subredditname
export async function GET(request: Request)
{
    try
    {
        const url = new URL(request.url);
        const session = await getServerSession(authOptions);

        let followingCommunities: Subscription[] = [];
        let followingCommunitiesIds: string[] = [];

        if (session)
        {
            followingCommunities = await db.subscription.findMany({
                where: {
                    userId: session.user.id,
                }
            });
            followingCommunitiesIds = followingCommunities.map((community) => community.subredditId);
        }
        const { limit, page, subredditName } = schema.parse({
            limit: parseInt(url.searchParams.get("limit")!),
            page: parseInt(url.searchParams.get("page")!),
            subredditName: url.searchParams.get("subredditName"),
        });
        let whereclouse = {};
        if (subredditName)
        {
            whereclouse = {
                Subreddit: {
                    name: subredditName,
                }
            };
        }
        else
        {
            whereclouse = {
                subredditId: {
                    in: followingCommunitiesIds,
                }
            };
        }
        let posts = await db.post.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: whereclouse,
            include: {
                Author: true,
                Comment: true,
                PostVote: true,
                Subreddit: true,
            },
            orderBy: {
                createdAt: "desc",
            }
        });
        return new Response(JSON.stringify(posts), { status: 200 });

    }
    catch (error)
    {
        console.error(error);

    }



}