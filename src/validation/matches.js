import { z } from 'zod';

export const MATCH_STATUS = {
  SCHEDULED: 'SCHEDULED',
  LIVE: 'LIVE',
  FINISHED: 'FINISHED',
};
export const listMatchesQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int('Limit must be an integer')
    .positive('Limit must be a positive number')
    .max(100, 'Limit must be 100 or less')
    .optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int('ID must be an integer').positive('ID must be a positive number'),
});

const isoDateString = z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Value must be a valid ISO date string',
});

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1, 'Sport is required'),
    homeTeam: z.string().trim().min(1, 'Home team is required'),
    awayTeam: z.string().trim().min(1, 'Away team is required'),
    startTime: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'startTime must be a valid ISO date string',
    }),
    endTime: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'endTime must be a valid ISO date string',
    }),
    homeScore: z.coerce.number().int('Home score must be an integer').nonnegative('Home score must be non-negative').optional(),
    awayScore: z.coerce.number().int('Away score must be an integer').nonnegative('Away score must be non-negative').optional(),
  })
  .superRefine((data, ctx) => {
    if (Date.parse(data.endTime) <= Date.parse(data.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'endTime must be chronologically after startTime',
      });
    }
  });

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int('Home score must be an integer').nonnegative('Home score must be non-negative'),
  awayScore: z.coerce.number().int('Away score must be an integer').nonnegative('Away score must be non-negative'),
});

export default {
  MATCH_STATUS,
  listMatchesQuerySchema,
  matchIdParamSchema,
  createMatchSchema,
  updateScoreSchema,
};
