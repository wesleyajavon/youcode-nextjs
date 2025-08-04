"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from '@/components/ui/common/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/common/table';
import { Typography } from '@/components/ui/common/typography';
import Link from 'next/link';
import { SearchInput } from "@/components/ui/common/search-bar";
import { Pagination } from "@/components/ui/common/pagination";
import { LessonsResponse } from "@/types/lesson";
import { fetchPublicLessons } from "@/lib/api/lesson";
import { Loader } from "@/components/ui/common/loader";


// This component is used to display a table of public lessons.
// It allows users to search for lessons and view their details.
// The lessons are fetched from the server and displayed in a paginated table format.

export function PublicLessonsTableUI() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const { data, isLoading, error } = useQuery<LessonsResponse>({
        queryKey: ["public-lessons", page, limit, search],
        queryFn: () => fetchPublicLessons(page, limit, search),
    });

    const lessons = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Typography variant="h2">Public Teaching Center 📖</Typography>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Typography variant="small" className="mb-2">
                        😁 This is the public teaching center where you can find all the lessons available for public access.
                    </Typography>

                    <Typography variant="muted" className="mb-6">
                        Want more lessons? Sign in! 
                    </Typography>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search..."
                        onSearchStart={() => setPage(1)}
                    />
                    {isLoading && <Loader />}
                    {error && <Typography variant="muted" color="red">Failed to load lessons</Typography>}
                    {!isLoading && data && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead> </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Content</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lessons && lessons.map((lesson) => (
                                    <TableRow key={lesson.id}>
                                        <TableCell>
                                            <Avatar className="rounded h-5 w-5">
                                                <AvatarFallback>{lesson.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                as={Link}
                                                variant="large"
                                                href={`/public/${lesson.id}`}
                                            >
                                                {lesson.name?.slice(0, 30) ?? ""}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                as={Link}
                                                variant="small"
                                                href={`/public/lessons/${lesson.id}`}
                                            >
                                                {lesson.content?.slice(0, 15) ?? ""}...
                                            </Typography>
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
        </>
    );
}