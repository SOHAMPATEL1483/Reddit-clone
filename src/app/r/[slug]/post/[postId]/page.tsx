import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EditorViewer from "@/components/EditorViewer";
import db from "@/lib/prisma";
import { formatTimeToNow } from "@/lib/utils";
import { getServerSession } from "next-auth";

interface PostpageProps {
  params: {
    slug: string;
    postId: string;
  };
}

export default async function Postpage({ params }: PostpageProps) {
  const post = await db.post.findFirst({
    where: {
      id: params.postId,
    },
    include: {
      Author: true,
      Subreddit: {
        select: {
          name: true,
        },
      },
      Comment: true,
      PostVote: true,
    },
  });

  return (
    <>
      <div className="rounded-lg bg-gray-100 p-4">
        <div className="my-1 flex gap-2 text-[12px] md:text-sm">
          <p>r/{post?.Subreddit.name}</p>
          <span>•</span>
          <p className="text-gray-500">Posted by {post?.Author.name}</p>
          <span className="text-gray-500">•</span>
          <p className="text-gray-500">{formatTimeToNow(post?.createdAt!)}</p>
        </div>
        <p className="text-3xl font-bold">{post?.title}</p>
        <EditorViewer data={post?.body} />
      </div>
    </>
  );
}
