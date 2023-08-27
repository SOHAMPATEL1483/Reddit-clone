import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export const useCustomToast = () => {
  const logintoast = () => {
    const { dismiss } = toast({
      title: "Login Error",
      description: "you must be logged in to further proceed",
      action: (
        <Link
          href="/signin"
          onClick={() => dismiss()}
          className={buttonVariants({
            variant: "default",
            className: "w-fit",
          })}
        >
          Signin
        </Link>
      ),
      variant: "destructive",
    });
  };
  return { logintoast };
};
