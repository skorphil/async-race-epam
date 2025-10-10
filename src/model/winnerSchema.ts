import z from 'zod';

/**
 * Expected car DTO from API
 */
const WinnerSchema = z.object({
  time: z.number(),
  wins: z.number(),
  id: z.number(),
});

/**
 * Expected winnerArray DTO from API
 */
const WinnersArraySchema = z.array(WinnerSchema);

/**
 * Expected winner DTO from API
 */
type Winner = z.infer<typeof WinnerSchema>;

export { WinnerSchema, WinnersArraySchema };
export type { Winner };
