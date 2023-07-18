"use client";

import { useMemo, useState } from "react";
import { Button } from "./ui/button";

interface Test2Props {}

export default function Test2({}: Test2Props) {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{count}</h1>
      <h1>{initialize}</h1>
      <Button
        onClick={() => {
          setCount((count) => count + 1);
        }}
      >
        count+1
      </Button>
    </>
  );
}
