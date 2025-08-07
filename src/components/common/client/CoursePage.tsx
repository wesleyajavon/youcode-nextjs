"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/common/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/common/table";
import { Typography } from "@/components/ui/common/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/common/avatar";
import { Badge } from "@/components/ui/common/badge";
import { SearchInput } from "@/components/ui/common/search-bar";
import { Pagination } from "@/components/ui/common/pagination";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { JoinCourseButton } from "@/components/ui/user/JoinCourseButton";
import { Loader } from "@/components/ui/common/loader";
import { CourseDialog } from "@/lib/features/dialogs/CourseDialog";
import { FetchCourseInfoResponse, FetchParticipantsResponse } from "@/types/fetch";
import { fetchCourseInfo, fetchParticipants } from "@/lib/api/course";


// This component is used to display the content of a course page.
// It fetches course information and participants based on the course ID.
// The course information includes the course name, presentation, image, and state.
// The participants list shows users enrolled in the course.
export default function CoursePage({
    courseId,
    alreadyJoined,
    role,
    userId
}: {
    courseId: string;
    alreadyJoined: boolean;
    role: string;
    userId: string;
}) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [dialogOpen, setDialogOpen] = useState(false)

    // Fetch course information using React Query
    // This will automatically refetch the course info when the courseId changes
    // and will also handle caching and loading states.
    // The course information is used to only display the course details
    const { data: courseData, isLoading: loadingCourse, error: courseError } = useQuery<FetchCourseInfoResponse>({
        queryKey: ["course-info", courseId],
        queryFn: () => fetchCourseInfo(courseId, role),
    });

    // Fetch participants of the course using React Query
    // This will automatically refetch the participants when the courseId, page, limit, or search changes
    // and will also handle caching and loading states.
    // The participants are used to display the list of users enrolled in the course.
    const { data: participantsData, isLoading: loadingParticipants, error: participantsError } = useQuery<FetchParticipantsResponse>({
        queryKey: ["participants", courseId, page, limit, search],
        queryFn: () => fetchParticipants(courseId, page, limit, search, role),
    });

    const course = courseData?.course ?? { id: '', name: '', presentation: '', image: undefined, createdAt: '', state: '', totalUsers: 0 };
    const participants = participantsData?.users ?? [];
    const total: number = course?.totalUsers ?? 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column : Course presentation and information */}
            <div className="flex flex-col gap-6 order-1 lg:order-1 lg:col-span-1">

                {/* Course presentation */}
                <Card className="h-fit flex flex-col ">
                    <CardHeader className="flex items-center justify-between">
                        <Typography variant="h3">
                            <CardTitle>👨🏻‍🏫 About this course</CardTitle>
                        </Typography>
                    </CardHeader>
                    <CardContent>
                        {courseError && <Typography variant="muted" color="red">Failed to load course information</Typography>}
                        {loadingCourse && <Loader />}
                        {!loadingCourse && (
                            <Typography variant="quote">
                                {course.presentation}
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* Course info and actions for admin */}
                {role === "ADMIN" && (
                    <Card className="h-fit flex flex-col">
                        <CardHeader className="flex items-end justify-between gap-6">
                            <Typography variant="h3">
                                <CardTitle>More..</CardTitle>
                            </Typography>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 flex-1">
                            {loadingCourse && <Loader />}
                            {!loadingCourse && (
                                <>
                                    <Badge className="w-fit">{course.state}</Badge>
                                    <Typography variant={"base"}>{total} users</Typography>
                                    <Typography variant={"muted"}>
                                        Created: {new Date(course.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Link
                                        aria-label="Teaching center"
                                        href={`/admin/courses/${course.id}/lessons`}
                                        className={buttonVariants({
                                            variant: "outline",
                                        })}
                                    >
                                        Teaching Center 🧠
                                    </Link>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Course info and actions for user */}
                {role === "USER" && (
                    <Card className="h-fit flex flex-col">
                        <CardContent className="flex flex-col gap-3 flex-1">
                            {loadingCourse && <Loader />}
                            {!loadingCourse && alreadyJoined && (
                                <>
                                    <Link
                                        aria-label="Teaching center"
                                        href={`/user/courses/${course?.id}/lessons`}
                                        className={buttonVariants({
                                            variant: "outline",
                                        })}
                                    >
                                        Teaching Center 🧠
                                    </Link>
                                    <Button
                                        onClick={() => {
                                            setDialogOpen(true);
                                        }}
                                        aria-label="Leave course"
                                        variant={'destructive'}
                                    >
                                        Leave this course
                                    </Button>
                                </>
                            )}
                            {!loadingCourse && !alreadyJoined && (
                                <>
                                    <JoinCourseButton
                                        courseId={course.id}
                                        userId={userId} />
                                    <Typography variant="muted" className="mt-2">
                                        Enroll in this course to access lessons and more 🔓
                                    </Typography>
                                </>
                            )}

                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right column : Participants list */}
            <Card className="order-2 lg:order-2 lg:col-span-2">
                <CardHeader className="flex items-end justify-between gap-6">
                    <Typography variant="h3">
                        <CardTitle>🧑🏾‍💻👩🏼‍💻🧑🏻‍💻 Participants</CardTitle>
                    </Typography>
                    <div className="flex items-baseline gap-3">
                        <Typography variant="muted" className="">
                            {course?.name}
                        </Typography>
                        <Avatar className="rounded h-4 w-4">
                            <AvatarFallback>{course?.name?.[0]}</AvatarFallback>
                            {course?.image && (
                                <AvatarImage src={course?.image} alt={course?.name ?? ""} />
                            )}
                        </Avatar>
                    </div>
                </CardHeader>

                <CardContent>
                    {loadingParticipants && <Loader />}
                    {participantsError && <Typography variant="muted" color="red">Failed to load participants</Typography>}
                    {!loadingParticipants && (alreadyJoined || role === "ADMIN") && (
                        <>
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search participants..."
                                onSearchStart={() => setPage(1)}
                            />
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>Name</TableHead>
                                        {role === "ADMIN" && <TableHead>Email</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {participants.map((participant) => (
                                        <TableRow key={participant.user.id}>
                                            <TableCell>
                                                <Avatar className="rounded">
                                                    <AvatarFallback>
                                                        {participant.user.name?.[0] ?? "?"}
                                                    </AvatarFallback>
                                                    {participant.user.image && (
                                                        <AvatarImage src={participant.user.image} alt={participant.user.id} />
                                                    )}
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="small" className="font-semibold">
                                                    {participant.user.name}
                                                </Typography>
                                            </TableCell>
                                            {role === "ADMIN" && (
                                                <TableCell>
                                                    <Typography variant="small" className="font-semibold">
                                                        {participant.user.email}
                                                    </Typography>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {participants.length > 0 && (
                                <Pagination
                                    page={page}
                                    onPageChange={setPage}
                                    hasNext={page * limit < total}
                                />
                            )}
                        </>
                    )}
                    {!loadingParticipants && !alreadyJoined && role === "USER" && (
                        <div className="flex items-center justify-center p-6">
                            <LockClosedIcon className="h-6 w-6 text-muted-foreground" />
                            <Typography variant="muted" className="ml-2">
                                You need to join the course to see the course participants.
                            </Typography>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog for leaving course confirmation */}
            <CourseDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                course={{ id: course.id, name: course.name, image: course?.image, userId: userId }}
                join={!alreadyJoined}
            />  
        </div>

    );
}