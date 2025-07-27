"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { SearchInput } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import clsx from "clsx"; // Si tu utilises clsx, sinon remplace par une fonction utilitaire ou des templates


async function fetchLessons(courseId: string, page: number, limit: number, search: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/user/courses/${courseId}/lessons?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch lessons");
    return res.json();
}

enum Progress {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}

type Lesson = {
    id: string
    name: string
    rank: string
    progress: Progress
}

type LessonsResponse = {
    data: Lesson[]
    course: {
        name: string
        image: string
    }
    page: number
    limit: number
    total: number
}

function getProgressBadgeColor(progress: Progress) {
    switch (progress) {
        case Progress.COMPLETED:
            return "bg-green-500 text-white";
        case Progress.IN_PROGRESS:
            return "bg-yellow-400 text-black";
        case Progress.NOT_STARTED:
        default:
            return "bg-gray-300 text-gray-700";
    }
}

function getProgressLabel(progress: Progress) {
    switch (progress) {
        case Progress.COMPLETED:
            return "Completed";
        case Progress.IN_PROGRESS:
            return "In Progress";
        case Progress.NOT_STARTED:
        default:
            return "Not Started";
    }
}

export function LessonTableUI({ courseId }: { courseId: string }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(3);

    const { data, isLoading, error } = useQuery<LessonsResponse>({
        queryKey: ["user-lessons", courseId, page, limit, search],
        queryFn: () => fetchLessons(courseId, page, limit, search),
        enabled: !!courseId,
    });

    const lessons = data?.data ?? [];
    const total = data?.total ?? 0;
    const course = data?.course;

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            <Card className="flex-[2]">
                <CardHeader className="flex items-end justify-between gap-6">
                    <CardTitle>
                        <Typography variant="h2">Lessons Dashboard</Typography>
                    </CardTitle>
                    <div className="flex items-baseline gap-3">
                        <Typography variant="muted" className="">
                            {course?.name}
                        </Typography>
                        <Avatar className="rounded h-4 w-4">
                            <AvatarFallback>{course?.name?.[0]}</AvatarFallback>
                            {course?.image && (
                                <AvatarImage src={course?.image} alt={course?.name ?? ''} />
                            )}
                        </Avatar>
                    </div>
                </CardHeader>
                <CardContent>
                    <Typography variant="small" className="mb-6">
                        Here you can find all the lessons for this course. Click on a lesson to view its details and update your progress.
                    </Typography>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search lessons..."
                        onSearchStart={() => setPage(1)}
                    />
                    {isLoading && <Typography variant="muted">Loading lessons...</Typography>}
                    {error && <Typography variant="muted" color="red">Failed to load lessons</Typography>}
                    {!isLoading && data && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead> </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Progress</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lessons.map((lesson) => (
                                    <TableRow key={lesson.id}>
                                        <TableCell>
                                            <Avatar className="rounded h-5 w-5">
                                                <AvatarFallback>{lesson.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                as={Link}
                                                href={`/user/courses/${courseId}/lessons/${lesson.id}`}
                                                variant="large"
                                                className="font-semibold"
                                            >
                                                {lesson.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="large"
                                                className="font-semibold"
                                            >
                                                {lesson.rank}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={clsx("w-fit", getProgressBadgeColor(lesson.progress))}>
                                                {getProgressLabel(lesson.progress)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {lessons.length > 0 && (
                        <Pagination
                            page={page}
                            onPageChange={setPage}
                            hasNext={page * limit < total}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}