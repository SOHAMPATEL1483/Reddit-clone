"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "./Post";
import axios from "axios";
import { ExtendedPost } from "@/validators/post";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import Test from "./Test";
import { Button } from "./ui/button";

interface PostFeedProps {
  subredditName: string;
}

const LIMIT = 2;

export default function PostFeed({ subredditName }: PostFeedProps) {
  const { ref, inView } = useInView();
  const fetchPosts = async ({ pageParam = 1 }: any) => {
    console.log(pageParam);
    const { data } = await axios.get(
      `/api/post?page=${pageParam}&limit=${LIMIT}&subredditName=${subredditName}`
    );
    console.log(data);
    return data as ExtendedPost[];
  };

  const { data, fetchNextPage, hasNextPage, isSuccess } = useInfiniteQuery({
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
      console.log("fetch called");
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  return (
    <div className="">
      <h1>postfeed</h1>
      {/* <pre>{JSON.stringify(data?.pages)}</pre> */}
      {isSuccess &&
        data?.pages.map((page) =>
          page.map((post, i: number) => {
            if (page.length == i + 1) {
              return <Post inref={ref} post={post} />;
            } else {
              return <Post post={post} />;
            }
          })
        )}
    </div>
  );
}
