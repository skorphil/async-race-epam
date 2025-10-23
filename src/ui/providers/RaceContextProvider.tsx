import { createContext, useRef, type ReactElement } from 'react';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { Engine } from '@/services/engineService';

type RtkAbortablePromise = Promise<{
  data?: Engine | void;
  error?: undefined | SerializedError | FetchBaseQueryError;
}> & {
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
