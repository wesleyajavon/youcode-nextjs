import { PrismaClient, CourseState, LessonState, Progress } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Nettoyage des anciennes données
  await prisma.lessonOnUser.deleteMany();
  await prisma.courseOnUser.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Création de 100 utilisateurs
  const userData = Array.from({ length: 100 }).map((_, i) => ({
    name: `User${i + 1}`,
    email: `user${i + 1}@example.com`,
    image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${(i % 50) + 1}.jpg`,
  }));
  await prisma.user.createMany({ data: userData });
  const allUsers = await prisma.user.findMany();

  // Création de 10 cours avec différents créateurs
  const courseData = Array.from({ length: 10 }).map((_, i) => ({
    name: `Course ${i + 1}`,
    presentation: `Présentation du cours ${i + 1}`,
    image: `https://picsum.photos/seed/course${i + 1}/400/200`,
    creatorId: allUsers[i].id,
    state: i % 2 === 0 ? CourseState.PUBLISHED : CourseState.DRAFT,
  }));
  const courses = await Promise.all(courseData.map(data => prisma.course.create({ data })));

  // Ajout d'au moins 10 étudiants à chaque cours
  for (let i = 0; i < courses.length; i++) {
    const students = allUsers.slice(i * 10, i * 10 + 10);
    await prisma.courseOnUser.createMany({
      data: students.map(u => ({
        userId: u.id,
        courseId: courses[i].id,
      })),
    });
  }

  // Création d'au moins 5 leçons par cours
  for (let i = 0; i < courses.length; i++) {
    for (let j = 1; j <= 5; j++) {
      await prisma.lesson.create({
        data: {
          name: `Lesson ${j} for Course ${i + 1}`,
          rank: `${j}`,
          content: `# Lesson ${j}\n\nContenu de la leçon ${j} pour le cours ${i + 1}.`,
          state: LessonState.PUBLISHED,
          courseId: courses[i].id,
        },
      });
    }
  }

  // Ajout de la progression des utilisateurs sur les leçons du premier cours
  const lessons = await prisma.lesson.findMany({ where: { courseId: courses[0].id } });
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < lessons.length; j++) {
      await prisma.lessonOnUser.create({
        data: {
          userId: allUsers[i].id,
          lessonId: lessons[j].id,
          progress: j % 3 === 0 ? Progress.COMPLETED : Progress.IN_PROGRESS,
        },
      });
    }
  }

  console.log('Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });