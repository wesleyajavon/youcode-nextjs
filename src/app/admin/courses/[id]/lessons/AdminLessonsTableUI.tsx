"use client";

import { useState, useEffect } from "react";
import {
    Layout,
    LayoutActions,
    LayoutContent,
    LayoutHeader,
    LayoutTitle,
} from '@/components/layout/layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { buttonVariants } from '@/components/ui/button';
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
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
import { Lesson } from "@prisma/client";
import { CardSkeleton } from "@/components/ui/skeleton";

export function AdminLessonsTableUI({
    lessonProps,
    courseId,
}: {
    lessonProps: Lesson[];
    courseId: string;
}) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<{ id: string, name: string } | null>(null);

    useEffect(() => {
        setLessons(lessonProps);
    }, [lessonProps]);

    const handleDeleteClick = (lesson: { id: string, name: string }) => {
        setSelectedLesson(lesson);
        setDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedLesson) return;
        await fetch(`/api/admin/courses/${courseId}/lessons/${selectedLesson.id}`, {
            method: "DELETE",
        });
        setLessons(lessons.filter((l: any) => l.id !== selectedLesson.id));
        setDialogOpen(false);
        setSelectedLesson(null);
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
                                            {/* Ajoute une image si tu en as une pour la leçon */}
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
            </AlertDialog></>
    );
}