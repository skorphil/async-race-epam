import { CarsArraySchema, CarSchema, type Car } from './carSchema';
import { WinnersArraySchema, WinnerSchema, type Winner } from './winnerSchema';

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

function isWinner(object: unknown): object is Winner {
  const result = WinnerSchema.safeParse(object);
  if (!result.success) {
    return false;
  }
  return true;
}

function isWinnersArray(object: unknown): object is Winner[] {
  const result = WinnersArraySchema.safeParse(object);
  if (!result.success) {
    return false;
  }
  return true;
}

export { isCarsArray, isCar, isWinnersArray, isWinner };
