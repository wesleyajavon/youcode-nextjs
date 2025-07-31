import { getRequiredAuthSession } from '@/lib/auth';
import { CourseTableUI } from '../client/CourseTableUI';

export async function CourseTableServer() {

    const session = await getRequiredAuthSession();
    const userId = session.user.id;
    // await new Promise(res => setTimeout(res, 5000));

    return (<CourseTableUI userId={userId} />);
}