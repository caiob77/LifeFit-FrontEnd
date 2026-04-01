"use server";

import {
  startWorkoutSession,
  updateWorkoutSession,
} from "@/app/_lib/api/fetch-generated";

export type WorkoutSessionState =
  | { status: "idle" }
  | { status: "in_progress"; sessionId: string }
  | { status: "completed" };

export async function workoutSessionAction(
  prev: WorkoutSessionState,
  formData: FormData,
): Promise<WorkoutSessionState> {
  const workoutPlanId = formData.get("workoutPlanId") as string;
  const workoutDayId = formData.get("workoutDayId") as string;

  if (prev.status === "idle") {
    const result = await startWorkoutSession(workoutPlanId, workoutDayId);

    if (result.status === 201) {
      return {
        status: "in_progress",
        sessionId: result.data.userWorkoutSessionId,
      };
    }

    return prev;
  }

  if (prev.status === "in_progress") {
    await updateWorkoutSession(
      workoutPlanId,
      workoutDayId,
      prev.sessionId,
      { completedAt: new Date().toISOString() },
    );

    return { status: "completed" };
  }

  return prev;
}
