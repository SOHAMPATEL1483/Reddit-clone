import Link from "next/link";
import { FC } from "react";

import { Icons } from "./Icons";

import UserAcoNav from "./UserAcoNav";
import SearchBar from "./SearchBar";

interface navbarProps {}

const Navbar: FC<navbarProps> = async ({}) => {
  return (
    <div className="fixed inset-x-0 top-0 z-10 border-b border-zinc-200 bg-gray-100  p-2 ">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex">
          <Icons.reddit className="my-auto h-8  md:mr-3" />
          <p className="my-auto hidden text-xl font-bold tracking-wider sm:block">
            Reddit
          </p>
        </Link>

        <SearchBar />
        <UserAcoNav />
      </div>
    </div>
  );
};

export default Navbar;
