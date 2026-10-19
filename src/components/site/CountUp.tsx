import { useEffect, useMemo, useRef, useState } from "react";

const DURATION_MS = 1_500;
const STAGGER_MS = 180;

function parseCount(value: string) {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  const target = Number(match[2]?.replaceAll(",", ""));
  if (!Number.isFinite(target)) return null;

  return {
    prefix: match[1] ?? "",
    target,
    suffix: match[3] ?? "",
    decimals: match[2]?.split(".")[1]?.length ?? 0,
  };
}

function formatCount(value: number, decimals: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function CountUp({ value, index = 0 }: { value: string; index?: number }) {
  const number = useMemo(() => parseCount(value), [value]);
  const target = number?.target;
  const elementRef = useRef<HTMLParagraphElement>(null);
  const [count, setCount] = useState(number?.target ?? 0);

  useEffect(() => {
    if (target === undefined || !elementRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setCount(target);
      return;
    }

    let frame = 0;
    let observer: IntersectionObserver | undefined;

    const animate = () => {
      setCount(0);
      const startAt = performance.now() + index * STAGGER_MS;

      const tick = (now: number) => {
        if (now < startAt) {
          frame = window.requestAnimationFrame(tick);
          return;
        }

        const progress = Math.min((now - startAt) / DURATION_MS, 1);
        const eased = 1 - (1 - progress) ** 3;
        setCount(target * eased);

        if (progress < 1) frame = window.requestAnimationFrame(tick);
        else setCount(target);
      };

      frame = window.requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      animate();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer?.disconnect();
          animate();
        },
        { threshold: 0.35 },
      );
      observer.observe(elementRef.current);
    }

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [index, target]);

  if (!number)
    return <p className="display-xl text-4xl leading-none text-electric sm:text-5xl">{value}</p>;

  return (
    <p
      ref={elementRef}
      aria-label={value}
      className="display-xl text-4xl leading-none text-electric sm:text-5xl"
    >
      <span aria-hidden="true">
        {number.prefix}
        {formatCount(count, number.decimals)}
        {number.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </p>
  );
}
