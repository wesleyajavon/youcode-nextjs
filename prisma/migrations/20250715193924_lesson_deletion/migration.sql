-- DropForeignKey
ALTER TABLE "LessonOnUser" DROP CONSTRAINT "LessonOnUser_lessonId_fkey";

-- AddForeignKey
ALTER TABLE "LessonOnUser" ADD CONSTRAINT "LessonOnUser_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
