import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // adjust path
import { TrendingDown, TrendingUp } from "lucide-react";

export function StatsCard({ title, value, icon: Icon, trend, trendDown = false }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span className={`flex items-center gap-1 ${trendDown ? "text-red-500" : "text-green-500"}`}>
            {trendDown ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
            {trend}
          </span>
          <span className="ml-2">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
