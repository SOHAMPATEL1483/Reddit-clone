import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentSection from "@/components/comments/CommentSection";
import EditorViewer from "@/components/EditorViewer";
import PostvoteClient from "@/components/postvote/PostvoteClient";
import db from "@/lib/prisma";
import { formatTimeToNow } from "@/lib/utils";
import { PostVote } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
      PostVote: true,
    },
  });

  if (!post) return notFound();

  const session = await getServerSession(authOptions);

  const uservote: PostVote[] = post.PostVote.filter((vote) => {
    return vote.userId === session?.user.id;
  });
  const voteAmt =
    post.PostVote.filter((vote) => vote.type === "UP").length -
    post.PostVote.filter((vote) => vote.type === "DOWN").length;

  return (
    <>
      <div className="mb-4 flex gap-2 rounded-lg bg-gray-100 p-4">
        <PostvoteClient
          postId={params.postId}
          voteAmt={voteAmt}
          userVote={uservote.length ? uservote[0].type : undefined}
        />
        <div className="w-full">
          <div className="my-1 flex gap-2 text-[12px] md:text-sm">
            <Link href={`/r/${post?.Subreddit.name}`}>
              <p>r/{post?.Subreddit.name}</p>
            </Link>
            <span>•</span>
            <p className="text-gray-500">Posted by {post?.Author.name}</p>
            <span className="text-gray-500">•</span>
            <p className="text-gray-500">{formatTimeToNow(post?.createdAt!)}</p>
          </div>
          <p className="text-3xl font-bold">{post?.title}</p>
          <EditorViewer data={post?.body} />
        </div>
      </div>
      <CommentSection postId={params.postId} />
    </>
  );
}
