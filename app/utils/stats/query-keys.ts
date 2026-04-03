export const statsKeys = {
  all: ["stats"] as const,
  workoutStreak: () => [...statsKeys.all, "workout-streak"] as const,
};
