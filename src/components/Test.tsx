"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface TestProps {}
const LIMIT = 10;

export default function Test({}: TestProps) {
  const { ref, inView } = useInView();

  const fetchTodos = async ({ pageParam = 1 }: any) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}&_limit=${LIMIT}`
    );
    let data = await response.json();
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isSuccess } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.length === LIMIT ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div>
        {isSuccess &&
          data?.pages.map((page) =>
            page.map((todo: any, i: number) => {
              if (page.length == i + 1) {
                return (
                  <div
                    ref={ref}
                    className="m-3 rounded-xl border-4 border-blue-600 bg-blue-400 p-2"
                  >
                    <pre>{JSON.stringify(todo, null, 2)}</pre>
                  </div>
                );
              } else {
                return (
                  <div className="m-3 rounded-xl border-4 border-blue-600 bg-blue-400 p-2">
                    <pre>{JSON.stringify(todo, null, 2)}</pre>
                  </div>
                );
              }
            })
          )}
      </div>
      <button
        className="bg-violet-400"
        onClick={() => {
          if (hasNextPage) fetchNextPage();
        }}
      >
        load more
      </button>
    </>
  );
}
