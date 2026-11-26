import { useEffect, useRef, useState } from "react";

// Counts smoothly from the number currently shown to `target`.
export default function useAnimatedNumber(target, ms = 500) {
  const [value, setValue] = useState(target);
  const shown = useRef(target);

  useEffect(() => {
    const begin = shown.current;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      shown.current = Math.round(begin + (target - begin) * t);
      setValue(shown.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}
