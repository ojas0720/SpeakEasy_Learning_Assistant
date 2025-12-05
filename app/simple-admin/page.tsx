"use client";

import { useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function SimpleAdmin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === "admin123" && pass === "1234") setAuthed(true);
    else alert("Invalid credentials");
  };

  const usersOverTime = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "New Learners",
          data: [3, 6, 5, 8, 12, 18, 25],
          borderColor: "#10b981",
          backgroundColor: "rgba(16,185,129,0.25)",
        },
      ],
    }),
    []
  );

  const courseShare = useMemo(
    () => ({
      labels: ["Spanish", "French", "German", "Hindi", "Kannada", "Tamil"],
      datasets: [
        {
          label: "Active Learners",
          data: [120, 60, 55, 38, 25, 31],
          backgroundColor: [
            "#34d399",
            "#22d3ee",
            "#60a5fa",
            "#f59e0b",
            "#f97316",
            "#a78bfa",
          ],
        },
      ],
    }),
    []
  );

  if (!authed)
    return (
      <div className="mx-auto max-w-md p-6">
        <h1 className="mb-4 text-2xl font-bold">Admin Login</h1>
        <form className="space-y-3" onSubmit={handleLogin}>
          <input
            placeholder="Username"
            className="w-full rounded-md border p-2"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            className="w-full rounded-md border p-2"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <button className="w-full rounded-md bg-emerald-600 p-2 font-medium text-white hover:bg-emerald-700">
            Login
          </button>
        </form>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-extrabold">Analytics Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-2 font-semibold">New Learners (last 7 days)</h2>
          <Line data={usersOverTime} />
        </div>
        <div className="rounded-xl border bg-white p-4">
          <h2 className="mb-2 font-semibold">Active Learners by Course</h2>
          <Bar data={courseShare} />
        </div>
      </div>
    </div>
  );
}
