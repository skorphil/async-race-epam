import { CarsArraySchema, CarSchema, type Car } from './carSchema';

function isCarsArray(object: unknown): object is Car[] {
  const result = CarsArraySchema.safeParse(object);
  if (!result.success) {
    return false;
  }
  return true;
}
function isCar(object: unknown): object is Car {
  const result = CarSchema.safeParse(object);
  if (!result.success) {
    return false;
  }
  return true;
}

export { isCarsArray, isCar };
