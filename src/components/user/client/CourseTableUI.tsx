"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
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
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { userAgent } from "next/server";
import { JoinCourseButton } from "./JoinCourseButton";

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

export function CourseTableUI({ userId }: { userId: string }) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const { data, isLoading, error } = useQuery<CoursesResponse>({
        queryKey: ["user-courses", page, limit, search],
        queryFn: () => fetchCourses(page, limit, search),
    });

    const handleJoinClick = (course: Course) => {
        setSelectedCourse(course)
        setDialogOpen(true)
    }

    const courses = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Typography variant="h2">My Courses Hub 📚</Typography>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Typography variant="small" className="mb-2">
                        Find all your courses here. Click on a course to view its details.
                    </Typography>
                    <Typography variant="muted" className="mb-6">
                        You need to join a course to unlock its content 😉
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
                                    <TableHead></TableHead>
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
                                                {course.presentation?.slice(0, 35)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {course.alreadyJoined ? (
                                                <CheckIcon className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <Button
                                                    onClick={() => handleJoinClick(course)}
                                                    aria-label="Join course"
                                                    variant={'outline'}
                                                >
                                                    Join
                                                </Button>
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
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader className="items-center text-center">
                        {selectedCourse?.image && (
                            <Avatar className="mx-auto mb-2 h-12 w-12">
                                <AvatarFallback>{selectedCourse.name[0]}</AvatarFallback>
                                <AvatarImage src={selectedCourse.image} alt={selectedCourse.name} />
                            </Avatar>
                        )}
                        <AlertDialogTitle className="text-xl font-bold">
                            Join <span className="text-primary">{selectedCourse?.name}</span>?
                        </AlertDialogTitle>
                        <Typography variant="small" className="text-muted-foreground mt-2">
                            By joining, you’ll unlock all course content and resources.
                        </Typography>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row gap-2 justify-center mt-4">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">Cancel</Button>
                        </AlertDialogCancel>
                        {selectedCourse && (
                            <JoinCourseButton courseId={selectedCourse.id} userId={userId}/>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>

    );
}