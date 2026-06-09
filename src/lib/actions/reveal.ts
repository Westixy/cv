export function revealOnScroll(node: HTMLElement) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add("visible");
        observer.unobserve(node);
      }
    },
    { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
  );

  node.classList.add("reveal-on-scroll");
  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    },
  };
}