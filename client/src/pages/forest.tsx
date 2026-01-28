import { useState } from "react";
import { useData } from "@/hooks/use-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Trees, Leaf, AlertCircle, TrendingUp, Clock, Flower2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import forestImage from "@assets/2_1769582982463.png";

export default function Forest() {
  const { getCategoryStats, getMonthlyData, sessions, loading } = useData();
  const [, navigate] = useLocation();
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

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

  const handleAreaClick = (area: string) => {
    if (area === "garden") {
      navigate("/garden");
    } else if (area === "plant") {
      navigate("/plant");
    }
  };

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

      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your Productivity Landscape</CardTitle>
          <p className="text-sm text-muted-foreground">Click on different areas to explore</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative" data-testid="interactive-map">
            <img
              src={forestImage}
              alt="Forest Garden Plant landscape"
              className="w-full h-auto"
              data-testid="img-landscape"
            />
            
            <div
              className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${
                hoveredArea === "forest" ? "bg-primary/20 ring-2 ring-primary" : ""
              }`}
              style={{ top: "5%", left: "30%", width: "40%", height: "35%" }}
              onMouseEnter={() => setHoveredArea("forest")}
              onMouseLeave={() => setHoveredArea(null)}
              data-testid="area-forest"
            >
              {hoveredArea === "forest" && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg border flex items-center gap-2">
                  <Trees className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Forest - Overview</span>
                </div>
              )}
            </div>
            
            <div
              className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${
                hoveredArea === "garden" ? "bg-pink-500/20 ring-2 ring-pink-500" : ""
              }`}
              style={{ top: "25%", left: "5%", width: "35%", height: "45%" }}
              onClick={() => handleAreaClick("garden")}
              onMouseEnter={() => setHoveredArea("garden")}
              onMouseLeave={() => setHoveredArea(null)}
              data-testid="area-garden"
            >
              {hoveredArea === "garden" && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg border flex items-center gap-2">
                  <Flower2 className="h-4 w-4 text-pink-500" />
                  <span className="text-sm font-medium">Garden - Categories</span>
                </div>
              )}
            </div>
            
            <div
              className={`absolute cursor-pointer transition-all duration-300 rounded-lg ${
                hoveredArea === "plant" ? "bg-emerald-500/20 ring-2 ring-emerald-500" : ""
              }`}
              style={{ top: "40%", left: "50%", width: "45%", height: "55%" }}
              onClick={() => handleAreaClick("plant")}
              onMouseEnter={() => setHoveredArea("plant")}
              onMouseLeave={() => setHoveredArea(null)}
              data-testid="area-plant"
            >
              {hoveredArea === "plant" && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg border flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Plant - Sessions</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
