import { isWinner, isWinnersArray } from '@/model';
import { backendApi } from './apiService';
import type { Winner } from '@/model/winnerSchema';

type WinnerResponse = {
  id: number;
  wins: number;
  time: number;
};

type GetWinnersArgs = {
  page: number;
  limit: number;
  sort: 'id' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
};
type GetWinnersResponse = {
  winners: WinnerResponse[];
  totalCount: number;
};

export const winnersApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getWinners: builder.query<GetWinnersResponse, GetWinnersArgs>({
      providesTags: ['WinnersList'],
      query: ({ page = 1, limit = 7, sort = 'wins', order = 'ASC' }) => {
        const url = 'winners';
        const params = new URLSearchParams();
        params.append('_page', page.toString());
        params.append('_limit', limit.toString());
        params.append('_sort', sort);
        params.append('_order', order);
        return {
          url,
          params,
        };
      },
      async transformResponse(
        rawWinnersData,
        meta,
      ): Promise<GetWinnersResponse> {
        if (isWinnersArray(rawWinnersData)) {
          const totalCountHeader = meta?.response?.headers.get('X-Total-Count');
          return {
            winners: rawWinnersData,
            totalCount: totalCountHeader ? Number(totalCountHeader) : 0,
          };
        }
        throw Error('Server responded with unexpected data');
      },
    }),
    getWinner: builder.query<Winner, number>({
      providesTags: (_, __, id) => [{ type: 'Winner', id }],
      query: (id: number) => ({
        url: `winners/${id}`,
      }),
      async transformResponse(rawWinnerData): Promise<Winner> {
        if (isWinner(rawWinnerData)) {
          return rawWinnerData;
        }
        throw Error('Server responded with unexpected data');
      },
    }),
    updateWinner: builder.mutation<Winner, Winner>({
      query: (winnerData: Winner) => ({
        url: `/winners/${winnerData.id}`,
        method: 'PUT',
        body: winnerData,
      }),
      invalidatesTags: (_, __, winner) => [{ type: 'Winner', id: winner.id }],
    }),
    addWinner: builder.mutation<Winner, Winner>({
      query: (winnerData: Winner) => ({
        url: '/winners',
        method: 'POST',
        body: winnerData,
      }),
      invalidatesTags: ['WinnersList'],
    }),
    deleteWinner: builder.mutation<Winner, number>({
      query: (id: number) => ({
        url: `/winners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WinnersList'],
    }),
  }),
});
