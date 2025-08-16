import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TasksOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>Your task management overview</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Task functionality will be added here.
        </p>
      </CardContent>
    </Card>
  );
}
