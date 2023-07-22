"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useState } from "react";
import { VoteType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { PostVoteCreationPayload } from "@/validators/post";
import { usePrevious } from "@mantine/hooks";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useToast } from "../ui/use-toast";

interface PostvoteClientProps {
  postId: string;
  voteAmt: number;
  userVote?: VoteType;
}

export default function PostvoteClient({
  postId,
  userVote,
  voteAmt,
}: PostvoteClientProps) {
  const [currentVote, setCurrentVote] = useState<VoteType | undefined>(
    userVote
  );
  const [voteAmount, setVoteAmount] = useState<number>(voteAmt);
  const prevVote = usePrevious(currentVote);
  const { logintoast } = useCustomToast();
  const { toast } = useToast();

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteCreationPayload = { type: type, postid: postId };
      const { data } = await axios.post("/api/post/vote", payload);
      return data;
    },
    onMutate: async (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVoteAmount((amt) => amt - 1);
        else setVoteAmount((amt) => amt + 1);
      } else {
        setCurrentVote(type);
        if (type === "UP") setVoteAmount((amt) => amt + (currentVote ? 2 : 1));
        else setVoteAmount((amt) => amt - (currentVote ? 2 : 1));
      }
    },
    onSuccess: async () => {},
    onError: async (error, type: VoteType) => {
      if (type === "UP") setVoteAmount((amt) => amt - 1);
      else setVoteAmount((amt) => amt + 1);
      setCurrentVote(prevVote);

      if (error instanceof AxiosError)
        if (error.response?.status === 401) {
          return logintoast();
        }
      return toast({
        title: "your vote for post is failed",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex w-fit flex-col gap-1 ">
      <ArrowBigUp
        className={cn("h-7 w-7 cursor-pointer", {
          "fill-black": currentVote === "UP",
        })}
        onClick={() => vote("UP")}
      />
      <p className="mx-auto">{voteAmount}</p>
      <ArrowBigDown
        className={cn("h-7 w-7 cursor-pointer", {
          "fill-black": currentVote === "DOWN",
        })}
        onClick={() => vote("DOWN")}
      />
    </div>
  );
}
