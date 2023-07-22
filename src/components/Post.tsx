"use client";

import { ExtendedPost } from "@/validators/post";
import EditorViewer from "./EditorViewer";
import React, { MutableRefObject } from "react";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import PostVoteClient from "./postvote/PostvoteClient";
import { useSession } from "next-auth/react";
import { PostVote } from "@prisma/client";

interface PostProps {
  post: ExtendedPost;
  inref?: any;
}

const Post = ({ post, inref }: PostProps) => {
  const { data: session } = useSession();

  const uservote: PostVote[] = post.PostVote.filter((vote) => {
    return vote.userId === session?.user.id;
  });
  const voteAmt =
    post.PostVote.filter((vote) => vote.type === "UP").length -
    post.PostVote.filter((vote) => vote.type === "DOWN").length;
  return (
    <div
      ref={inref ? inref : null}
      className="m-2 flex gap-2 rounded-xl border border-gray-700 bg-gray-300 p-3"
    >
      <PostVoteClient
        postId={post.id}
        voteAmt={voteAmt}
        userVote={uservote.length ? uservote[0].type : undefined}
      />
      <div>
        <div className="my-1 flex gap-2 text-[12px] md:text-sm">
          <p>r/{post?.Subreddit.name}</p>
          <span>•</span>
          <p className="text-gray-500">Posted by {post?.Author.name}</p>
          <span className="text-gray-500">•</span>
          <p className="text-gray-500">
            {formatTimeToNow(new Date(post?.createdAt))}
          </p>
        </div>
        <h1>{post?.title}</h1>
        <EditorViewer data={post?.body} />
        <div className="flex gap-2 align-middle text-muted-foreground">
          <MessageSquare className="my-auto h-4 w-4" />
          <p>{post.Comment.length} Comments</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
