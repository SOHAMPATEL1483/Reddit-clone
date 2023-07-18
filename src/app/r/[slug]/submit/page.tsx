import Editor from "@/components/Editor";

interface pageProps {
  params: {
    slug: string;
  };
}

export default function page({ params }: pageProps) {
  return (
    <>
      <Editor subredditName={params.slug} />
    </>
  );
}
