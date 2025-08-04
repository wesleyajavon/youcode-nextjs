"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar';
import { Button } from '@/components/ui/common/button';
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
import { CheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SearchInput } from "@/components/ui/common/search-bar";
import { Pagination } from "@/components/ui/common/pagination";
import { CourseDialog } from "@/lib/features/dialogs/CourseDialog";
import { fetchCourses } from "@/lib/api/course";
import { CoursesResponse } from "@/types/course";
import { Course } from "@/types/course";
import { Loader } from "@/components/ui/common/loader";


// This component is used to display a table of courses for the user.
// It allows users to search for courses and view their details.
// The courses are fetched from the server and displayed in a paginated table format.
export function CourseTableUI({ userId, role }: { userId: string, role: string }) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course>({ id: '', name: '', image: '', presentation: '', alreadyJoined: false });

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const { data, isLoading, error } = useQuery<CoursesResponse>({
        queryKey: ["user-courses", page, limit, search],
        queryFn: () => fetchCourses(page, limit, search, role),
    });

    const handleJoinClick = (course: Course) => {
        setSelectedCourse(course)
        setDialogOpen(true)
    }

    const courses = data?.data ?? [];
    const total = data?.total ?? 0;

    return (

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
                {/*  Display loading state */}
                {isLoading && <Loader />}

                {/* Display error state */}
                {error && <Typography variant="muted" color="red">Failed to load courses</Typography>}

                {/* Conditional rendering based on courses data */}
                {!isLoading && !error && courses.length === 0 && (
                    <Typography variant="muted">No courses found</Typography>
                )}

                {/* Display courses in a table */}
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

                {/* Pagination controls */}
                {courses.length > 0 && (
                    <Pagination
                        page={page}
                        onPageChange={setPage}
                        hasNext={page * limit < total}
                    />
                )}
            </CardContent>

            {/* Join Course Dialog */}
            <CourseDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                course={{ id: selectedCourse?.id, name: selectedCourse?.name, image: selectedCourse?.image, userId: userId }}
                join={!selectedCourse.alreadyJoined}
            />
            
        </Card>



    );
}