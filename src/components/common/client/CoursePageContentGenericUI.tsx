"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { JoinCourseButton } from "@/components/user/client/JoinCourseButton";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { LeaveCourseButton } from "@/components/user/client/LeaveCourseButton";

type User = {
    user: {
        id: string;
        name: string;
        email?: string;
        image?: string;
    };
};

type Course = {
    id: string;
    name: string;
    presentation: string;
    image?: string;
    createdAt?: string;
    state?: string;
    totalUsers?: number; // Optional, if you want to display the total users in the course info
};

type FetchCourseInfoResponse = {
    course: {
        id: string;
        name: string;
        presentation: string;
        image?: string;
        createdAt?: string;
        state?: string;
        totalUsers?: number;
    };
};

type FetchParticipantsResponse = {
    users: {
        user: {
            id: string;
            name: string;
            email?: string;
            image?: string;
        };
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};


async function fetchCourseInfo(courseId: string, role: string) {
    const res = await fetch(`/api/${role}/courses/${courseId}`, {
        method: "GET",
    });
    if (!res.ok) throw new Error("Failed to fetch course info");
    return res.json();
}

async function fetchParticipants(courseId: string, page: number, limit: number, search: string, role: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/${role}/courses/${courseId}/participants?${params.toString()}`, {
        method: "GET",
    });
    if (!res.ok) throw new Error("Failed to fetch participants");
    return res.json();
}



export default function CoursePageContentGenericUI({
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


    const { data: courseData, isLoading: loadingCourse } = useQuery<FetchCourseInfoResponse>({
        queryKey: ["course-info", courseId],
        queryFn: () => fetchCourseInfo(courseId, role.toLowerCase()),
    });

    const { data: participantsData, isLoading, error } = useQuery<FetchParticipantsResponse>({
        queryKey: ["participants", courseId, page, limit, search],
        queryFn: () => fetchParticipants(courseId, page, limit, search, role.toLowerCase()),
    });

    const handleLeaveClick = () => {
        setDialogOpen(true)
    }

    const course: Course | undefined = courseData?.course;
    const participants: User[] = participantsData?.users ?? [];
    const total: number = course?.totalUsers ?? 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche : Présentation + Infos du cours */}
            <div className="flex flex-col gap-6 order-1 lg:order-1 lg:col-span-1">
                {/* Présentation du cours */}
                <Card className="h-fit flex flex-col ">
                    <CardHeader className="flex items-center justify-between">
                        <Typography variant="h3">
                            <CardTitle>👨🏻‍🏫 About this course</CardTitle>
                        </Typography>
                    </CardHeader>
                    <CardContent>
                        {loadingCourse && (
                            <Typography variant="base">
                                Loading presentation...
                            </Typography>
                        )}
                        {!loadingCourse && (
                            <Typography variant="base">
                                {course?.presentation || "No presentation available."}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
                {/* Infos du cours et actions for admin */}
                {role === "ADMIN" && (
                    <Card className="h-fit flex flex-col">
                        <CardHeader className="flex items-end justify-between gap-6">
                            <Typography variant="h3">
                                <CardTitle>More..</CardTitle>
                            </Typography>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 flex-1">
                            {loadingCourse && (
                                <Typography variant="base">Loading course info...</Typography>
                            )}
                            {!loadingCourse && (
                                <>
                                    <Badge className="w-fit">{course?.state}</Badge>
                                    <Typography variant={"base"}>{total} users</Typography>
                                    <Typography variant={"muted"}>
                                        Created: {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : "Unknown"}
                                    </Typography>
                                    <div className="flex-1" />
                                    <Link
                                        href={`/admin/courses/${course?.id}/lessons`}
                                        className={buttonVariants({
                                            variant: "outline",
                                        })}
                                    >
                                        Teaching Center 👀
                                    </Link>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Infos du cours et actions for user */}
                {role === "USER" && (
                    <Card className="h-fit flex flex-col">
                        <CardContent className="flex flex-col gap-3 flex-1">
                            {alreadyJoined && (
                                <Link
                                    href={`/user/courses/${course?.id}/lessons`}
                                    className={buttonVariants({
                                        variant: "outline",
                                    })}
                                >
                                    See lessons
                                </Link>
                            )}

                            <div className="flex-2" />

                            {alreadyJoined ? (
                                <Button
                                    onClick={() => {
                                        setDialogOpen(true);
                                    }}
                                    aria-label="Leave course"
                                    variant={'destructive'}
                                >
                                    Leave this course
                                </Button>

                            ) : (
                                <>
                                    <JoinCourseButton
                                        courseId={course?.id ?? ""}
                                        userId={userId} // Replace with actual user ID if needed
                                    />
                                    <Typography variant="muted" className="mt-2">
                                        Enroll in this course to access lessons and participants.
                                    </Typography>
                                </>
                            )}

                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Colonne droite : Liste des utilisateurs */}
            <Card className="order-2 lg:order-2 lg:col-span-2">
                <CardHeader className="flex items-end justify-between gap-6">
                    <Typography variant="h3">
                        <CardTitle>Participants</CardTitle>
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
                {alreadyJoined || role === "ADMIN" ? (
                    <CardContent>
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Search participants..."
                            onSearchStart={() => setPage(1)}
                        />
                        {isLoading && <Typography variant="muted">Loading participants...</Typography>}
                        {error && <Typography variant="muted" color="red">Failed to load participants</Typography>}
                        {!isLoading && participantsData && (
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
                                                <Typography variant="large" className="font-semibold">
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
                        )}
                        {participants.length > 0 && (
                            <Pagination
                                page={page}
                                onPageChange={setPage}
                                hasNext={page * limit < total}
                            />
                        )}
                    </CardContent>
                ) : (
                    <CardContent>
                        <LockClosedIcon className="h-10 w-10 text-muted-foreground" />
                    </CardContent>
                )}
            </Card>
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            You are about to leave the course :
                        </AlertDialogTitle>
                        <AlertDialogTitle>{course?.name}</AlertDialogTitle>
                        <Typography variant="small" className="text-muted-foreground">
                            Content will be locked after leaving.
                        </Typography>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {courseId && (
                            <LeaveCourseButton courseId={courseId} userId={userId} />
                        )}
                        <AlertDialogCancel asChild>
                            <Button variant="secondary">Cancel</Button>
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>

    );
}