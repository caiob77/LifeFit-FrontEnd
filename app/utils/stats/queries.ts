"use client";

import { useQuery } from "@tanstack/react-query";
import { statsKeys } from "./query-keys";

export function useWorkoutStreak(initialData: number) {
  return useQuery({
    queryKey: statsKeys.workoutStreak(),
    queryFn: () => Promise.resolve(initialData),
    initialData,
    staleTime: Infinity,
  });
}
