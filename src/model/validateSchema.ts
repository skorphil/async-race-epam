import { CarsArraySchema, CarSchema, type Car } from './carSchema';

/**
 * Type predicate for checking car api DTO
 */
function isCarsArray(object: unknown): object is Car[] {
  const result = CarsArraySchema.safeParse(object);
  if (!result.success) {
    return false;
  }
  return true;
}

/**
 * Type predicate for checking car api DTO
 */
function isCar(object: unknown): object is Car {
  const result = CarSchema.safeParse(object);
  if (!result.success) {
    return false;
  }
  return true;
}

export { isCarsArray, isCar };
