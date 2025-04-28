"use client";

import { ReportRangePicker } from "@/components/reportRangePicker";
import { DataTypePicker } from "@/components/youtubeDataTypePicker";
import { twColors } from "@/lib/tailwind";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const PRIMARY_COLOR = twColors?.primary?.DEFAULT as string;

type AudienceGrowthProps = {
  metrics:
    | {
        [key: string]: number | string; // Add index signature
        date: string;
        subscribers_gained: number;
        views: number;

        watch_time_minutes: number;
      }[]
    | undefined;
};

export function AudienceGrowth({ metrics }: AudienceGrowthProps) {
  // This is the field that will be used to determine the type of data to display
  const [type, setType] = useState<"subscribers" | "views">("views");
  const [period, setPeriod] = useState<
    "annually" | "daily" | "monthly" | "weekly"
  >("weekly");

  if (!metrics) {
    return null;
  }

  const filteredData = formatData(metrics, type);
  const fittedData = fitDataToPeriod(period, filteredData);

  return (
    <div className="w-full rounded-sm border border-border p-3 text-sm">
      <div className="mb-8 flex justify-between">
        <div>
          <h2 className="font-medium">Audience Growth</h2>
          <p className="text-muted-foreground">
            See how your audience grew during the reporting period
          </p>
        </div>
        <div className="flex space-x-1">
          <DataTypePicker onChange={setType} type={type} />
          <ReportRangePicker onChange={setPeriod} period={period} />
        </div>
      </div>
      <ResponsiveContainer height={350} width="100%">
        <AreaChart
          data={fittedData}
          margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.8} />
              <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            className="stroke-border"
            syncWithTicks
            vertical={false}
          />
          <XAxis
            axisLine={false}
            dataKey="date"
            fontSize={12}
            padding={{ left: 10, right: 10 }} // Added padding
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            fontSize={12}
            padding={{ bottom: 10, top: 10 }} // Added padding
            tickFormatter={(value) => formatNumber(value)}
            tickLine={false}
          />
          <Tooltip
            animationDuration={75}
            content={<CustomTooltip type={type} />}
            cursor={{ strokeWidth: 1 }}
          />
          <Area
            activeDot={CustomActiveDot}
            dataKey="value"
            fill="url(#colorUv)"
            fillOpacity={1}
            isAnimationActive={false}
            stroke={PRIMARY_COLOR}
            strokeWidth={1}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function formatData(
  metrics: AudienceGrowthProps["metrics"],
  type: string,
) {
  if (!metrics) {
    return [];
  }

  // Filter data by period
  const filteredData = metrics
    .map((metric) => {
      const date = new Date(metric.date);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const dateString = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;

      const value = metric[type] as number;
      if (value === undefined) {
        return {
          date: dateString,
          value: 0,
        };
      }

      return {
        date: dateString,
        value: metric[type] as number,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateA - dateB;
    });

  return filteredData;
}

function CustomActiveDot({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      fill={PRIMARY_COLOR}
      r={5}
      stroke="white"
      strokeWidth={2}
      style={{ filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.4))" }}
    />
  );
}

function CustomTooltip({
  active,
  label,
  payload,
  type,
}: { type: string } & TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    return (
      <div className="w-36 rounded-md bg-background text-xs shadow-sm">
        <div className="rounded-t-sm border border-border bg-muted p-1">
          <p className="font-medium text-foreground">{label}</p>
        </div>
        <div className="flex items-center justify-between rounded-b-sm border border-t-0 border-border px-1 py-1.5">
          <div className="flex items-center justify-center">
            <div className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
            <p className="capitalize">{type}</p>
          </div>
          <p className="font-medium text-foreground">
            {payload?.[0] && formatNumber(payload?.[0].value)}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function fitDataToPeriod(
  period: "annually" | "daily" | "monthly" | "weekly",
  data: { date: string; value: number }[],
) {
  const dates = [];
  const now = new Date().setHours(0, 0, 0, 0);
  const start = new Date(now);

  const addTimeSlot = (date: Date, format: any) => {
    const dateString = date.toLocaleString("default", format);
    const timeSlot = { date: dateString, value: 0 };
    dates.push(timeSlot);
    data.forEach((dataPoint) => {
      if (
        new Date(dataPoint.date)
          .toISOString()
          .startsWith(date.toISOString().slice(0, format.year ? 7 : 10))
      ) {
        timeSlot.value = Number(dataPoint.value);
      }
    });
  };

  switch (period) {
    case "annually":
      for (let months = 12; months >= 0; months -= 1) {
        const date = new Date(start);
        date.setMonth(date.getMonth() - months);
        addTimeSlot(date, { month: "short", year: "numeric" });
      }
      break;

    case "daily":
      for (let hours = 0; hours <= 23; hours += 1) {
        const date = new Date(start.getTime() + hours * 60 * 60 * 1000);
        addTimeSlot(date, { hour: "2-digit", minute: "2-digit" });
      }
      dates.push({ date: "23:59", value: 0 });
      break;

    case "monthly":
      for (let days = 29; days >= 0; days -= 1) {
        const date = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
        addTimeSlot(date, { day: "numeric", month: "short" });
      }
      break;

    case "weekly":
      for (let days = 6; days >= 0; days -= 1) {
        const date = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
        addTimeSlot(date, { day: "numeric", month: "short" });
      }
      break;
    default:
      break;
  }

  return dates;
}

function formatNumber(num: any) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
