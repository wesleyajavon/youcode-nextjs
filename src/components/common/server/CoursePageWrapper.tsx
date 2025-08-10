import { redirect } from "next/navigation";
import { getCourse } from "@/lib/queries/admin/course.query";
import { getRequiredAuthSession } from "@/lib/auth";
import CoursePage from "@/components/common/client/CoursePage";
import { getCourseOnUser } from "@/lib/queries/user/course/course.query";


// This component is used as a wrapper for the course page.
// It fetches the course data based on the ID from the URL parameters and renders the CoursePage component.
// The course page displays the course details, lessons, and allows users to join the course.
// If the course does not exist, it redirects to the courses list page.
// The component also checks if the user has already joined the course and passes this information to the CoursePage component.
// The user's role and ID are also passed to the CoursePage for role-based rendering
// and functionality.
// This is useful for displaying different content or actions based on the user's role (e.g., admin, student, teacher).
// The CoursePage component is responsible for rendering the course details and participants  
export default async function CoursePageWrapper(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const session = await getRequiredAuthSession();
    
    // Optimisation: simultaneous execution of asynchronous calls
    const [course, alreadyJoined] = await Promise.all([
        getCourse(params.id),
        getRequiredAuthSession().then(session => getCourseOnUser(session.user.id, params.id))
    ]);
    
    if (!course) {
        redirect(`/${session.user.role.toLowerCase}/courses`);
    }

    return (
        <CoursePage
            courseId={params.id}
            alreadyJoined={alreadyJoined !== null}
            role={session.user.role}
            userId={session.user.id}
        />
    );

}
