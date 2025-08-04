import { Progress } from "@/types/progress";

export async function fetchLessons(courseId: string, page: number, limit: number, search: string, role: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/${role.toLowerCase()}/courses/${courseId}/lessons?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch lessons");
    return res.json();
}

export async function fetchPublicLessons(page: number, limit: number, search: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/public/lessons?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch lessons");
    return res.json();
}

export function getProgressBadgeColor(progress: Progress) {
    switch (progress) {
        case "COMPLETED":
            return "bg-primary text-accent-foreground";
        case "IN_PROGRESS":
            return "bg-accent text-accent-foreground";
        case "NOT_STARTED":
        default:
            return "bg-muted text-muted-foreground";
    }
}

export function getProgressLabel(progress: Progress) {
    switch (progress) {
        case "COMPLETED":
            return "Completed";
        case "IN_PROGRESS":
            return "In Progress";
        case "NOT_STARTED":
        default:
            return "Not Started";
    }
}