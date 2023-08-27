export const VoteType = {
  UP: "UP",
  DOWN: "DOWN",
} as const;
export type VoteType = (typeof VoteType)[keyof typeof VoteType];
