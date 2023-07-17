"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { SubredditSubscribeTogglePayload } from "@/validators/subreddit";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useToast } from "./ui/use-toast";

interface SubscribeButtonProps {
  isSubscribed: boolean;
  subredditId: string;
}

export default function SubscribeButton({
  isSubscribed,
  subredditId,
}: SubscribeButtonProps) {
  const router = useRouter();
  const { logintoast } = useCustomToast();
  const { toast } = useToast();

  const { mutate: SubscribeToggle, isLoading } = useMutation({
    mutationFn: async (subscribe: boolean) => {
      const payload: SubredditSubscribeTogglePayload = {
        subredditId: subredditId,
        subscribe: subscribe,
      };
      const { data } = await axios.post(
        "/api/subreddit/subscribetoggle",
        payload
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return logintoast();
        }
      }
      return toast({
        title: "couldn't create subreddit",
        description: "please try again after some time",
      });
    },
    onSuccess: (data) => {
      router.refresh();
    },
  });

  if (isSubscribed)
    return (
      <Button isLoading={isLoading} onClick={() => SubscribeToggle(false)}>
        Leave Community
      </Button>
    );
  else
    return (
      <Button isLoading={isLoading} onClick={() => SubscribeToggle(true)}>
        Join Community
      </Button>
    );
}
