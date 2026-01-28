import { useData } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trees, Leaf, AlertCircle, TrendingUp, Clock, BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function Forest() {
  const { getCategoryStats, getMonthlyData, sessions, loading } = useData();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const categoryStats = getCategoryStats();
  const monthlyData = getMonthlyData();
  const hasData = sessions.length > 0;

  const healthyCount = categoryStats.filter((s) => s.status === "healthy").length;
  const barrenCount = categoryStats.filter((s) => s.status === "barren").length;
  const totalMinutesThisMonth = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].minutes : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Trees className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Forest Overview</h1>
          <p className="text-muted-foreground">Your life at a glance</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Areas</CardTitle>
            <Leaf className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="text-healthy-count">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">Active in last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barren Areas</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive" data-testid="text-barren-count">{barrenCount}</div>
            <p className="text-xs text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-monthly-minutes">{totalMinutesThisMonth}</div>
            <p className="text-xs text-muted-foreground">Minutes focused</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Trees className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="mb-4 text-muted-foreground">No categories yet. Create some in the Garden!</p>
              <Link href="/garden">
                <Button data-testid="button-go-to-garden">Go to Garden</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStats.map((stat) => (
                <div
                  key={stat.category.id}
                  className="flex items-center gap-3 rounded-lg border p-4"
                  data-testid={`status-card-${stat.category.id}`}
                >
                  <div
                    className="h-10 w-10 rounded-lg"
                    style={{ backgroundColor: stat.category.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium truncate">{stat.category.name}</span>
                      <Badge
                        variant={stat.status === "healthy" ? "default" : "destructive"}
                        className="text-xs"
                        data-testid={`badge-status-${stat.category.id}`}
                      >
                        {stat.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.totalMinutes} min · {stat.doneCount} done · {stat.failedCount} failed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Focus Summary (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="mb-4 text-muted-foreground">No focus sessions recorded yet.</p>
              <Link href="/plant">
                <Button data-testid="button-add-first-session">Add Your First Session</Button>
              </Link>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                    label={{
                      value: "Minutes",
                      angle: -90,
                      position: "insideLeft",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar
                    dataKey="minutes"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="Minutes Focused"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
