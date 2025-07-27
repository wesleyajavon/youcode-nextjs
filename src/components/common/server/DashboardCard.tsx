import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export async function DashboardCard({
  stats
}: {
  stats: { icon: React.ReactNode; label: string; value: number | string }[];
}) {

        // await new Promise(res => setTimeout(res, 5000));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="h2">Dashboard</Typography>
        </CardTitle>
        <CardDescription>Quick stats</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {stats.map((stat, i) => (
          <Typography key={i} variant="small">
            {stat.icon}
            <span className="ml-2">{stat.label}: {stat.value}</span>
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}