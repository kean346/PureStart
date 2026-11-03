"use client";

import { Banknote, TrendingUp, UserPlus, Users, Waves } from "lucide-react";

import { AnimatedValue } from "@/components/motion/animated-value";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 sm:grid-cols-2 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs xl:grid-cols-5">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>
            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
              <Banknote className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Recurring revenue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-3xl leading-none font-medium tracking-tight tabular-nums">
              <AnimatedValue text="R 184,250.00" />
            </div>
            <Badge>
              <TrendingUp className="size-3" />
              +8.2%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Monthly recurring revenue · ZAR</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
              <UserPlus className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>New clients</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-3xl leading-none font-medium tracking-tight tabular-nums">
              <AnimatedValue text="1,486" />
            </div>
            <Badge variant="secondary">
              <TrendingUp className="size-3" />
              +14.6%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">New relationships across the region</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
              <Users className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Active workspaces</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-3xl leading-none font-medium tracking-tight tabular-nums">
              <AnimatedValue text="13,842" />
            </div>
            <Badge>
              <TrendingUp className="size-3" />
              +6.8%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Engagement exceeds targets</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-lg border">
              <Waves className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Revenue growth</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-3xl leading-none font-medium tracking-tight tabular-nums">
              <AnimatedValue text="8.2%" />
            </div>
            <Badge>
              <TrendingUp className="size-3" />
              +1.3pp
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Compared with the previous month</p>
        </CardContent>
      </Card>
    </div>
  );
}
