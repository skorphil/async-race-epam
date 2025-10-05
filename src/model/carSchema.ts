import z from 'zod';

/**
 * Expected car DTO from API
 */
const CarSchema = z.object({
  name: z.string(),
  color: z.string(),
  id: z.number(),
});

/**
 * Expected carsArray DTO from API
 */
const CarsArraySchema = z.array(CarSchema);

/**
 * Expected car DTO from API
 */
type Car = z.infer<typeof CarSchema>;

export { CarSchema, CarsArraySchema };
export type { Car };
