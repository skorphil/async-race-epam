import { afterEach, describe, expect, it, vi } from 'vitest';

import cars from '../garageService';

describe('getCars', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return data if valid response received', async () => {
    const body = [
      {
        name: 'Tesla',
        color: '#e6e6fa',
        id: 1,
      },
      {
        name: 'BMW',
        color: '#fede00',
        id: 2,
      },
    ];
    const mockResponse = new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'X-Total-Count': String(body.length) },
    });
    const mockFetch = vi.fn(() => mockResponse);

    vi.stubGlobal('fetch', mockFetch);
    expect(await cars.getCars()).toEqual({
      cars: body,
      totalCount: body.length,
    });
  });

  it('should throw Error if not valid response received', async () => {
    const wrongBody = [
      {
        name: 'Tesla',
        color: '#e6e6fa',
      },
      {
        name: 'BMW',
        color: '#fede00',
        id: 2,
      },
    ];
    const mockResponse = new Response(JSON.stringify(wrongBody), {
      status: 200,
    });
    const mockFetch = vi.fn(() => mockResponse);
    vi.stubGlobal('fetch', mockFetch);

    await expect(cars.getCars()).rejects.toThrowError(/invalid/i);
  });
});

describe('getCar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should return data if valid id provided', async () => {
    const body = {
      name: 'Tesla',
      color: '#e6e6fa',
      id: 1,
    };
    const mockResponse = new Response(JSON.stringify(body), { status: 200 });
    const mockFetch = vi.fn(() => mockResponse);

    vi.stubGlobal('fetch', mockFetch);
    expect(await cars.getCar(1)).toEqual(body);
  });

  it('should throw descriptive Error if desired id not found', async () => {
    const wrongBody = {};
    const mockResponse = new Response(JSON.stringify(wrongBody), {
      status: 404,
    });
    const mockFetch = vi.fn(() => mockResponse);
    vi.stubGlobal('fetch', mockFetch);

    await expect(cars.getCar(2)).rejects.toThrowError(/not found/i);
  });
});

describe('createCar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should return same data if valid id provided', async () => {
    const body = {
      name: 'Tesla',
      color: '#e6e6fa',
      id: 1,
    };
    const mockResponse = new Response(JSON.stringify(body), { status: 200 });
    const mockFetch = vi.fn(() => mockResponse);

    vi.stubGlobal('fetch', mockFetch);
    expect(
      await cars.createCar({ name: body.name, color: body.color }),
    ).toEqual(body);
  });

  describe('createCar', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });
    it('should return same data if valid data provided', async () => {
      const body = {
        name: 'Tesla',
        color: '#e6e6fa',
        id: 2,
      };
      const mockResponse = new Response(JSON.stringify(body), { status: 200 });
      const mockFetch = vi.fn(() => mockResponse);

      vi.stubGlobal('fetch', mockFetch);
      expect(await cars.updateCar(2, body)).toEqual(body);
    });
  });
});
