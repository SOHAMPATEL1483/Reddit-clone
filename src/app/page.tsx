import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import PostFeed from "@/components/PostFeed";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Home } from "lucide-react";
import { kysely_db } from "@/lib/kysely";

export const dynamic = "force-dynamic";

interface pageProps {}

export default async function page({}: pageProps) {
  const session = await getServerSession(authOptions);

  const temp = await kysely_db.selectFrom("Subreddit").selectAll().execute();

  return (
    <>
      {/* <pre>{JSON.stringify(temp, null, 2)}</pre> */}
      <div className="relative top-20 grid w-full grid-cols-2 gap-x-4 px-2 md:grid-cols-3 md:px-0">
        <div className="col-span-2 w-full">
          <p className="mb-7 ml-3 text-4xl font-semibold tracking-wide">
            Homepage
          </p>

          {session ? (
            <PostFeed />
          ) : (
            <p className="ml-3 text-lg">please login to get your feed</p>
          )}
        </div>
        {/* sidebar */}
        <div className="mt-5 hidden h-fit w-full overflow-hidden rounded-lg bg-gray-100 md:block">
          <div className="flex gap-2 bg-green-200 p-5">
            <Home />
            <p className=" font-semibold">Home</p>
          </div>
          <div className="flex w-full flex-col gap-4 p-5 ">
            <p className="text-sm text-gray-500">
              Welcome to your personal reddit homepage.
            </p>

            <Link href={`/create`} className={cn(buttonVariants(), "w-full")}>
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
