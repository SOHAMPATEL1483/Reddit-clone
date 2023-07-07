import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { buttonVariants, Button } from "./ui/button";

interface navbarProps {}

const Navbar: FC<navbarProps> = ({}) => {
  return (
    <div className="fixed inset-x-0 top-0 z-10 border-b border-zinc-200 bg-zinc-100  p-2 ">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between">
        <Link href="/">
          <p className="hidden text-xl font-bold tracking-wider sm:block">
            Reddit
          </p>
        </Link>
        <p className="text-xl font-bold tracking-wider">Reddit</p>
        <Link
          href="/signin"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Signin
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
