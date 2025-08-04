import { AdminLessonsTableUI } from "@/components/admin/client/AdminLessonsTableUI";
import { PublicLessonsTableUI } from "@/components/public/client/PublicLessonsTableUI";
import { LessonTableUI } from "@/components/user/client/LessonTableUI";
import { getAuthSession } from "@/lib/auth";

// This function is used to render the appropriate lessons table based on the user's role and course ID.
// If the user is not authenticated, it returns a public lessons table.
// If the user is an admin, it returns an admin lessons table.
// If the user is a regular user, it returns a user-specific lessons table.

export async function LessonsTable(props?: { params?: Promise<{ id: string }> }) {
    const params = await props?.params || { id: 'null' };
    const session = await getAuthSession()
    // await new Promise(res => setTimeout(res, 5000)); 

    if (params.id === 'null' || !session) {
        return <PublicLessonsTableUI />
    } else if (session.user.role === "ADMIN") {
        return <AdminLessonsTableUI courseId={params.id} role={session.user.role} />
    } else if (session.user.role === "USER") {
        return <LessonTableUI courseId={params.id} role={session.user.role} />
    }

}