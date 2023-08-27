"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import axios from "axios";
import { ExtendedPost } from "@/validators/post";
import { Suspense, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PostFeedProps {
  subredditName?: string;
}

const LIMIT = 2;
function calculatePath(pageParam: any, subredditName?: string) {
  if (subredditName)
    return `/api/post?page=${pageParam}&limit=${LIMIT}&subredditName=${subredditName}`;
  else return `/api/post?page=${pageParam}&limit=${LIMIT}`;
}

export default function PostFeed({ subredditName }: PostFeedProps) {
  const { ref, inView } = useInView();
  const fetchPosts = async ({ pageParam = 1 }: any) => {
    const { data } = await axios.get(calculatePath(pageParam, subredditName));
    return data as ExtendedPost[];
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.length === LIMIT ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  return (
    <>
      {/* <pre>{JSON.stringify(data?.pages)}</pre> */}
      {isLoading && <Loader2 className="mx-auto my-2 animate-spin" />}
      {isSuccess &&
        data?.pages.map((page) =>
          page.map((post, i: number) => {
            if (page.length == i + 1) {
              return <Post key={post.id} inref={ref} post={post} />;
            } else {
              return <Post key={post.id} post={post} />;
            }
          })
        )}
      {isFetchingNextPage && <Loader2 className="mx-auto my-2 animate-spin" />}
    </>
  );
}

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full bg-gray-600" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-gray-600" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
