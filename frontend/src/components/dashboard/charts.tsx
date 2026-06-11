"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis as RadialAngleAxis,
} from "recharts";

const PRIMARY = "#6366f1";

function scoreFill(value: number): string {
  if (value >= 85) return "#10b981";
  if (value >= 70) return "#3b82f6";
  if (value >= 45) return "#f59e0b";
  return "#f43f5e";
}

/** Radar chart of the five readiness sub-scores. */
export function ReadinessRadar({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          dataKey="value"
          stroke={PRIMARY}
          fill={PRIMARY}
          fillOpacity={0.35}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            fontSize: 12,
          }}
          formatter={(v: number) => [`${Math.round(v)} / 100`, "Score"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/** Horizontal bar chart for resume sub-scores (ATS, content, etc.). */
export function ScoreBars({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 46)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
        barCategoryGap={12}
      >
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          type="category"
          dataKey="label"
          width={110}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 12,
            fontSize: 12,
          }}
          formatter={(v: number) => [`${Math.round(v)} / 100`, "Score"]}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((d, i) => (
            <Cell key={i} fill={scoreFill(d.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Radial gauge for a single 0–100 score. */
export function RadialScore({ value }: { value: number }) {
  const data = [{ name: "score", value: Math.min(Math.max(value, 0), 100) }];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        data={data}
        startAngle={90}
        endAngle={-270}
        innerRadius="70%"
        outerRadius="100%"
      >
        <RadialAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" cornerRadius={20} fill={scoreFill(value)} background />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground"
          style={{ fontSize: 30, fontWeight: 800 }}
        >
          {Math.round(value)}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
