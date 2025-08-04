import { getRequiredAuthSession } from "@/lib/auth";
import { AdminCoursesTableUI } from "../client/AdminCoursesTableUI";

// This function is used to render the AdminCoursesTableUI component on the server side.
// It retrieves the user's session to determine their role and permissions.
// The AdminCoursesTableUI component displays a table of courses with options to create, edit,
// and manage courses based on the user's role.
export async function AdminCoursesTableServer() {
    const session = await getRequiredAuthSession();

    return <AdminCoursesTableUI role={session.user.role} />;

}