"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentVote from "./CommentVote";
import { ExtendedComment } from "@/validators/comment";
import { useSession } from "next-auth/react";
import { CommentVote as CommentVoteType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { MessageSquare, Reply } from "lucide-react";
import CreateComment from "./CreateComment";

interface CommentProps {
  comment: ExtendedComment;
  session: Session | null;
  toplevel?: boolean;
}

export default function Comment({
  comment,
  session,
  toplevel = false,
}: CommentProps) {
  const [isReply, SetisReply] = useState<boolean>(false);

  const voteAmt = comment.CommentVote.reduce((acc, comment) => {
    if (comment.type === "UP") return acc + 1;
    else if (comment.type === "DOWN") return acc - 1;
    else return acc;
  }, 0);

  let uservote: CommentVoteType[] = comment.CommentVote.filter((vote) => {
    return vote.userId === session?.user.id;
  });

  return (
    <>
      <div
        key={comment.id}
        className="my-2 flex w-full gap-2 rounded-lg  bg-gray-100 px-4 py-2"
      >
        <CommentVote
          commentId={comment.id}
          voteAmt={voteAmt}
          userVote={uservote.length ? uservote[0].type : undefined}
        />
        <div className="pt-2">
          <div className="flex w-fit gap-2">
            <Avatar className="my-auto h-6 w-6">
              <AvatarImage src={comment.Author?.image!} />
              <AvatarFallback>{"soham".substring(0, 2)}</AvatarFallback>
            </Avatar>
            <p>{comment.Author.name}</p>
            <span className="text-gray-500">•</span>
            <p className="text-gray-500">
              {formatTimeToNow(new Date(comment.createdAt))}
            </p>
          </div>
          <p>{comment.body}</p>

          {toplevel ? (
            <div
              className="flex cursor-pointer gap-2 align-middle text-muted-foreground"
              onClick={() => SetisReply((prev) => !prev)}
            >
              <Reply className="rotate-180" />
              <p>reply</p>
            </div>
          ) : null}
        </div>
      </div>
      {isReply ? (
        <CreateComment postId={comment.postId} replyToId={comment.id} />
      ) : null}
    </>
  );
}
