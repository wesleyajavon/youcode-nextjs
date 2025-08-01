# YouCode

YouCode is a modern educational platform built with [Next.js](https://nextjs.org), featuring course management, lesson editing, user/admin dashboards, and AI-powered lesson generation.

Live demo: [https://youcode-nextjs.vercel.app/](https://youcode-nextjs.vercel.app/)

---

## 🚀 Features

- **User & Admin Dashboards**  
  Separate interfaces for students and admins, with role-based access.

- **Course & Lesson Management**  
  Create, edit, and manage courses and lessons with a rich markdown editor.

- **AI Lesson Generation**  
  Admins can generate lesson content using AI (Groq API, Llama 3, etc.) via a simple prompt.

- **Responsive Sidebar Navigation**  
  Toggleable sidebars for both user and admin panels.

- **Authentication & Authorization**  
  Secure access with NextAuth, including role checks for admin routes.

- **Modern UI/UX**  
  Styled with Tailwind CSS, custom markdown rendering, and a light/dark theme.

---

## 🤖 AI Lesson Generation

- Admins can generate lesson content by clicking "Generate with AI" in the lesson editor.
- The backend uses the [Groq API](https://console.groq.com/) (Llama 3, Mixtral, etc.) for fast, free AI text generation.
- You can customize the system prompt in `/src/app/api/admin/courses/[courseId]/lessons/generate/route.ts`.

---

## 🖌️ Custom Markdown Rendering

- Lessons are written and displayed in Markdown.
- Rendering uses `react-markdown` with `remark-gfm` and custom CSS for beautiful, readable lessons.
- See `/src/app/globals.css` for `.prose` styles.

---

## 🧑‍💻 Project Structure

```
/app
  /admin
    ...admin pages and layouts
  /user
    ...user pages and layouts
  /api
    ...API routes (including AI lesson generation)
  Provider.tsx
/components
  /admin
  /layout
  /theme
  ...
/lib
  /features/auth
  ...
/prisma
  schema.prisma
...
```

---

## 🛡️ Security

- Admin routes are protected server-side (see `/app/admin/layout.server.tsx`).
- Only users with the `ADMIN` role can access admin features and AI generation.

---

## 🌐 Deployment

YouCode is deployed on [Vercel](https://vercel.com/).  
Live: [https://youcode-nextjs.vercel.app/](https://youcode-nextjs.vercel.app/)

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [Groq API](https://console.groq.com/)

---

## 📝 License

MIT

---

## ✨ Credits

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Groq](https://groq.com/)
- [Prisma](https://www.prisma.io/)
- [react-markdown](https://github.com/remarkjs/react-markdown)