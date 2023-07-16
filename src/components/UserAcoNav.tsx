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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SignoutButton from "./SignoutButton";

interface UserAcoNavProps {}

export default async function UserAcoNav({}: UserAcoNavProps) {
  const session = await getServerSession();
  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          {session?.user?.image ? (
            <Avatar>
              <AvatarImage src={session?.user?.image} />
              <AvatarFallback>
                {session.user.name?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          )}
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
