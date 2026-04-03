"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { statsKeys } from "./query-keys";

export function useIncrementWorkoutStreak() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.setQueryData<number>(
      statsKeys.workoutStreak(),
      (old: number | undefined) => (old ?? 0) + 1,
    );
  }, [queryClient]);
}
