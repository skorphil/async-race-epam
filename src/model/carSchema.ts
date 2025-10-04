import z from 'zod';

const CarSchema = z.object({
  name: z.string(),
  color: z.string(),
  id: z.number(),
});

const CarsArraySchema = z.array(CarSchema);

type Car = z.infer<typeof CarSchema>;

export { CarSchema, CarsArraySchema };
export type { Car };
