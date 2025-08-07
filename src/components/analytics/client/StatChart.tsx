'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/common/card";
import { Typography } from "@/components/ui/common/typography";
import { StatChartProps } from "@/types/chart";
import React from "react";


export default function StatChart({
    data,
    ChartComponent,
    chartProps,
    cardDescription,
    subDescription1,
    subDescription2,
}: StatChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">Analytics 📈</Typography>
                </CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <span>
                    <Typography variant="large">
                        {subDescription1}
                    </Typography>
                </span>
                <span className="mb-6 hidden sm:block">
                    <Typography variant="p">
                        {subDescription2}
                    </Typography>
                </span>
                <div className="w-full h-80 bg-card rounded-xl p-4">
                    <ChartComponent data={data} {...chartProps} />
                </div>
            </CardContent>
        </Card>
    );
}