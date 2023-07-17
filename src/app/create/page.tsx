"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { type SubredditCreationPayload } from "@/validators/subreddit";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useCustomToast } from "@/hooks/useCustomToast";

interface CreateSubredditProps {}

export default function CreateSubreddit({}: CreateSubredditProps) {
  const { back } = useRouter();
  const { toast } = useToast();
  const { logintoast } = useCustomToast();

  const [input, setInput] = useState<string>("");

  let { mutate: CreateCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubredditCreationPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit/create", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return logintoast();
        }
        if (error.response?.status === 409) {
          return toast({
            title: "Subreddit Already Exists",
            description: "please create subreddit with different name",
            variant: "destructive",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid Subreddit name",
            description: "length of subreddit name must be between 3 to 25",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "couldn't create subreddit",
        description: "please try again after some time",
      });
    },
    onSuccess: (data) => {},
  });

  return (
    <>
      <div className="mx-3 mt-40 max-w-3xl rounded-lg border bg-gray-100 p-4 md:mx-auto">
        <p className="mb-4 text-xl font-bold">Create a Community</p>
        <hr className="h-px bg-gray-900" />
        <p className="mt-3 font-semibold">Name</p>
        <p className="text-sm text-gray-600">
          Community name including capitalization cannot be changed
        </p>
        <div className="relative my-2 h-fit w-full">
          <Input
            className="pl-6"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <p className="absolute top-0 p-2 text-muted-foreground">r/</p>
        </div>
        <div className="mt-5 flex w-full justify-end gap-4">
          <Button onClick={back}>Cancel</Button>
          <Button isLoading={isLoading} onClick={() => CreateCommunity()}>
            Create Community
          </Button>
        </div>
      </div>
    </>
  );
}
