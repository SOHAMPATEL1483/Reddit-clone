"use client";

import { RefAttributes, useCallback, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input, InputProps } from "./ui/input";
import type EditorJS from "@editorjs/editorjs";
import type EditorConfig from "@editorjs/editorjs";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./ui/use-toast";
import { uploadFiles } from "@/lib/uploadthing";

interface EditorProps {
  subredditName: string;
}

export default function Editor({ subredditName }: EditorProps) {
  const ref = useRef<EditorJS>();
  const titleRef = useRef<any>();

  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: async () => {},
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
  };
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const List = (await import("@editorjs/list")).default;
    const Table = (await import("@editorjs/table")).default;
    const Code = (await import("@editorjs/code")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
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
      <div className="flex flex-col gap-3">
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
        <Button onClick={HandleClick}>Create Post</Button>
      </div>
    </>
  );
}
