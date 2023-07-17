import { getServerSession } from "next-auth";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import SignoutButton from "./SignoutButton";
import { Icons } from "./Icons";

interface UserAcoNavProps {}

export default async function UserAcoNav({}: UserAcoNavProps) {
  const session = await getServerSession();
  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icons.user session={session} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="my-1">
            <p className="mx-2 font-semibold">{session.user.name}</p>
            <p className="mx-2 text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="font-poppins">Feed</DropdownMenuItem>
          <DropdownMenuItem>Create Community</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Link
        href="/signin"
        className={cn(buttonVariants({ variant: "default" }))}
      >
        Signin
      </Link>
    );
  }
}
