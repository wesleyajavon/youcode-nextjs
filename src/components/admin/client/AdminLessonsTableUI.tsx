"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
} from "@/components/ui/common/alert-dialog";
import { Button } from "@/components/ui/common/button";
import { SearchInput } from "@/components/ui/common/search-bar";
import { Pagination } from "@/components/ui/common/pagination";
import { toast } from "sonner";
import { DeleteDialog } from "@/lib/features/dialogs/DeleteDialog";


type FetchCourseInfoResponse = {
    course: {
        id: string;
        name: string;
    };
};



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
    const queryClient = useQueryClient()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<{ id: string, name: string } | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["lessons", courseId, page, limit, search],
        queryFn: () => fetchLessons(courseId, page, limit, search),
        enabled: !!courseId,
    });

    const lessons = data?.data ?? [];
    const total = data?.total ?? 0;

    // ✅ Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (lessonId: string) => {
            const res = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error('Failed to delete lesson')
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] })
            setDialogOpen(false)
            setSelectedLesson(null)
            toast.success('Lesson deleted successfully!')
        },
    })

    const handleDeleteClick = (lesson: { id: string, name: string }) => {
        setSelectedLesson(lesson);
        setDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!selectedLesson) return
        deleteMutation.mutate(selectedLesson.id)
        setDialogOpen(false);
        setSelectedLesson(null);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Typography variant="h2">Teaching Center 📖</Typography>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Typography variant="small" className="mb-2">
                        👋 Welcome to the Teaching Center! Here you can manage all your lessons.
                    </Typography>
                    <Typography variant="muted" className="mb-6">
                        Your AI-powered lessons are waiting on you. Go check it out 👀
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

            <DeleteDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={handleConfirmDelete}
                isPending={deleteMutation.isPending}
                cancelText="Cancel"
                confirmText="Delete Lesson"
                title="Are you sure you want to delete this lesson?"
                description="This action cannot be undone. All data and progress related to this lesson will be permanently deleted."
                itemName={selectedLesson?.name}
            />

            
        </>
    );
}