import { AdminLessonsTableUI } from "../client/AdminLessonsTableUI";

export async function AdminLessonsTableServer(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    // await new Promise(res => setTimeout(res, 5000));

    return <AdminLessonsTableUI courseId={params.id} />
}