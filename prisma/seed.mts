import { PrismaClient, CourseState, LessonState, Progress } from '@prisma/client';

const prisma = new PrismaClient();

// Quelques prénoms et noms réalistes
const firstNames = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ivan", "Julia",
  "Kevin", "Laura", "Martin", "Nina", "Oscar", "Paula", "Quentin", "Rachel", "Sam", "Tina"
];
const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Lopez",
  "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez"
];

// Génère des utilisateurs réalistes
function generateUsers(count: number) {
  return Array.from({ length: count }).map((_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    return {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      image: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${(i % 50) + 1}.jpg`,
    };
  });
}

// Quelques sujets de cours tech/web
const techCourses = [
  { name: "React Fundamentals", presentation: "Learn the basics of React.js and component-driven development." },
  { name: "Node.js & Express", presentation: "Build scalable backends with Node.js and Express." },
  { name: "TypeScript Mastery", presentation: "Strongly type your JavaScript with TypeScript." },
  { name: "CSS for Developers", presentation: "Modern CSS, Flexbox, Grid, and responsive design." },
  { name: "Next.js in Practice", presentation: "Server-side rendering and routing with Next.js." },
  { name: "MongoDB Essentials", presentation: "NoSQL database for modern web apps." },
  { name: "API Design", presentation: "RESTful and GraphQL API design best practices." },
  { name: "Testing in JavaScript", presentation: "Unit, integration, and E2E testing with Jest and Cypress." },
  { name: "DevOps Basics", presentation: "CI/CD, Docker, and deployment strategies." },
  { name: "Frontend Performance", presentation: "Optimizing web apps for speed and UX." }
];

// Quelques titres de leçons tech
const lessonTitles = [
  "Introduction & Setup",
  "Core Concepts",
  "Advanced Patterns",
  "Project: Build an App",
  "Testing & Debugging"
];

async function main() {
  // Nettoyage des anciennes données
  await prisma.lessonOnUser.deleteMany();
  await prisma.courseOnUser.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Création de 40 utilisateurs réalistes
  const userData = generateUsers(40);
  await prisma.user.createMany({ data: userData });
  const allUsers = await prisma.user.findMany();

  // Création des 10 cours tech avec différents créateurs
  const courseData = techCourses.map((course, i) => ({
    name: course.name,
    presentation: course.presentation,
    image: `https://picsum.photos/seed/${course.name.replace(/\s/g, '')}/400/200`,
    creatorId: allUsers[i].id,
    state: i % 2 === 0 ? CourseState.PUBLISHED : CourseState.DRAFT,
  }));
  const courses = await Promise.all(courseData.map(data => prisma.course.create({ data })));

  // Ajout de 8 étudiants à chaque cours
  for (let i = 0; i < courses.length; i++) {
    const students = allUsers.slice(i * 4, i * 4 + 8); // chevauchement pour plus de réalisme
    await prisma.courseOnUser.createMany({
      data: students.map(u => ({
        userId: u.id,
        courseId: courses[i].id,
      })),
    });
  }

  // Création de 5 leçons par cours avec titres tech
  for (let i = 0; i < courses.length; i++) {
    for (let j = 0; j < lessonTitles.length; j++) {
      await prisma.lesson.create({
        data: {
          name: `${lessonTitles[j]}`,
          rank: `${j + 1}`,
          content: `# ${lessonTitles[j]}\n\nContent for "${lessonTitles[j]}" in ${courses[i].name}.`,
          state: LessonState.PUBLISHED,
          courseId: courses[i].id,
        },
      });
    }
  }

  // Ajout de la progression des utilisateurs sur les leçons du premier cours
  const lessons = await prisma.lesson.findMany({ where: { courseId: courses[0].id } });
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < lessons.length; j++) {
      await prisma.lessonOnUser.create({
        data: {
          userId: allUsers[i].id,
          lessonId: lessons[j].id,
          progress: j % 3 === 0 ? Progress.COMPLETED : (j % 2 === 0 ? Progress.IN_PROGRESS : Progress.NOT_STARTED),
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