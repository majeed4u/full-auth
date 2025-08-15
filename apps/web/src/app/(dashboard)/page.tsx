"use client";
import UserMenu from "@/components/user-menu";
import { authClient } from "@/lib/auth-client";
import { useGetUsers } from "@/services/users/queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      <UserMenu />
    </div>
  );
}
