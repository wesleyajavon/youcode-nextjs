import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { getAuthSession, getRequiredAuthSession } from "@/lib/auth";
import { LoginButton } from "@/lib/features/auth/LoginButton";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { CircleDollarSign, PencilLine, Rocket, Star } from "lucide-react";
import Link from "next/link";

const FAQValues = [
  {
    question: "What are the limits for course creation on YouCode?",
    answer:
      "With YouCode, the only limits are your creativity and the content you are legally allowed to share. There are no restrictions on the number of courses or lessons you can create.",
  },
  {
    question: "Can I use YouCode to publish paid courses?",
    answer:
      "Currently, YouCode is focused on open learning. While payment support is not built-in yet, you can share links or gated content manually if needed.",
  },
  {
    question: "Who can create courses on YouCode?",
    answer:
      "Anyone with a YouCode account can create and publish courses, whether you're a student, teacher, or self-taught learner.",
  },
  {
    question: "Is YouCode mobile-friendly?",
    answer:
      "Yes! YouCode is fully responsive and works great on mobile, tablet, and desktop devices.",
  },
  {
    question: "How do I enroll in a course?",
    answer:
      "Simply browse the course catalog, click on a course you're interested in, and hit the enroll button. Enrollment is instant.",
  },
  {
    question: "Can I track my progress through a course?",
    answer:
      "Yes, YouCode tracks which lessons you’ve completed, making it easy to resume where you left off.",
  },
  {
    question: "Is YouCode free to use?",
    answer:
      "Yes, YouCode is completely free to use for both learners and instructors.",
  },
  {
    question: "Can I edit or delete my course after publishing?",
    answer:
      "Absolutely. You have full control over your published content and can update or remove courses at any time.",
  },
  {
    question: "Is there a review or feedback system for courses?",
    answer:
      "A feedback and rating system is currently in development and will be available in a future update.",
  },
  {
    question: "How is my data stored and secured on YouCode?",
    answer:
      "YouCode uses secure, industry-standard practices to store and manage user data, ensuring your content and personal information remain safe.",
  }
]


export default async function Home() {

  const session = await getAuthSession()


  return (
    <div className="bg-background w-full">
      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-24 bg-gradient-to-b from-white-100 to-primary/10">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100/60 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto text-center gap-6">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white to-gray-700 bg-clip-text text-transparent">
            {!session
              ? "Learn and teach in seconds"
              : session.user.role === "ADMIN"
                ? "Share your knowledge with the world"
                : "Learn from the best, instantly"}
          </h1>
          <h2 className="text-2xl font-bold text-muted-foreground">
            {!session
              ? "YouCode is the YouTube of education. Create or enroll in online courses in seconds."
              : session.user.role === "ADMIN"
                ? "YouCode lets you create and publish online courses in seconds."
                : "YouCode is the YouTube of education. Discover and enroll in courses in seconds."}
          </h2>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={28} fill="currentColor" />
              ))}
            </div>
            <p className="font-semibold text-muted-foreground">
              {!session
                ? "+500 teachers and 5000 students trust us."
                : session.user.role === "ADMIN"
                  ? "+500 teachers trust us."
                  : "+5000 students are learning with us."}
            </p>
          </div>

        </div>
      </section>

      {/* VALUES */}
      <section className="bg-gradient-to-b from-primary/10 to-white py-16 text-white-foreground">
        <div className="m-auto flex max-w-5xl flex-col gap-8 px-6 md:flex-row md:gap-12">
          <div className="flex flex-1 flex-col items-center gap-3 text-center">
            <PencilLine size={36} />
            <Typography variant="h3">MDX Based</Typography>
            <Typography variant="large">
              YouCode is based on MDX. You can write your courses in Markdown and
              React.
            </Typography>
          </div>
          <div className="flex flex-1 flex-col items-center gap-3 text-center">
            <CircleDollarSign size={36} />
            <Typography variant="h3">Free to use</Typography>
            <Typography variant="large">
              You want to publish your courses for free? YouCode is free to use.
            </Typography>
          </div>
          <div className="flex flex-1 flex-col items-center gap-3 text-center">
            <Rocket size={36} />
            <Typography variant="h3">Next.js project</Typography>
            <Typography variant="large">
              This app is built from scratch with:
              <br />
              Next.js, React, and Tailwind CSS.
            </Typography>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative flex flex-col items-center justify-center py-20 px-6 bg-white">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-100/60 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-4xl font-extrabold bg-gradient-to-l from-gray-300 to-gray-700 bg-clip-text text-transparent">
            Start using YouCode today!
          </h2>
          {!session && (
            <LoginButton label="Sign in" className={cn(
              buttonVariants({ size: "lg" }),
              "px-8 py-6 text-lg font-bold shadow-lg bg-gradient-to-t from-gray-900 to-gray-300 text-white border-0"
            )} />
          )}
          {session?.user.role === "ADMIN" && (
            <Link
              href="/admin"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 py-6 text-lg font-bold shadow-lg bg-gradient-to-t from-gray-900 to-gray-300 text-white border-0"
              )}
            >
              Start here !
            </Link>
          )}
          {session?.user.role === "USER" && (
            <Link
              href="/user"
              className={cn(
                buttonVariants({ size: "lg" }),
                "px-8 py-6 text-lg font-bold shadow-lg bg-gradient-to-t from-gray-900 to-gray-300 text-white border-0"
              )}
            >
              Start here !
            </Link>
          )}

          
        </div>
      </section>

      {/* FAQ */}
      <section
        className="bg-primary/10 py-16 text-secondary-foreground"
        style={{
          // @ts-ignore
          "--border": "240 3.7% 25%",
        }}
      >
        <div className="m-auto flex max-w-5xl flex-col gap-6 px-6">
          <h2 className="text-4xl font-extrabold mb-4">FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQValues.map((value, i) => (
              <AccordionItem value={i + value.question} key={i}>
                <AccordionTrigger>{value.question}</AccordionTrigger>
                <AccordionContent>{value.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Me */}

      <section
        id="contact"
        className="bg-gradient-to-b from-primary/10 to-black py-16 text-white"
      >
        <div className="m-auto flex max-w-5xl flex-col gap-6 px-6 items-center text-center">
          <h2 className="text-4xl font-extrabold mb-2">Contact</h2>
          <p className="mb-6 text-base sm:text-lg text-white/90">
            Get in touch via email or social media!
          </p>
          <a
            href="mailto:wesleyajavon2203@hotmail.com"
            className="text-neutral-200 text-sm sm:text-base hover:underline mb-4"
          >
            wesleyajavon2203@hotmail.com
          </a>
          <div className="flex gap-6 justify-center text-2xl">
            <a
              href="https://github.com/wesleyajavon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-neutral-300"
            >
              {/* Remplace par ton icône GitHub si tu utilises Lucide ou Heroicons */}
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            </a>
            <a
              href="https://linkedin.com/in/wesleyajv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-neutral-300"
            >
              {/* Remplace par ton icône LinkedIn si tu utilises Lucide ou Heroicons */}
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v5.597z" /></svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}