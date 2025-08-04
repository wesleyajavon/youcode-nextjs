export type FetchCourseInfoResponse = {
    course: {
        id: string;
        name: string;
        presentation: string;
        image: string;
        createdAt: string;
        state: string;
        totalUsers: number;
    };
};

export type FetchParticipantsResponse = {
    users: {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
        };
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};