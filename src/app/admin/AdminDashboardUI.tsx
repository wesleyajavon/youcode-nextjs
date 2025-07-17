import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { getRequiredAuthSession } from '@/lib/auth';
import { BookOpenIcon, UserIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { getCoursesNumber, getUsersCountForUserCourses } from './courses/_actions/course.query';
import { getLessonsNumber } from './courses/_actions/lesson.query';



export async function AdminDashboardUI() {

    // Simulating fetching data, replace with actual data fetching logic
    const session = await getRequiredAuthSession();
    const coursesCount = getCoursesNumber(session.user.id);
    const lessonsCount = getLessonsNumber(session.user.id);
    const usersCount = getUsersCountForUserCourses(session.user.id);

    // await new Promise(res => setTimeout(res, 5000));


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Typography variant="h2">Dashboard</Typography>
                </CardTitle>
                <CardDescription>Quick Stats</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Typography variant={"small"}>
                    <UserIcon className="h-5 w-5 text-gray-100 inline-block" />
                    <span className="ml-2">Number of users that joined your courses: {usersCount}</span>
                </Typography>
                <Typography variant={"small"}>
                    <BookOpenIcon className="h-5 w-5 text-gray-100 inline-block" />
                    <span className="ml-2">Total Lessons: {lessonsCount}</span>
                </Typography>
                <Typography variant={"small"}>
                    <RectangleStackIcon className="h-5 w-5 text-gray-100 inline-block" />
                    <span className="ml-2">Total Courses: {coursesCount}</span>
                </Typography>
            </CardContent>
        </Card>
    )
}
