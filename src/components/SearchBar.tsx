"use client";

import {
  Calculator,
  Calendar,
  CreditCard,
  Loader2,
  Settings,
  Smile,
  User,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Subreddit } from "@prisma/client";
import Link from "next/link";
import { useClickOutside } from "@mantine/hooks";
import { useRouter } from "next/navigation";

interface SearchBarProps {}

export default function SearchBar({}: SearchBarProps) {
  const [input, setInput] = useState<string>("");
  const commandref = useClickOutside(() => {
    setInput("");
  });

  const router = useRouter();

  const { data, isFetching, refetch, isFetched } = useQuery({
    queryKey: ["search", "subreddit"],
    queryFn: async () => {
      if (!input) return [] as Subreddit[];
      const { data } = await axios.get(`/api/subreddit/search/?q=${input}`);
      console.log(data);
      return data as Subreddit[];
    },
    enabled: false,
    retry: false,
  });
  useEffect(() => {
    const debounced_refetch = setTimeout(() => {
      refetch();
    }, 400);
    return () => clearTimeout(debounced_refetch);
  }, [input]);

  return (
    <>
      {/* <Input className="max-w-xl" /> */}
      <Command
        ref={commandref}
        className="relative  max-w-[12rem]  overflow-visible rounded-lg md:max-w-xl"
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={input}
          onValueChange={(text) => {
            setInput(text);
          }}
        />
        {input.length > 0 ? (
          <>
            <div className="absolute inset-x-0 top-full  max-w-xl overflow-visible border bg-gray-50">
              {data?.length === 0 && !isFetching && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}

              {data?.map((subreddit) => {
                return (
                  <div
                    onClick={() => {
                      setInput("");
                      router.push(`r/${subreddit.name}`);
                    }}
                    key={subreddit.name}
                    className="flex cursor-pointer items-center rounded-sm px-3 py-1.5 text-sm"
                  >
                    <span>r/{subreddit.name}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </Command>
    </>
  );
}
