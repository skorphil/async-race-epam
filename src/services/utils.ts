export function handleFetchError(e: unknown): never {
  if (e instanceof Error) {
    throw Error(`${e.message}`);
  }
  throw Error("can't communicate with API");
}
