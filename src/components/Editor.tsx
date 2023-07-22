"use client";

import { RefAttributes, useCallback, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input, InputProps } from "./ui/input";
import type EditorJS from "@editorjs/editorjs";
import type EditorConfig from "@editorjs/editorjs";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import { uploadFiles } from "@/lib/uploadthing";
import { type OutputData } from "@editorjs/editorjs";
import { PostCreationPayload } from "@/validators/post";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useRouter } from "next/navigation";

interface EditorProps {
  subredditName: string;
}
interface CreatePostProps {
  editorData: OutputData;
  title: string;
}

export default function Editor({ subredditName }: EditorProps) {
  const ref = useRef<EditorJS>();
  const titleRef = useRef<any>();

  const { toast } = useToast();
  const { logintoast } = useCustomToast();
  const router = useRouter();

  const { mutate: CreatePost, isLoading } = useMutation({
    mutationFn: async ({ editorData, title }: CreatePostProps) => {
      const payload: PostCreationPayload = {
        title: title,
        body: editorData,
        subredditName: subredditName,
      };
      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return logintoast();
        }
        if (error.response?.status === 409) {
          return toast({
            title: "Subreddit doesn't exist",
            description:
              "You can't create post in subreddit that doesn't exist",
            variant: "destructive",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid Post title or body",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "couldn't submit post",
        description: "please try again after some time",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "successfully created post",
      });
      router.push(`post/${data}`);
    },
  });

  const HandleClick = async () => {
    const editorData = await ref.current?.save();
    const title = await titleRef?.current?.value;
    if (!title) {
      return toast({
        title: "Title of post cannot be empty",
        variant: "destructive",
      });
    } else if (!editorData?.blocks.length) {
      return toast({
        title: "Body of post cannot be empty",
        variant: "destructive",
      });
    }
    CreatePost({ editorData, title });
  };

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    //@ts-ignore
    const Embed = (await import("@editorjs/embed")).default;
    //@ts-ignore
    const List = (await import("@editorjs/list")).default;
    //@ts-ignore
    const Table = (await import("@editorjs/table")).default;
    //@ts-ignore
    const Code = (await import("@editorjs/code")).default;
    //@ts-ignore
    const InlineCode = (await import("@editorjs/inline-code")).default;
    //@ts-ignore
    const ImageTool = (await import("@editorjs/image")).default;

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "write your posts",
      inlineToolbar: true,
      onReady: () => {
        ref.current = editor;
      },
      tools: {
        header: Header,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                // upload to uploadthing
                const [res] = await uploadFiles({
                  files: [file],
                  endpoint: "imageUploader",
                });

                return {
                  success: 1,
                  file: {
                    url: res.fileUrl,
                  },
                };
              },
            },
          },
        },
        list: List,
        code: Code,
        inlineCode: InlineCode,
        table: Table,
        embed: Embed,
      },
    });
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.destroy();
    initializeEditor();
  }, [initializeEditor]);

  return (
    <>
      <div className="flex flex-col gap-3 overflow-hidden p-2">
        <p className="text-xl text-gray-500">
          Create Post at
          <span className="text-gray-800"> r/{subredditName}</span>
        </p>
        <Input
          ref={titleRef}
          placeholder="Title"
          className="h-fit text-4xl text-gray-700"
        />
        <div id="editorjs" className="rounded-lg border bg-gray-100 p-2" />
        {/* click will trigger HandleClick , we validate data in handle click that then submit data to endpoint via react query */}
        <Button onClick={HandleClick} isLoading={isLoading}>
          Create Post
        </Button>
      </div>
    </>
  );
}
