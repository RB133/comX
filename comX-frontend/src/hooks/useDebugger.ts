import { useEffect } from "react";

export const useDebugger = (condition: any) => {
  useEffect(() => {
    console.log(condition);
  }, [condition]);
};
