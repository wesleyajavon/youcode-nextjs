import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schéma de validation pour la requête
const contextRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = contextRequestSchema.parse(body);

    console.log('🔍 Extraction du contexte depuis l\'URL:', url);

    // Regex pour extraire course ID et lesson ID
    const courseMatch = url.match(/\/courses\/([a-zA-Z0-9]+)/);
    const lessonMatch = url.match(/\/lessons\/([a-zA-Z0-9]+)/);

    const courseId = courseMatch ? courseMatch[1] : null;
    const lessonId = lessonMatch ? lessonMatch[1] : null;

    console.log('📚 Course ID trouvé:', courseId);
    console.log('📖 Lesson ID trouvé:', lessonId);

    let courseContext = '';
    let lessonContext = '';

    // Récupérer les informations du cours si disponible
    if (courseId) {
      try {
        const course = await prisma.course.findUnique({
          where: { id: courseId },
          select: {
            name: true,
            presentation: true,
          },
        });

        if (course) {
          courseContext = course.name;
          console.log('✅ Cours trouvé:', course.name);
        } else {
          console.log('⚠️ Cours non trouvé pour l\'ID:', courseId);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération du cours:', error);
      }
    }

    // Récupérer les informations de la leçon si disponible
    if (lessonId) {
      try {
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          select: {
            name: true,
            content: true,
          },
        });

        if (lesson) {
          lessonContext = lesson.name;
          console.log('✅ Leçon trouvée:', lesson.name);
        } else {
          console.log('⚠️ Leçon non trouvée pour l\'ID:', lessonId);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération de la leçon:', error);
      }
    }

    const context = {
      courseContext,
      lessonContext,
      courseId: courseId || null,
      lessonId: lessonId || null,
      url,
    };

    console.log('🎯 Contexte extrait:', context);

    return NextResponse.json({
      success: true,
      context,
    });

  } catch (error) {
    console.error('❌ Erreur dans l\'API de contexte:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'URL invalide fournie' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Méthode GET pour tester l'API
export async function GET() {
  return NextResponse.json({
    message: 'API de Contexte IA YouCode - Opérationnelle',
    status: 'active',
    usage: 'POST avec { "url": "votre_url_youcode" }',
    example: {
      url: 'http://localhost:3000/user/courses/cme0frc370015a2lkfm0m5fr2/lessons/cme0frduf004da2lkio658dk7',
      expectedContext: {
        courseContext: 'Titre du cours',
        lessonContext: 'Titre de la leçon',
        courseId: 'cme0frc370015a2lkfm0m5fr2',
        lessonId: 'cme0frduf004da2lkio658dk7'
      }
    }
  });
}
