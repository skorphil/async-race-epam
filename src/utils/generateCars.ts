import type { Car } from '@/model';

const carNamesP1 = [
  'Tesla',
  'Mercedes-Benz',
  'BMW',
  'Audi',
  'Lexus',
  'Porsche',
  'Ferrari',
  'Lamborghini',
  'McLaren',
  'Aston Martin',
];

const carNamesP2 = [
  'Model S',
  'C-Class',
  'X5',
  'A4',
  'RX',
  '911',
  '488 GTB',
  'Huracan',
  '720S',
  'Vantage',
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generateCars(count: number): Omit<Car, 'id'>[] {
  return Array.from({ length: count }, () => {
    const name = `${getRandomItem(carNamesP1)} ${getRandomItem(carNamesP2)}`;
    const color = getRandomColor();
    return { name, color };
  });
}
