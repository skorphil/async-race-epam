export function debounce<A extends unknown[], R>(
  func: (...args: A) => R,
  timeout = 300,
): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), timeout);
  };
}
