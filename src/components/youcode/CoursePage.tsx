"use client";

import { usePathname } from "next/navigation";
import CoursePageContent from "./CoursePageContent";
import AdminCoursePageContentUI from "./AdminPageContent";


export function CoursePage(props: { params: Promise<{ id: string }> }) {

    const pathname = usePathname();
    const isAdmin = pathname ? pathname.startsWith("/admin") : false;

    if (!isAdmin) {
        // Pour les utilisateurs, affiche le composant spécifique
        return <CoursePageContent params={props.params} />;
    }

    return (
        <AdminCoursePageContentUI params={props.params} />
    )
}

