import { AdminLessonsTableUI } from "@/components/admin/client/AdminLessonsTableUI";
import { PublicLessonsTableUI } from "@/components/public/client/PublicLessonsTableUI";
import { LessonTableUI } from "@/components/user/client/LessonTableUI";
import { getRequiredAuthSession } from "@/lib/auth";

export async function LessonsTable(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getRequiredAuthSession()
    // await new Promise(res => setTimeout(res, 5000));


    if (!session) {
        return <PublicLessonsTableUI />
    } else if (session.user.role === "ADMIN") {
        return <AdminLessonsTableUI courseId={params.id} />
    } else if (session.user.role === "USER") {
        return <LessonTableUI courseId={params.id} />
    }

}