import db from "@/lib/prisma";

export async function GET(req: Request)
{

    const url = new URL(req.url);
    const q = url.searchParams.get("q");

    console.log(q);

    if (!q)
        return new Response("empty query", { status: 400 });


    const subreddits = await db.subreddit.findMany({
        where: {
            name: {
                mode: "insensitive",
                startsWith: q,
            }
        },
        take: 5
    });

    return new Response(JSON.stringify(subreddits));
}