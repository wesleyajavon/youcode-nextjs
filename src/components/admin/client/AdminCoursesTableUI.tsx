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
import { XMarkIcon } from '@heroicons/react/24/outline'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import Link from 'next/link'
import { toast } from 'sonner'
import { SearchInput } from '@/components/ui/common/search-bar'
import { Pagination } from '@/components/ui/common/pagination'
import { DeleteDialog } from '@/lib/features/dialogs/DeleteDialog'
import { Loader } from '@/components/ui/common/loader'
import { Course, CoursesResponse } from '@/types/course'
import { fetchCourses } from '@/lib/api/course'


// This component is used to display a table of courses in the admin panel.
// It allows administrators to view, search, and manage courses.
// The table includes options to create, edit, and delete courses.
// It also includes a search input to filter courses by name or other criteria.

export function AdminCoursesTableUI({ role }: { role: string }) {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<{ id: string; name: string; image?: string; } | null>(null)
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    // ✅ Fetch courses with useQuery
    const { data, isLoading, error } = useQuery<CoursesResponse>({
        queryKey: ['courses', page, search],
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
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            setDialogOpen(false)
            setSelectedCourse(null)
            toast.success('Course successfully deleted!')
        },
    })

    const handleDeleteClick = (course: { id: string; name: string; image?: string; }) => {
        setSelectedCourse(course)
        setDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!selectedCourse) return
        deleteMutation.mutate(selectedCourse.id)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Typography variant="h2">Courses Hub 📚</Typography>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Typography variant="small" className="mb-2">
                        👋 Welcome to the Courses Hub!
                    </Typography>
                    <Typography variant="muted" className="mb-6">
                        Feel like adding a new course? Just hit the button above! 🚀
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
                                    <TableHead></TableHead>
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
                                            <Typography as={Link} variant="large" href={`/admin/courses/${course.id}`}>
                                                {course.name.slice(0, 20) || 'Course'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography as={Link} href={`/admin/courses/${course.id}`} variant="small">
                                                {course.presentation?.slice(0, 30) ?? ''}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                aria-label='Edit course'
                                                href={`/admin/courses/${course.id}/edit`}>
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick({ id: course.id, name: course.name, image: course.image })}
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
            />

        </>
    )
}
