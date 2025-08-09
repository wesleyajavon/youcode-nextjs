import { getRequiredAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function LessonLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
  const session = await getRequiredAuthSession();
  const courseId = (await params).id

  // Vérifie si l'utilisateur a rejoint ce cours
  const courseOnUser = await prisma.courseOnUser.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  })

  if (!courseOnUser) {
    redirect(`/user/courses/${courseId}`)
  }

  return <>{children}</>
}