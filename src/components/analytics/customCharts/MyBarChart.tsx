'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function MyBarChart({ data }: { data: Object[] }) {
    const chartHeight = Math.min(Math.max(48 * data.length, 240), 400);

    return (
        <div className="w-full overflow-x-auto">
            <div style={{ minWidth: 320, width: "100%", height: chartHeight, maxHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 20, left: -20, bottom: 40 }}
                    >
                        <XAxis
                            dataKey="name"
                            interval={0}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value: string) =>
                                value.length > 12 ? value.slice(0, 12) + "…" : value
                            }
                            angle={-30}
                            textAnchor="end"
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            content={({ active, payload, label }) =>
                                active && payload && payload.length ? (
                                    <div className="p-2 rounded bg-white shadow text-xs text-primary">
                                        <strong>{label}</strong>
                                        <div>Users: {payload[0].value}</div>
                                    </div>
                                ) : null
                            }
                        />
                        <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

