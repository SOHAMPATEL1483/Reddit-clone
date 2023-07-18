import { buttonVariants } from "@/components/ui/button";
import db from "@/lib/prisma";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SubscribeButton from "@/components/SubscribeButton";

interface SubredditlayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export default async function Subredditlayout({
  children,
  params,
}: SubredditlayoutProps) {
  const session = await getServerSession(authOptions);
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: params.slug,
    },
    include: {
      Subscription: true,
    },
  });
  const issubscribed = await db.subscription.findFirst({
    where: {
      userId: session?.user.id,
      Subreddit: {
        name: params.slug,
      },
    },
  });
  if (!subreddit) return notFound();

  return (
    <>
      <div className="relative top-20 grid w-full grid-cols-2 gap-x-4 px-2 md:grid-cols-3 md:px-0">
        <div className="col-span-2 ">{children}</div>
        {/* sidebar */}
        <div className="mt-5 hidden h-fit w-full overflow-hidden rounded-lg bg-gray-100 md:block">
          <p className="bg-gray-200 p-5  font-semibold">
            About r/{subreddit.name}
          </p>
          <div className="flex w-full flex-col gap-2 p-5 ">
            <div>
              <div className="my-2 flex w-full justify-between">
                <p className="text-gray-500">Created </p>
                <p className="">{format(subreddit.createdAt, "MMMM d,yyyy")}</p>
              </div>
              <hr className="my-1 h-px border-0 bg-gray-300 "></hr>
            </div>
            <div>
              <div className="my-2 flex w-full justify-between">
                <p className="text-gray-500">Members </p>
                <p className=""> {subreddit.Subscription.length}</p>
              </div>
              <hr className="my-1 h-px border-0 bg-gray-300 "></hr>
            </div>
            {subreddit.creatorId === session?.user.id ? (
              <p className="my-1">you created this community</p>
            ) : null}
            <SubscribeButton
              isSubscribed={issubscribed ? true : false}
              subredditId={subreddit.id}
            />

            <Link
              href={`/r/${params.slug}/submit`}
              className={cn(buttonVariants(), "w-full")}
            >
              Create Post
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
