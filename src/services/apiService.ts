import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://localhost:3000';

export const backendApi = createApi({
  reducerPath: 'api',
  tagTypes: ['CarList', 'Car', 'WinnersList', 'Winner'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: () => ({}),
});
