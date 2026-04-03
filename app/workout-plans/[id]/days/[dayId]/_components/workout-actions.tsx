"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  workoutSessionAction,
  type WorkoutSessionState,
} from "../_actions";
import { useIncrementWorkoutStreak } from "@/app/utils/stats/mutations";

interface WorkoutActionsProps {
  workoutPlanId: string;
  workoutDayId: string;
  initialState: WorkoutSessionState;
  isToday: boolean;
}

export function WorkoutActions({
  workoutPlanId,
  workoutDayId,
  initialState,
  isToday,
}: WorkoutActionsProps) {
  const incrementStreak = useIncrementWorkoutStreak();
  const [state, dispatch, isPending] = useActionState(
    workoutSessionAction,
    initialState,
  );

  useEffect(() => {
    if (state.status === "completed") {
      incrementStreak();
    }
  }, [state.status, incrementStreak]);

  if (state.status === "completed") {
    return (
      <Button
        variant="ghost"
        disabled
        className="rounded-full px-4 py-2 font-heading text-sm font-semibold text-background/70 hover:bg-transparent hover:text-background/70"
      >
        Concluído!
      </Button>
    );
  }

  if (state.status === "in_progress") {
    return (
      <form action={dispatch}>
        <input type="hidden" name="workoutPlanId" value={workoutPlanId} />
        <input type="hidden" name="workoutDayId" value={workoutDayId} />
        <Button
          type="submit"
          variant="outline"
          disabled={isPending}
          className="rounded-full px-4 py-2 font-heading text-sm font-semibold"
        >
          {isPending ? "Finalizando..." : "Marcar como concluído"}
        </Button>
      </form>
    );
  }

  return (
    <form action={dispatch}>
      <input type="hidden" name="workoutPlanId" value={workoutPlanId} />
      <input type="hidden" name="workoutDayId" value={workoutDayId} />
      <Button
        type="submit"
        disabled={isPending || !isToday}
        title={!isToday ? "Disponível apenas no dia do treino" : undefined}
        className="rounded-full px-4 py-2 font-heading text-sm font-semibold"
      >
        {isPending ? "Iniciando..." : "Iniciar Treino"}
      </Button>
    </form>
  );
}
