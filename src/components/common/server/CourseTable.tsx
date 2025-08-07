import { getRequiredAuthSession } from "@/lib/auth";
import { CourseTable } from "@/components/common/client/CourseTable";

// This function is used to render the CourseTable component on the server side.
// It retrieves the user's session to determine their role and permissions.
// The CourseTable component displays a table of courses with options to create, edit,
// and manage courses based on the user's role.
export async function CourseTableServer() {
    const session = await getRequiredAuthSession();

    return <CourseTable userId={session.user.id} role={session.user.role} />;

}