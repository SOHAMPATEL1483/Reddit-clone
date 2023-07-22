import { Icons } from "@/components/Icons";
import { Input } from "@/components/ui/input";
import { getServerSession } from "next-auth";
import { Image, Link as LinkImage } from "lucide-react";
import Link from "next/link";
import PostFeed from "@/components/PostFeed";
import db from "@/lib/prisma";

interface SubredditPageProps {
  params: {
    slug: string;
  };
}

export default async function SubredditPage({ params }: SubredditPageProps) {
  const session = await getServerSession();

  return (
    <>
      <div className="px-4 py-10">
        <h1 className="text-4xl font-semibold tracking-wide">
          {"r/" + params.slug}
        </h1>
      </div>
      {/* fakepostcreation  */}

      <Link href={`/r/${params.slug}/submit`}>
        <div className="flex  gap-3 rounded-lg bg-gray-200 px-4 py-2">
          <Icons.user session={session!} />
          <Input
            className="cursor-pointer"
            readOnly
            placeholder="Create Post"
          />
          <Image className="my-auto h-8 w-8" />
          <LinkImage className="my-auto h-7 w-7" />
        </div>
      </Link>
      <PostFeed subredditName={params.slug} />
    </>
  );
}
