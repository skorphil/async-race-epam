import { backendApi } from './apiService';

type Engine = {
  velocity: number;
  distance: number;
};

export const engineApi = backendApi.injectEndpoints({
  endpoints: (build) => ({
    startEngine: build.mutation<Engine, number>({
      query: (id: number) => ({
        url: `engine?id=${id}&status=${'started'}`,
        method: 'PATCH',
      }),
    }),
    stopEngine: build.mutation<Engine, number>({
      query: (id: number) => ({
        url: `engine?id=${id}&status=${'stopped'}`,
        method: 'PATCH',
      }),
    }),
    startDrive: build.mutation<void, number>({
      query: (id: number) => ({
        url: `engine?id=${id}&status=${'drive'}`,
        responseHandler: (response) => {
          if ([404, 500].includes(response.status)) return response.text();
          return response.json();
        },
        method: 'PATCH',
      }),
    }),
  }),
});
