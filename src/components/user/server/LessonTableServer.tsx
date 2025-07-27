import { LessonTableUI } from "../client/LessonTableUI";


export async function LessonTableServer(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    // await new Promise(res => setTimeout(res, 5000));

    return (<LessonTableUI courseId={params.id}/>);
}