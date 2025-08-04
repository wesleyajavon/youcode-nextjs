import { getRequiredAuthSession } from '@/lib/auth';
import { CourseTableUI } from '../client/CourseTableUI';


// This function is used to render the CourseTableUI component on the server side.
// It retrieves the user's session to determine their user ID and role.
// The CourseTableUI component displays a table of courses for the user, allowing them to view
// and join courses based on their role.
export async function CourseTableServer() {

    const session = await getRequiredAuthSession();
    const userId = session.user.id;

    return (<CourseTableUI userId={userId} role={session.user.role} />);
}