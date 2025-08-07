'use client'

import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/common/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/common/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/common/table'
import { Typography } from '@/components/ui/common/typography'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import Link from 'next/link'
import { toast } from 'sonner'
import { SearchInput } from '@/components/ui/common/search-bar'
import { Pagination } from '@/components/ui/common/pagination'
import { DeleteDialog } from '@/lib/features/dialogs/DeleteDialog'
import { Loader } from '@/components/ui/common/loader'
import { Course, CoursesResponse } from '@/types/course'
import { fetchCourses } from '@/lib/api/course'
import { CourseDialog } from '@/lib/features/dialogs/CourseDialog'
import { Button } from '@/components/ui/common/button'


// This component is used to display a table of courses in the admin panel.
// It allows administrators to view, search, and manage courses.
// The table includes options to create, edit, and delete courses.
// It also includes a search input to filter courses by name or other criteria.

export function CourseTable({ userId, role }: { userId: string; role: string }) {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>({ id: '', name: '', image: '', presentation: '', alreadyJoined: false })
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    // ✅ Fetch courses with useQuery
    const { data, isLoading, error } = useQuery<CoursesResponse>({
        queryKey: [`${role}-courses`, page, search],
        queryFn: () => fetchCourses(page, limit, search, role),
    })

    const courses: Course[] = data?.data ?? [];
    const total: number = data?.total ?? 0;

    // ✅ Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (courseId: string) => {
            const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete course')
        },
        onSuccess: () => {
            // Si la page courante n'a plus de cours, revenir à la page précédente
            if ((page - 1) * limit >= total - 1 && page > 1) {
                setPage(page - 1);
            }
            queryClient.invalidateQueries({ queryKey: [`${role}-courses`] })
            setDialogOpen(false)
            setSelectedCourse(null)
            toast.success('Course successfully deleted!')
        },
    })

    const handleDeleteClick = (course: Course) => {
        setSelectedCourse(course)
        setDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!selectedCourse) return
        deleteMutation.mutate(selectedCourse.id)
    }

    const handleJoinClick = (course: Course) => {
        setSelectedCourse(course)
        setDialogOpen(true)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Typography variant="h2">{role === 'USER' ? 'My' : ''} Course Hub 📚</Typography>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Typography variant="small" className="mb-2">
                        {role === 'ADMIN' && '👋 Welcome to the Course Hub!'}
                        {role === 'USER' && '👋 Find all your courses here. Click on a course to view its details.'}

                    </Typography>
                    <Typography variant="muted" className="mb-6">
                        {role === 'ADMIN' && 'Feel like adding a new course? Just hit the button above! 🚀'}
                        {role === 'USER' && 'You need to join a course to unlock its content 😉'}
                    </Typography>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search courses..."
                        onSearchStart={() => setPage(1)}
                    />

                    {isLoading && <Loader />}
                    {error && <p className="text-red-600">Failed to load courses</p>}
                    {!isLoading && data && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead> </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Presentation</TableHead>
                                    {role === 'ADMIN' && <TableHead></TableHead>}
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.data.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <Avatar className="rounded h-5 w-5">
                                                <AvatarFallback>{course.name[0]}</AvatarFallback>
                                                {course.image && <AvatarImage src={course.image} alt={course.name} />}
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Typography as={Link} variant="large" href={`/${role.toLowerCase()}/courses/${course.id}`}>
                                                {course.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography as={Link} href={`/${role.toLowerCase()}/courses/${course.id}`} variant="small">
                                                {course.presentation?.slice(0, 30) ?? ''}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {role === 'ADMIN' ? (
                                                <Link
                                                    aria-label='Edit course'
                                                    href={`/admin/courses/${course.id}/edit`}>
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </Link>) : course.alreadyJoined ? (
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
                                        {role === 'ADMIN' && (
                                            <TableCell>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteClick({ id: course.id, name: course.name, image: course.image })}
                                                    className="hover:text-destructive"
                                                    aria-label="Delete course"
                                                >
                                                    <XMarkIcon className="h-5 w-5 mt-1" />
                                                </button>
                                            </TableCell>)}
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

            {role === "ADMIN" ?

                <DeleteDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    title="Are you sure you want to delete this course?"
                    itemName={selectedCourse?.name}
                    image={selectedCourse?.image}
                    description="This action cannot be undone. All data related to this course will be permanently deleted."
                    isPending={deleteMutation.isPending}
                    onConfirm={handleConfirmDelete}
                    cancelText="Cancel"
                    confirmText="Delete"
                /> : (
                    <CourseDialog
                        open={dialogOpen}
                        onOpenChange={setDialogOpen}
                        course={{ id: selectedCourse?.id || '', name: selectedCourse?.name || '', image: selectedCourse?.image || '', userId: userId }}
                        join={!selectedCourse?.alreadyJoined}
                    />
                )}

        </>
    )
}