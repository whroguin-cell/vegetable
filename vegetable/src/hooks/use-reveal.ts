import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const targets = node.querySelectorAll<HTMLElement>(".reveal");
    if (targets.length === 0) {
      observer.observe(node);
    } else {
      targets.forEach((t) => observer.observe(t));
    }

    return () => observer.disconnect();
  }, [options]);

  return ref;
}
