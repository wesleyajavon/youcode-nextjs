import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/common/card";
import { Typography } from "@/components/ui/common/typography";

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
          <Typography variant="h2">Your Dashboard 📊</Typography>
        </CardTitle>
        <CardDescription>Quick stats</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <span>
          <Typography variant="large">
            👋 Hey, welcome to YouCode!  
          </Typography>
        </span>
        <span className="mb-6">
          <Typography variant="p">
            Here are some quick stats about your courses and lessons 👀
          </Typography>
        </span>
        
        <div className="bg-muted/60 rounded-lg p-4 flex flex-col gap-2">
          {stats.map((stat, i) => (
            <Typography key={i} variant="small">
              {stat.icon}
              <span className="ml-2">{stat.label}: {stat.value}</span>
            </Typography>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}