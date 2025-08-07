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
import { SearchInput } from "@/components/ui/common/search-bar";
import { Pagination } from "@/components/ui/common/pagination";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { Loader } from "@/components/ui/common/loader";
import { fetchLessons, fetchPublicLessons, getProgressBadgeColor, getProgressLabel } from "@/lib/api/lesson";
import { LessonsInfoResponse, LessonsResponse } from "@/types/lesson";
import { Badge } from "@/components/ui/common/badge";
import clsx from "clsx";
import { usePathname } from "next/navigation";

// This component is used to display a table of lessons for a course.
// It fetches lessons based on the course ID and user role (admin, user, or public).
// The table includes lesson names, content snippets, ranks, and progress for users.
// Admins can edit and delete lessons, while users can view lesson details and update their progress.
// The component also includes a search input to filter lessons by name or content.

export function LessonTable({ courseId, role }: { courseId: string, role: string }) {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const pathname = usePathname();

    if (pathname?.startsWith("/public")) {
       role = "PUBLIC";
    }

    // Dialog state for deletion confirmation (only for admin)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<{ id: string, name: string } | null>(null);


    const { data, isLoading, error } = useQuery<LessonsResponse | LessonsInfoResponse>({
        queryKey: [`${role.toLowerCase}-lessons`, courseId, page, limit, search],
        queryFn: () => role === "PUBLIC" ? fetchPublicLessons(page, limit, search) : fetchLessons(courseId, page, limit, search, role),
        enabled: !!courseId,
    });

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

    const lessons = data?.data ?? [];
    const total = data?.total ?? 0;



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
                        {role === "ADMIN" && `👋 Welcome to the Teaching Center! Here you can manage all your lessons.`}
                        {role === "USER" && `🗒 Here you can find all the lessons for this course. Click on a lesson to view its details and update your progress.`}
                        {role === "PUBLIC" && `😁 This is the public teaching center where you can explore available lessons.`}
                    </Typography>
                    <Typography variant="muted" className="mb-6">
                        {role === "ADMIN" && `Your AI-powered lessons are waiting on you. Go check it out 👀`}
                        {role === "USER" && `Click on a lesson to view its content and update your progress.📒`}
                        {role === "PUBLIC" && `Want more lessons? Sign in! 🫡`}
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
                        <div className="overflow-x-auto w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead> </TableHead>
                                        <TableHead>Name</TableHead>
                                        {(role === "ADMIN" || role === "PUBLIC") && <TableHead className="hidden sm:table-cell">Content</TableHead>}
                                        {(role === "ADMIN" || role === "USER") && <TableHead className="hidden md:table-cell">Rank</TableHead>}
                                        {(role === "USER") && <TableHead className="hidden md:table-cell">Progress</TableHead>}
                                        {(role === "ADMIN") && <TableHead className="hidden md:table-cell"> </TableHead>}
                                        {(role === "ADMIN") && <TableHead className="hidden md:table-cell"> </TableHead>}
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
                                                {(role === "PUBLIC") ?
                                                    <Typography
                                                        as={Link}
                                                        variant="large"
                                                        href={`/public/${lesson.id}`}

                                                    >
                                                        {lesson.name?.slice(0, 30) ?? ""}
                                                    </Typography> :
                                                    <Typography
                                                        as={Link}
                                                        variant="large"
                                                        href={`/${role.toLowerCase()}/courses/${courseId}/lessons/${lesson.id}`}
                                                    >
                                                        {lesson.name?.slice(0, 30) ?? ""}
                                                    </Typography>
                                                }

                                            </TableCell>
                                            {(role === "ADMIN" || role === "PUBLIC") && <TableCell className="hidden sm:table-cell">
                                                <Typography variant="small">
                                                    {lesson.content?.slice(0, 15) ?? ""}...
                                                </Typography>
                                            </TableCell>}
                                            {(role === "ADMIN" || role === "USER") && <TableCell className="hidden md:table-cell">
                                                <Typography variant="small">
                                                    {lesson.rank}
                                                </Typography>
                                            </TableCell>}
                                            {(role === "USER") && <TableCell className="hidden md:table-cell">
                                                <Badge className={clsx("w-fit", getProgressBadgeColor(lesson.progress))}>
                                                    {getProgressLabel(lesson.progress)}
                                                </Badge>
                                            </TableCell>}
                                            {(role === "ADMIN") && <TableCell>
                                                <Link
                                                    aria-label="Edit lesson"
                                                    href={`/admin/courses/${courseId}/lessons/${lesson.id}/edit`}>
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </Link>
                                            </TableCell>}
                                            {(role === "ADMIN") && <TableCell>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick({ id: lesson.id, name: lesson.name })}
                                                    className="hover:text-red-600"
                                                    aria-label="Delete lesson"
                                                >
                                                    <XMarkIcon className="h-5 w-5 mt-1" />
                                                </button>
                                            </TableCell>}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
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