"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/common/table";
import { Typography } from "@/components/ui/common/typography";
import { Avatar, AvatarFallback } from "@/components/ui/common/avatar";
import { Badge } from "@/components/ui/common/badge";
import { SearchInput } from "@/components/ui/common/search-bar";
import { Pagination } from "@/components/ui/common/pagination";
import clsx from "clsx";
import { fetchLessons, getProgressBadgeColor, getProgressLabel } from "@/lib/api/lesson";
import { LessonsInfoResponse } from "@/types/lesson";
import { Loader } from "@/components/ui/common/loader";

// This component is used to display a table of lessons for a specific course.
// It allows users to search for lessons and view their details.
// The lessons are fetched from the server and displayed in a paginated table format.
export function LessonTableUI({ courseId, role }: { courseId: string, role: string }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(3);

    const { data, isLoading, error } = useQuery<LessonsInfoResponse>({
        queryKey: ["user-lessons", courseId, page, limit, search],
        queryFn: () => fetchLessons(courseId, page, limit, search, role),
        enabled: !!courseId,
    });

    const lessons = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">My Teaching Center 📖</Typography>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Typography variant="small" className="mb-6">
                    🗒 Here you can find all the lessons for this course. Click on a lesson to view its details and update your progress.
                </Typography>
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search lessons..."
                    onSearchStart={() => setPage(1)}
                />
                {/* Conditional rendering based on loading state */}
                {isLoading && <Loader />}

                {/* Conditional rendering based on error state */}
                {error && <Typography variant="muted" color="red">Failed to load lessons</Typography>}

                {/* Conditional rendering based on lessons data */}
                {!isLoading && !error && lessons.length === 0 && (
                    <Typography variant="muted">No lessons found</Typography>
                )}
                {/* Conditional rendering based on lessons data */}
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

                {/* Pagination controls */}
                {lessons.length > 0 && (
                    <Pagination
                        page={page}
                        onPageChange={setPage}
                        hasNext={page * limit < total}
                    />
                )}
            </CardContent>
        </Card>
    );
}