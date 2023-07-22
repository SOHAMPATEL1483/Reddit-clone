"use client";

import { OutputData } from "@editorjs/editorjs";
import Output from "editorjs-react-renderer";
import Image from "next/image";

interface EditorViewerProps {
  data: any;
}

export default function EditorViewer({ data }: EditorViewerProps) {
  return (
    <Output
      renderers={{
        image: CustomImageRenderer,
        code: CustomCodeRenderer,
      }}
      className="text-sm"
      data={data}
    />
  );
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative min-h-[15rem] w-full">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  );
}
function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="rounded-md bg-gray-800 p-4">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
}
