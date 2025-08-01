"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { XMarkIcon } from '@heroicons/react/24/outline';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";

type Lesson = {
    id: string;
    name: string;
    content: string;
}

type FetchLessonsResponse = {
    data: Lesson[];
    page: number;
    limit: number;
    total: number;
};



async function fetchPublicLessons(page: number, limit: number, search: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/public/lessons?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch lessons");
    return res.json();
}

export function PublicLessonsTableUI() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const { data, isLoading, error } = useQuery<FetchLessonsResponse>({
        queryKey: ["lessons", page, limit, search],
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
                        This is the public teaching center where you can find all the lessons available for public access.
                    </Typography>

                    <Typography variant="muted" className="mb-6">
                        Want more lessons? Sign in! 😁
                    </Typography>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search..."
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