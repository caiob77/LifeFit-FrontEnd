import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/app/_lib/auth-client";
import type {
  getHomeDataResponse,
  getUserTrainDataResponse,
} from "@/app/_lib/api/fetch-generated";

export async function requireAuth() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  return session.data!;
}

export function requireOnboarding(
  homeData: getHomeDataResponse,
  trainData: getUserTrainDataResponse,
) {
  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);

  if (needsOnboarding) redirect("/onboarding");
}
