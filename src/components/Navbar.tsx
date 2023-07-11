import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";
import { buttonVariants, Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface navbarProps {}

const Navbar: FC<navbarProps> = ({}) => {
  return (
    <div className="fixed inset-x-0 top-0 z-10 border-b border-zinc-200 bg-gray-100  p-2 ">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between">
        <Link href="/">
          <p className="hidden text-xl font-bold tracking-wider sm:block">
            Reddit
          </p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
