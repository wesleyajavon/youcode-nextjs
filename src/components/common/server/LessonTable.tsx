import { getAuthSession } from "@/lib/auth";
import { LessonTable } from "../client/LessonTable";

// This function is used to render the appropriate lessons table based on the user's role and course ID.
// If the user is not authenticated, it returns a public lessons table.
// If the user is an admin, it returns an admin lessons table.
// If the user is a regular user, it returns a user-specific lessons table.

export async function LessonTableServer(props?: { params?: Promise<{ id: string }> }) {
    const params = await props?.params || { id: 'null' };
    const session = await getAuthSession()
    // await new Promise(res => setTimeout(res, 5000)); 

    return <LessonTable courseId={params.id} role={session?.user.role || "PUBLIC"} />


}