"use client";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { AnimatedValue } from "@/components/motion/animated-value";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { analytics, type Data, money } from "./model";
import { Badge, Blank, Panel } from "./ui";

export function Revenue({ data, days = 7 }: { data: Data; days?: number }) {
  const a = analytics(data, days);
  return (
    <Panel
      title="A fresh perspective on revenue"
      description={`Demo payments received · last ${days} days`}
      action={
        <span className="ps-chart-total">
          <AnimatedValue text={money(a.paid)} />
        </span>
      }
    >
      <ChartContainer className="h-56 w-full" config={{ paid: { label: "Paid revenue", color: "var(--primary)" } }}>
        <AreaChart key={days} data={a.revenue} accessibilityLayer margin={{ left: 0, right: 12, top: 15 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 5" />
          <XAxis
            tick={{ fill: "var(--muted-foreground)" }}
            dataKey="date"
            tickLine={false}
            axisLine={false}
            minTickGap={20}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)" }}
            width={45}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `R${v}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="paid"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.08}
            strokeWidth={2.5}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </Panel>
  );
}
export function ServiceChart({ data, days }: { data: Data; days: number }) {
  const { services } = analytics(data, days);
  const ranked = [...services].sort((a, b) => b.orders - a.orders);
  const maximum = Math.max(...ranked.map((s) => s.orders), 0);
  const balanced = ranked.every((s) => s.orders === maximum);
  return (
    <Panel
      id="service-demand"
      title="What customers are booking"
      description="Orders containing each service"
      action={<Badge variant="secondary">{days} days</Badge>}
    >
      {maximum > 0 ? (
        <>
          <div className="ps-service-heading">
            <span>SERVICE</span>
            <span>ORDERS</span>
          </div>
          <ChartContainer className="h-40 w-full" config={{ orders: { label: "Orders", color: "var(--primary)" } }}>
            <BarChart
              key={days}
              data={ranked}
              layout="vertical"
              accessibilityLayer
              margin={{ top: 8, right: 26, bottom: 8, left: 0 }}
              barSize={12}
            >
              <XAxis type="number" hide domain={[0, maximum * 1.18]} />
              <YAxis
                type="category"
                dataKey="name"
                width={104}
                tick={{ fill: "var(--foreground)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar
                dataKey="orders"
                fill="var(--primary)"
                radius={6}
                background={{ fill: "var(--muted)", radius: 6 }}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="orders"
                  position="right"
                  offset={10}
                  fill="var(--foreground)"
                  fontSize={12}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
          <div className="ps-service-insight">
            <span className="ps-service-dot" />
            <div>
              <strong>{balanced ? "A balanced mix" : `${ranked[0].name} leads the way`}</strong>
              <p>
                {balanced
                  ? `Each service appears in ${maximum} orders this period.`
                  : `${maximum} orders include your most-booked service.`}
              </p>
            </div>
          </div>
          <p className="ps-service-note">An order can include more than one service.</p>
        </>
      ) : (
        <Blank title="No service activity yet" description="Try a longer date range or create a laundry order." />
      )}
    </Panel>
  );
}
