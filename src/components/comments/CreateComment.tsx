"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { useCustomToast } from "@/hooks/useCustomToast";
import axios, { AxiosError } from "axios";
import { type CommentCreationPayload } from "@/validators/comment";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

export default function CreateComment({
  postId,
  replyToId,
}: CreateCommentProps) {
  const [input, setInput] = useState<string>("");

  const { logintoast } = useCustomToast();
  const { toast } = useToast();

  const router = useRouter();

  const { mutate: CreateComment, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CommentCreationPayload = {
        body: input,
        postId: postId,
        replyToId,
      };
      const { data } = await axios.post("/api/comment/create/", payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return logintoast();
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Empty comment body",
            description: "subreddit body can't be empty",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "couldn't post your commet",
        description: "please try again after some time",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.refresh();
    },
  });
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg p-4 ">
      <Label className="text-lg font-semibold" htmlFor="comment">
        Create Comment
      </Label>
      <Textarea
        id="comment"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        isLoading={isLoading}
        onClick={() => CreateComment()}
        className="w-fit"
      >
        Post
      </Button>
    </div>
  );
}
