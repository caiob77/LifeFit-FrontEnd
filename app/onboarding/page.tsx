import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import dayjs from "dayjs";
import { authClient } from "@/app/_lib/auth-client";
import { getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { Chat } from "@/app/_components/chat";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const [homeData, trainData] = await Promise.all([
    getHomeData(dayjs().format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (
    homeData.status === 200 &&
    trainData.status === 200 &&
    homeData.data.activeWorkoutPlanId &&
    trainData.data
  ) {
    redirect("/");
  }

  return (
    <div className="flex min-h-svh flex-col">
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <p
          className="text-[22px] uppercase leading-[1.15] text-foreground"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Fit.ai
        </p>
        <Link
          href="/"
          className="rounded-full bg-primary px-4 py-2 font-heading text-sm font-semibold text-primary-foreground"
        >
          Acessar FIT.AI
        </Link>
      </div>

      <div className="flex flex-1 flex-col">
        <Chat embedded initialMessage="Quero começar a melhorar minha saúde!" />
      </div>
    </div>
  );
}
