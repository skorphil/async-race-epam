import { isCar, isCarsArray, type Car } from '@/model';
import { backendApi } from './apiService';
import type { RootState } from '@/store/store';

type GetCarsArgs = {
  page: number;
  limit: number;
};

type GetCarsResponse = {
  cars: Car[];
  totalCount: number;
};

type UpdateCarPayload = {
  id: number;
  color?: string;
  name?: string;
};

export const garageApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query<GetCarsResponse, GetCarsArgs>({
      providesTags: ['CarList'],
      query: ({ page = 1, limit = 7 }) => {
        const url = 'garage';
        const params = new URLSearchParams();
        params.append('_page', page.toString());
        params.append('_limit', limit.toString());
        return {
          url,
          params,
        };
      },
      async transformResponse(rawCarsData, meta): Promise<GetCarsResponse> {
        if (isCarsArray(rawCarsData)) {
          const totalCountHeader = meta?.response?.headers.get('X-Total-Count');
          return {
            cars: rawCarsData,
            totalCount: totalCountHeader ? Number(totalCountHeader) : 0,
          };
        }
        throw Error('Server responded with unexpected data');
      },
    }),
    getCar: builder.query<Car, number>({
      providesTags: (_, __, id) => [{ type: 'Car', id }],
      query: (id: number) => ({
        url: `garage/${id}`,
      }),
      async transformResponse(rawCarsData): Promise<Car> {
        if (isCar(rawCarsData)) {
          return rawCarsData;
        }
        throw Error('Server responded with unexpected data');
      },
    }),

    createCar: builder.mutation<Car, Omit<Car, 'id'>>({
      query: (carData: Omit<Car, 'id'>) => ({
        url: 'garage',
        method: 'POST',
        body: carData,
      }),
      invalidatesTags: ['CarList'],
    }),
    deleteCar: builder.mutation<Car, number>({
      query: (id: number) => ({
        url: `garage/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CarList'],
    }),
    updateCar: builder.mutation<Car, UpdateCarPayload>({
      queryFn: async (arg, api, _extraOptions, baseQuery) => {
        const { id, ...car } = arg;

        const selectCurrentUser = garageApi.endpoints.getCar.select(id);

        const state = api.getState() as RootState;
        const currentUserQueryState = selectCurrentUser(state);

        const currentUserData = currentUserQueryState.data;

        if (!currentUserData) {
          return { error: { status: 404, data: 'User not found in cache' } };
        }

        // 4. Construct the complete payload for the PUT request
        const fullPayload = {
          ...currentUserData, // Current server state (id, name, sex)
          ...car, // Partial updates (e.g., only name)
        };

        // 5. Use the baseQuery to make the actual API call
        const result = await baseQuery({
          url: `garage/${id}`,
          method: 'PUT',
          body: fullPayload,
        });

        // 6. Return the result from the baseQuery
        return { data: result.data as Car };
      },
      // query: (car: Car) => ({
      //   url: `garage/${car.id}`,
      //   method: 'PUT',
      //   body: car,
      // }),
      invalidatesTags: (_, __, car) => [{ type: 'Car', id: car.id }],
    }),
  }),
});
