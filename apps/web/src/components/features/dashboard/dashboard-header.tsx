interface DashboardHeaderProps {
  user: { name?: string } | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {user?.name || "Guest"}
      </p>
    </div>
  );
}
