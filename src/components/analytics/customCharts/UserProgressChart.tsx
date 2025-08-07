"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const progressCategories = [
    { value: 0, label: "Not Started" },
    { value: 50, label: "In Progress" },
    { value: 100, label: "Completed" },
];

export default function UserProgressChart({ data }: { data: { user: string; progress: number }[] }) {
    // Hauteur dynamique, mais limitée pour mobile
    const chartHeight = Math.min(Math.max(48 * data.length, 240), 400);

    return (
        <div className="w-full overflow-x-auto">
            <div style={{ minWidth: 280, width: "100%", height: chartHeight, maxHeight: 300, maxWidth: 650 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: -20, right: 50, top: 0, bottom: 0 }}
                    >
                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            tick={{ fontSize: 12 }}
                            ticks={progressCategories.map(c => c.value)}
                            tickFormatter={(value: number) => {
                                const cat = progressCategories.find(c => c.value === value);
                                return cat ? cat.label : `${value}%`;
                            }}
                        />
                        <YAxis
                            textAnchor="end"
                            interval={0}
                            dataKey="userName"
                            type="category"
                            tick={{ fontSize: 12 }}
                            width={120}
                            tickFormatter={(value: string) =>
                                value.length > 14 ? value.slice(0, 14) + "…" : value
                            }
                        />
                        <Tooltip
                            content={({ active, payload, label }) =>
                                active && payload && payload.length ? (
                                    <div className="p-2 rounded bg-white shadow text-xs text-primary">
                                        <strong>{label}</strong>
                                        <div>Progress: {payload[0].value}%</div>
                                    </div>
                                ) : null
                            }
                        />
                        <Bar dataKey="progress" fill="#6366f1" maxBarSize={28}>
                            <LabelList
                                dataKey="progress"
                                position="right"
                                formatter={(value) => `${value}%`}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}