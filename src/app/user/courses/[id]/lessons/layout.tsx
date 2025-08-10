import { getRequiredAuthSession } from "@/lib/auth";
import { getCourseOnUser } from "@/lib/queries/user/course/course.query";
import { redirect } from "next/navigation"

export default async function LessonLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const session = await getRequiredAuthSession();
  
  // Optimisation: simultaneous execution of asynchronous calls
  const [courseId, courseOnUser] = await Promise.all([
    params.then(params => params.id),
    params.then(params => getCourseOnUser(session.user.id, params.id))
  ]);

  if (!courseOnUser) {
    redirect(`/user/courses/${courseId}`)
  }

  return <>{children}</>
}