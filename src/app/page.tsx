import Test from "@/components/Test";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

interface pageProps {}

export default async function page({}: pageProps) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <h1>homepage</h1>
      {/* <Test /> */}
      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
    </>
  );
}
