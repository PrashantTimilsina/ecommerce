"use client";

import { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categorySales, revenueData } from "../data";
import type { AdminProduct, AdminUser } from "../data";
import {
  getAllProductsAction,
  getAllUsersAction,
} from "@/action/admin/auth.action";

const COLORS = ["#18181b", "#52525b", "#a1a1aa", "#e4e4e7", "#71717a"];

export function DashboardView() {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      getAllUsersAction(undefined, 100),
      getAllProductsAction(undefined, 100),
    ]).then(([usersResult, productsResult]) => {
      if (cancelled) return;
      if (usersResult.status === "fulfilled" && usersResult.value?.status) {
        setUserCount((usersResult.value.data as AdminUser[]).length);
      } else {
        console.error(
          "Failed to fetch users:",
          usersResult.status === "rejected" ? usersResult.reason : undefined,
        );
      }
      if (productsResult.status === "fulfilled" && productsResult.value?.status) {
        setProductCount((productsResult.value.data as AdminProduct[]).length);
      } else {
        console.error(
          "Failed to fetch products:",
          productsResult.status === "rejected"
            ? productsResult.reason
            : undefined,
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      label: "Total Revenue",
      value: "Rs 245,360",
      delta: "+12.4%",
    },
    {
      label: "Total Users",
      value: String(userCount),
      delta: "registered users",
    },
    {
      label: "Products",
      value: String(productCount),
      delta: "in catalog",
    },
    {
      label: "Orders",
      value: "6,026",
      delta: "+5.1%",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-1.5">
            <CardContent className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  {stat.delta}
                </p>
              </div>
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 3v18h18" />
                  <path d="M7 12l4-4 4 4 5-5" />
                </svg>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 5, right: 5, left: -12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#18181b"
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e4e4e7"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#71717a" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#71717a" }}
                    tickFormatter={(v) => `Rs ${v / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `Rs ${Number(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e4e4e7",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#18181b"
                    strokeWidth={2}
                    fill="url(#revenueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySales}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {categorySales.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e4e4e7",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
              {categorySales.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 5, right: 5, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e4e4e7"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#71717a" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#71717a" }}
                />
                <Tooltip
                  cursor={{ fill: "#e4e4e7", fillOpacity: 0.5 }}
                  formatter={(value) => [
                    Number(value).toLocaleString(),
                    "Orders",
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e4e4e7",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#52525b"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
