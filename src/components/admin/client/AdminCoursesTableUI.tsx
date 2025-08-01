'use client'

import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Typography } from '@/components/ui/typography'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon'
import Link from 'next/link'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SearchInput } from '@/components/ui/search-bar'
import { Pagination } from '@/components/ui/pagination'

// ✅ Fetch function
const fetchCourses = async ({
    page = 1,
    search = '',
}: {
    page?: number
    search?: string
}): Promise<CoursesResponse> => {
    const params = new URLSearchParams({ page: page.toString(), search })
    const res = await fetch(`/api/admin/courses?${params.toString()}`)
    if (!res.ok) throw new Error('Failed to fetch courses')
    return res.json()
}

type Course = {
    id: string
    name: string
    image?: string | null
    presentation?: string | null
}

type CoursesResponse = {
    data: Course[]
    page: number
    limit: number
    total: number
}


export function AdminCoursesTableUI() {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<{ id: string; name: string } | null>(null)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    // ✅ Fetch courses with useQuery
    const { data, isLoading, error } = useQuery<CoursesResponse>({
        queryKey: ['courses', page, search],
        queryFn: () => fetchCourses({ page, search }),
    })

    const courses: Course[] = data?.data ?? [];
    const total: number = data?.total ?? 0;
    const limit: number = data?.limit ?? 5;

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
            toast.success('Course deleted successfully!')
        },
    })

    const handleDeleteClick = (course: { id: string; name: string }) => {
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

                    {isLoading && <p>Loading courses...</p>}
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
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this course:
                        </AlertDialogTitle>
                        <AlertDialogTitle>{selectedCourse?.name}</AlertDialogTitle>
                        <Typography variant="small" className="text-muted-foreground">
                            This action cannot be undone. All data related to this course will be permanently deleted.
                        </Typography>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="secondary">Cancel</Button>
                        </AlertDialogCancel>
                        <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
