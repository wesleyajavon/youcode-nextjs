import { getAuthSession } from "@/lib/auth";
import { LessonTable } from "@/components/common/client/LessonTable";

// This function is used as a server-side wrapper for the LessonTable component.
// It retrieves the course ID from the URL parameters and the user's session to render the LessonTable
// with the appropriate course ID and user role.
export async function LessonTableServer(props?: { params?: Promise<{ id: string }> }) {
    const params = await props?.params || { id: 'null' };
    const session = await getAuthSession()
    // await new Promise(res => setTimeout(res, 5000)); 

    return <LessonTable courseId={params.id} role={session?.user.role || "PUBLIC"} />


}