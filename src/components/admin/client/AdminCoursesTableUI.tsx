"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Course } from "@prisma/client";
import { CardSkeleton } from "@/components/ui/skeleton";

export function AdminCoursesTableUI({ coursesProp }: { coursesProp: Course[] }) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<{ id: string, name: string } | null>(null);

    useEffect(() => {
        setCourses(coursesProp);
    }, [coursesProp]);

    const handleDeleteClick = (course: { id: string, name: string }) => {
        setSelectedCourse(course);
        setDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedCourse) return;
        await fetch(`/api/admin/courses/${selectedCourse.id}`, {
            method: "DELETE",
        });
        setCourses(courses.filter((c: any) => c.id !== selectedCourse.id));
        setDialogOpen(false);
        setSelectedCourse(null);
        console.log(`Course ${selectedCourse.name} deleted successfully.`);
    };

    return (
        <>
            <Card>
                <CardContent className="mt-0">
                    <Typography variant="h2" className="mb-6">
                        Courses Dashboard
                    </Typography>
                    <Typography variant="small" className="mb-2">
                        Here you can manage all courses. Click on a course to view or edit its details.
                    </Typography>
                    <Typography variant="muted" className="mb-6">
                        You can also create a new course using the button above.
                    </Typography>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead> </TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Presentation</TableHead>
                                <TableHead></TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses && courses.map((course: any) => (
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
                                            href={`/admin/courses/${course.id}`}
                                        >
                                            {course.name.slice(0, 20) || 'Course'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            as={Link}
                                            href={`/admin/courses/${course.id}`}
                                            variant="small"
                                        >
                                            {course.presentation.slice(0, 30) ?? ""}...
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/courses/${course.id}/edit`}>
                                            <PencilSquareIcon className="h-5 w-5" />
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick({ id: course.id, name: course.name })}
                                            className="hover:text-red-600"
                                            aria-label="Delete course"
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
                            Are you sure you want to delete this course:
                        </AlertDialogTitle>
                        <AlertDialogTitle>
                            {selectedCourse?.name}
                        </AlertDialogTitle>
                        <Typography variant="small" className="text-muted-foreground">
                            This action cannot be undone. All data related to this course will be permanently deleted.
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
    )
}
