import { isCar, isCarsArray, type Car } from '@/model';
import { handleFetchError } from './utils';

const baseUrl = 'http://localhost:3000';

/**
 * Returns list of the cars
 * @param page page number where car belongs to
 * @param limit cars per page
 * @returns validated Car list and total number of cars
 */
const getCars = async (page?: number, limit = 7) => {
  try {
    const url = page
      ? `${baseUrl}/garage?_page=${page}&_limit=${limit}`
      : `${baseUrl}/garage`;
    const response = await fetch(url);
    const carsArray = await response.json();
    const totalCount = response.headers.get('X-Total-Count');
    if (isCarsArray(carsArray)) {
      return {
        cars: carsArray,
        totalCount: totalCount ? Number(totalCount) : 0,
      };
    }
    throw Error('Invalid response data');
  } catch (e) {
    return handleFetchError(e);
  }
};

const getCar = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/garage/${id}`);
    if (response.status === 404) {
      throw Error(`Car with id: ${id} not found.`);
    }
    const result = await response.json();
    if (isCar(result)) {
      return result;
    }
    throw Error('Invalid response data');
  } catch (e) {
    return handleFetchError(e);
  }
};

const createCar = async (car: Omit<Car, 'id'>) => {
  try {
    const response = await fetch(`${baseUrl}/garage`, {
      method: 'POST',
      body: JSON.stringify(car),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (isCar(result)) {
      return result;
    }
    throw Error('Invalid response data');
  } catch (e) {
    return handleFetchError(e);
  }
};

const deleteCar = async (id: number) => {
  try {
    await fetch(`${baseUrl}/garage/${id}`, {
      method: 'DELETE',
    });
    return true;
  } catch (e) {
    return handleFetchError(e);
  }
};

const updateCar = async (id: number, car: Car) => {
  try {
    const response = await fetch(`${baseUrl}/garage/${id}`, {
      method: 'PUT',
      body: JSON.stringify(car),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (isCar(data)) {
      return data;
    }
    throw Error('Invalid response data');
  } catch (e) {
    return handleFetchError(e);
  }
};

export default { getCars, getCar, createCar, deleteCar, updateCar };
