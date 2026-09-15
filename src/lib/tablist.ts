import type { KeyboardEvent } from "react";

export function moveTablist<T extends { id: string }>(
  event: KeyboardEvent,
  items: readonly T[],
  currentId: string,
  setId: (id: string) => void,
  tabId: (id: string) => string,
) {
  const keys = [
    "ArrowDown",
    "ArrowUp",
    "ArrowRight",
    "ArrowLeft",
    "Home",
    "End",
  ];
  if (!keys.includes(event.key)) return;

  const index = items.findIndex((item) => item.id === currentId);
  if (index < 0) return;

  event.preventDefault();

  let next = index;
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    next = (index + 1) % items.length;
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    next = (index - 1 + items.length) % items.length;
  } else if (event.key === "Home") {
    next = 0;
  } else if (event.key === "End") {
    next = items.length - 1;
  }

  const item = items[next];
  if (!item) return;
  setId(item.id);
  requestAnimationFrame(() => {
    document.getElementById(tabId(item.id))?.focus();
  });
}
