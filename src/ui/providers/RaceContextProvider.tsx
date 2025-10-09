import { createContext, useRef, type ReactElement } from 'react';

type RtkAbortablePromise = Promise<any> & {
  abort: () => void;
};

export const RaceContext = createContext<Record<number, RtkAbortablePromise>>(
  {},
);

export function RaceContextProvider({ children }: { children: ReactElement }) {
  const ongoingRequests = useRef<Record<number, RtkAbortablePromise>>({});

  return (
    <RaceContext.Provider value={ongoingRequests.current}>
      {children}
    </RaceContext.Provider>
  );
}
