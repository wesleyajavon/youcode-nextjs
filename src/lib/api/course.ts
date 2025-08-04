
export async function fetchCourseInfo(courseId: string, role: string) {
    const res = await fetch(`/api/${role.toLowerCase()}/courses/${courseId}`, {
        method: "GET",
    });
    if (!res.ok) throw new Error("Failed to fetch course info");
    return res.json();
}

export async function fetchParticipants(courseId: string, page: number, limit: number, search: string, role: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/${role.toLowerCase()}/courses/${courseId}/participants?${params.toString()}`, {
        method: "GET",
    });
    if (!res.ok) throw new Error("Failed to fetch participants");
    return res.json();
}

export async function fetchCourses(page: number, limit: number, search: string, role: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    });
    const res = await fetch(`/api/${role.toLowerCase()}/courses?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
}
