"use client";

import { signOut } from "next-auth/react";

interface signoutProps {}

export default function SignoutButton({}: signoutProps) {
  const signout = async () => {
    await signOut({
      callbackUrl: `${window.location.origin}/signin`,
    });
  };
  return (
    <button className="h-full w-full text-left text-red-500" onClick={signout}>
      Sign Out
    </button>
  );
}
