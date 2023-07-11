import Test from "@/components/Test";

interface pageProps {}

export default async function page({}: pageProps) {
  return (
    <>
      <h1>homepage</h1>
      <Test />
    </>
  );
}
