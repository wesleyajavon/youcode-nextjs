"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Typography } from '@/components/ui/typography';
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SearchInput } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";

async function fetchCourses(page: number, limit: number, search: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/user/courses?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
}

type Course = {
    id: string
    name: string
    image?: string | null
    presentation?: string | null
    alreadyJoined: boolean
}

type CoursesResponse = {
    data: Course[]
    page: number
    limit: number
    total: number
}

export function CourseTableUI() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const { data, isLoading, error } = useQuery<CoursesResponse>({
        queryKey: ["user-courses", page, limit, search],
        queryFn: () => fetchCourses(page, limit, search),
    });

    const courses = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">Courses Dashboard</Typography>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Typography variant="small" className="mb-6">
                    Here you can find all your courses. Click on a course to view its details.
                </Typography>
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search courses..."
                    onSearchStart={() => setPage(1)}
                />
                {isLoading && <Typography variant="muted">Loading courses...</Typography>}
                {error && <Typography variant="muted" color="red">Failed to load courses</Typography>}
                {!isLoading && data && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead> </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Presentation</TableHead>
                                <TableHead>Joined?</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>
                                        <Avatar className="rounded h-5 w-5">
                                            <AvatarFallback>{course.name[0]}</AvatarFallback>
                                            {course.image && (
                                                <AvatarImage src={course.image} alt={course.name} />
                                            )}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            as={Link}
                                            variant="large"
                                            href={`/user/courses/${course.id}`}
                                        >
                                            {course.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            as={Link}
                                            href={`/user/courses/${course.id}`}
                                            variant="small"
                                        >
                                            {course.presentation}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {course.alreadyJoined ? (
                                            <CheckIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <Link
                                                href={`/user/courses/${course.id}/join`}
                                                className={buttonVariants({
                                                    variant: 'secondary',
                                                })}
                                            >
                                                Join
                                            </Link>
                                        )}
                                    </TableCell>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                )}
                {courses.length > 0 && (
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