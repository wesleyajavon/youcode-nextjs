import { redirect } from "next/navigation";
import { getCourse } from "@/app/admin/courses/_actions/course.query";
import { getRequiredAuthSession } from "@/lib/auth";
import CoursePage from "../client/CoursePage";


// This component is used to display the content of a course page.
// It fetches course information and participants based on the course ID.   
export default async function CoursePageWrapper(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const session = await getRequiredAuthSession();
    const course = await getCourse(params.id);
    if (!course) {
        redirect('/admin/courses');
    }

    // Vérifie si l'utilisateur est déjà inscrit
    const alreadyJoined = course.users.some(
        (u: any) => u.user.id === session.user.id
    );

    return (
        <CoursePage
            courseId={params.id}
            alreadyJoined={alreadyJoined}
            role={session.user.role}
            userId={session.user.id}
        />
    );

}
