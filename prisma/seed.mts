import { PrismaClient, CourseState, LessonState, Progress } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Nettoyage des anciennes données
  await prisma.lessonOnUser.deleteMany();
  await prisma.courseOnUser.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Création de plusieurs utilisateurs
  const users = await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
      { name: 'Bob', email: 'bob@example.com', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Charlie', email: 'charlie@example.com', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
      { name: 'Diana', email: 'diana@example.com', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { name: 'Eve', email: 'eve@example.com', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
      { name: 'Frank', email: 'frank@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { name: 'Grace', email: 'grace@example.com', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
      { name: 'Hugo', email: 'hugo@example.com', image: 'https://randomuser.me/api/portraits/men/4.jpg' },
    ],
  });

  // Récupération des utilisateurs créés
  const allUsers = await prisma.user.findMany();

  // Création de plusieurs cours avec différents créateurs
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        name: 'Découverte de React',
        presentation: 'Un cours pour apprendre les bases de React.',
        image: 'https://reactjs.org/logo-og.png',
        creatorId: allUsers[0].id,
        state: CourseState.PUBLISHED,
      },
    }),
    prisma.course.create({
      data: {
        name: 'Node.js Avancé',
        presentation: 'Maîtrisez Node.js et son écosystème.',
        image: 'https://nodejs.org/static/images/logo.svg',
        creatorId: allUsers[1].id,
        state: CourseState.PUBLISHED,
      },
    }),
    prisma.course.create({
      data: {
        name: 'CSS Moderne',
        presentation: 'Flexbox, Grid et animations avancées.',
        image: 'https://css-tricks.com/wp-content/uploads/2015/05/css3-logo.svg',
        creatorId: allUsers[2].id,
        state: CourseState.DRAFT,
      },
    }),
  ]);

  // Ajout des utilisateurs aux cours via CourseOnUser
  await prisma.courseOnUser.createMany({
    data: [
      // Tous les utilisateurs dans le premier cours
      ...allUsers.map(u => ({ userId: u.id, courseId: courses[0].id })),
      // 4 utilisateurs dans le second cours
      ...allUsers.slice(0, 4).map(u => ({ userId: u.id, courseId: courses[1].id })),
      // 2 utilisateurs dans le troisième cours
      ...allUsers.slice(4, 6).map(u => ({ userId: u.id, courseId: courses[2].id })),
    ],
  });

  // Création de plusieurs leçons pour chaque cours
  const lessons = [
    // React
    await prisma.lesson.create({
      data: {
        name: 'Introduction à React',
        rank: '1',
        content: 'Bienvenue dans React !',
        state: LessonState.PUBLISHED,
        courseId: courses[0].id,
      },
    }),
    await prisma.lesson.create({
      data: {
        name: 'JSX et composants',
        rank: '2',
        content: 'Découvrons JSX et les composants.',
        state: LessonState.PUBLISHED,
        courseId: courses[0].id,
      },
    }),
    await prisma.lesson.create({
      data: {
        name: 'Hooks de base',
        rank: '3',
        content: 'useState, useEffect, etc.',
        state: LessonState.PUBLISHED,
        courseId: courses[0].id,
      },
    }),
    // Node.js
    await prisma.lesson.create({
      data: {
        name: 'Node.js Fundamentals',
        rank: '1',
        content: 'Découverte de Node.js.',
        state: LessonState.PUBLISHED,
        courseId: courses[1].id,
      },
    }),
    await prisma.lesson.create({
      data: {
        name: 'Express.js',
        rank: '2',
        content: 'Créer une API avec Express.',
        state: LessonState.PUBLISHED,
        courseId: courses[1].id,
      },
    }),
    // CSS
    await prisma.lesson.create({
      data: {
        name: 'Flexbox',
        rank: '1',
        content: 'Mise en page moderne avec Flexbox.',
        state: LessonState.PUBLISHED,
        courseId: courses[2].id,
      },
    }),
    await prisma.lesson.create({
      data: {
        name: 'CSS Grid',
        rank: '2',
        content: 'Grilles CSS avancées.',
        state: LessonState.PUBLISHED,
        courseId: courses[2].id,
      },
    }),
  ];

  // Ajout de la progression des utilisateurs sur les leçons du premier cours
  await prisma.lessonOnUser.createMany({
    data: [
      { userId: allUsers[0].id, lessonId: lessons[0].id, progress: Progress.COMPLETED },
      { userId: allUsers[0].id, lessonId: lessons[1].id, progress: Progress.IN_PROGRESS },
      { userId: allUsers[1].id, lessonId: lessons[0].id, progress: Progress.NOT_STARTED },
      { userId: allUsers[1].id, lessonId: lessons[1].id, progress: Progress.NOT_STARTED },
      { userId: allUsers[2].id, lessonId: lessons[0].id, progress: Progress.IN_PROGRESS },
      { userId: allUsers[2].id, lessonId: lessons[1].id, progress: Progress.COMPLETED },
      // Ajoute plus de progressions si besoin
    ],
  });

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