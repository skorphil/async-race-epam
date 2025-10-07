import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { isCar, isCarsArray, type Car } from '@/model';

const baseUrl = 'http://localhost:3000/garage';

type GetCarsArgs = {
  page: number;
  limit: number;
};

type GetCarsResponse = {
  cars: Car[];
  totalCount: number;
};

export const garageApi = createApi({
  reducerPath: 'garageApi',
  tagTypes: ['CarList', 'Car'],
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCars: builder.query<GetCarsResponse, GetCarsArgs>({
      providesTags: ['CarList'],
      query: ({ page = 1, limit = 7 }) => {
        const url = '/';
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
        url: `/${id}`,
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
        url: '/',
        method: 'POST',
        body: carData,
      }),
      invalidatesTags: ['CarList'],
    }),
    deleteCar: builder.mutation<Car, number>({
      query: (id: number) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CarList'],
    }),
    updateCar: builder.mutation<Car, Car>({
      query: (car: Car) => ({
        url: `/${car.id}`,
        method: 'PUT',
        body: car,
      }),
      invalidatesTags: (_, __, car) => ['CarList', { type: 'Car', id: car.id }],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useCreateCarMutation,
  useDeleteCarMutation,
  useGetCarQuery,
  useUpdateCarMutation,
} = garageApi;
