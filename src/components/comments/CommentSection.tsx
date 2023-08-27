import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/prisma";
import CreateComment from "./CreateComment";
import Comment from "./Comment";

interface CommentSectionProps {
  postId: string;
}

export default async function CommentSection({ postId }: CommentSectionProps) {
  const session = await getServerSession(authOptions);
  const topLevelComments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      Author: true,
      CommentVote: true,
      replies: {
        include: {
          Author: true,
          CommentVote: true,
          replies: true,
        },
      },
    },
  });

  return (
    <div className="bg-gray-100 p-6">
      <CreateComment postId={postId} />
      <h2>comment page</h2>
      {/* <pre>{JSON.stringify(topLevelComments, null, 2)}</pre> */}

      {topLevelComments.map((comment) => {
        return (
          <>
            <Comment
              session={session}
              comment={comment}
              toplevel={true}
              key={comment.id}
            />
            <div
              className="relative left-6 max-w-fit divide-x-2 border-l-2 border-gray-700 pl-4"
              key={comment.id}
            >
              <div>
                {comment.replies.map((subcomment) => {
                  return (
                    <Comment
                      key={subcomment.id}
                      session={session}
                      comment={subcomment}
                    />
                  );
                })}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}
