"use client";
import { UserMenu } from "@/components/layout/user-menu";
import { authClient } from "@/lib/auth-client";
import { useGetUsers } from "@/services/users/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  DashboardHeader,
  SecurityCard,
  TasksOverviewCard,
} from "@/components/features/dashboard";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: users } = useGetUsers();
  console.log("Users:", users);

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/sign-in");
    }
  }, [session, isPending]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader user={session?.user || null} />
        <UserMenu />
      </div>

      <SecurityCard twoFactorEnabled={session?.user.twoFactorEnabled!} />
      <TasksOverviewCard />
    </div>
  );
}
