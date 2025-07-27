"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
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


async function fetchLessons(courseId: string, page: number, limit: number, search: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/admin/courses/${courseId}/lessons?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch lessons");
    return res.json();
}

export function AdminLessonsTableUI({ courseId }: { courseId: string }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<{ id: string, name: string } | null>(null);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["lessons", courseId, page, limit, search],
        queryFn: () => fetchLessons(courseId, page, limit, search),
        enabled: !!courseId,
    });

    const lessons = data?.data ?? [];
    const total = data?.total ?? 0;

    const handleDeleteClick = (lesson: { id: string, name: string }) => {
        setSelectedLesson(lesson);
        setDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedLesson) return;
        await fetch(`/api/admin/courses/${courseId}/lessons/${selectedLesson.id}`, {
            method: "DELETE",
        });
        setDialogOpen(false);
        setSelectedLesson(null);
        refetch();
    };

    return (
        <>
            <Card>
                <CardContent className="mt-0">
                    <Typography variant="h2" className="mb-6">
                        Lessons Dashboard
                    </Typography>
                    <Typography variant="small" className="mb-2">
                        Here you can manage all lessons. Click on a lesson to view or edit its details.
                    </Typography>
                    <Typography variant="muted" className="mb-6">
                        You can also create a new lesson using the button above.
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
                                    <TableHead>Content</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead> </TableHead>
                                    <TableHead> </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lessons && lessons.map((lesson: any) => (
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
                                                href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                                            >
                                                {lesson.name?.slice(0, 30) ?? ""}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="small"
                                            >
                                                {lesson.content?.slice(0, 15) ?? ""}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="small">
                                                {lesson.rank}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}/edit`}>
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick({ id: lesson.id, name: lesson.name })}
                                                className="hover:text-red-600"
                                                aria-label="Delete lesson"
                                            >
                                                <XMarkIcon className="h-5 w-5 mt-1" />
                                            </button>
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
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this lesson:
                        </AlertDialogTitle>
                        <AlertDialogTitle>
                            {selectedLesson?.name}
                        </AlertDialogTitle>
                        <Typography variant="small" className="text-muted-foreground">
                            This action cannot be undone. All data related to this lesson will be permanently deleted.
                        </Typography>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="secondary">Cancel</Button>
                        </AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}