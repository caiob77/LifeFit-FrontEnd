import dayjs from "dayjs";
import Link from "next/link";
import { getHomeData, getUserTrainData } from "@/app/_lib/api/fetch-generated";
import { requireAuth, requireOnboarding } from "@/app/_lib/guards";
import { ConsistencyTracker } from "@/app/_components/consistency-tracker";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { BottomNav } from "@/app/_components/bottom-nav";

export default async function HomePage() {
  const sessionData = await requireAuth();

  const today = dayjs();
  const [homeData, trainData] = await Promise.all([
    getHomeData(today.format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  requireOnboarding(homeData, trainData);

  if (homeData.status !== 200) throw new Error("Failed to fetch home data");

  const { todayWorkoutDay, workoutStreak, consistencyByDay } = homeData.data;
  const firstName = sessionData.user.name?.split(" ")[0];

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-14 items-center px-5">
        <p
          className="text-[22px] uppercase leading-[1.15] text-foreground"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Fit.ai
        </p>
      </div>

      <div className="flex flex-col gap-6 px-5">
        <div>
          <p className="font-heading text-sm text-muted-foreground">
            {workoutStreak > 0
              ? `${workoutStreak} dias seguidos 🔥`
              : "Comece sua sequência hoje!"}
          </p>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Olá, {firstName}!
          </h1>
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
            Treino de Hoje
          </h2>
          {todayWorkoutDay ? (
            <Link
              href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
            >
              <WorkoutDayCard
                name={todayWorkoutDay.name}
                weekDay={todayWorkoutDay.weekDay}
                estimatedDurationInSeconds={
                  todayWorkoutDay.estimatedDurationInSeconds
                }
                exercisesCount={todayWorkoutDay.exercisesCount}
                coverImageUrl={todayWorkoutDay.coverImageUrl}
              />
            </Link>
          ) : (
            <div className="flex h-[200px] items-center justify-center rounded-xl bg-muted">
              <p className="font-heading text-muted-foreground">
                Sem treino programado para hoje
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 font-heading text-lg font-semibold text-foreground">
            Consistência
          </h2>
          <ConsistencyTracker
            consistencyByDay={consistencyByDay}
            today={today}
          />
        </div>
      </div>

      <BottomNav activePage="home" />
    </div>
  );
}
