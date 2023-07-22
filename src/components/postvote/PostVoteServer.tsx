// import { getServerSession } from "next-auth";
// import PostvoteClient from "./PostvoteClient";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import db from "@/lib/prisma";

// interface PostVoteServerProps {
//   postId: string;
//   voteAmt: number;
// }

// export default async function PostVoteServer({
//   postId,
//   voteAmt,
// }: PostVoteServerProps) {
//   const session = await getServerSession(authOptions);

//   const uservote = await db.postVote.findFirst({
//     where: {
//       userId: session?.user.id,
//       postId: postId,
//     },
//   });

//   return (
//     <PostvoteClient
//       postid={postId}
//       voteAmt={voteAmt}
//       userVote={uservote?.type}
//     />
//   );
// }
