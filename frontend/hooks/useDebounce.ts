// import { debounce } from "lodash";
import React from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// export const useDebounceCallback = <T extends (...args: any[]) => void>(
//   callback: T,
//   delay = 500,
// ) => {
//   const debounced = useMemo(() => debounce(callback, delay), [callback, delay]);

//   useEffect(() => {
//     return () => {
//       debounced.cancel();
//     };
//   }, [debounced]);

//   return debounced;
// };
