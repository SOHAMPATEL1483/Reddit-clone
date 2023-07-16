// import { FC } from "react";

// interface pageProps {}

// const page: FC<pageProps> = ({}) => {
//   return <div>page</div>;
// };

// export default page;

"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function DemoCreateAccount() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const loginwithgoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google", { callbackUrl: `${window.location.origin}` });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    }
    console.log("bankai");
    setIsLoading(false);
  };
  return (
    <Card className=" mx-3 mt-56 max-w-md bg-gray-100 md:mx-auto">
      <CardHeader className="space-y-1">
        <Icons.reddit className="mx-auto h-10" />
        <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
        <CardDescription className="">
          By continuing, you are setting up a reddit account and agree to our
          User Agreement and Privacy Policy.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          isLoading={isLoading}
          onClick={loginwithgoogle}
          variant="default"
          className="w-full"
        >
          <Icons.google className="mr-3 h-4 w-4" />
          Sign in with Google
        </Button>
      </CardContent>
      {/* <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter> */}
    </Card>
  );
}
