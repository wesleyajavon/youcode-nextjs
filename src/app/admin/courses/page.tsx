import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CoursesPage() {
    const session = await getRequiredAuthSession()

    const courses = await prisma.course.findMany({
        where: {
            creatorId: session.user.id
        }
    })

    console.log(courses)
    
    return (
        <>
            <div>
                TODO
            </div>
        </>
    )
}