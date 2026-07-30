export const routes = {
    landing: "/",

    login: "/login",
    register: "/register",

    dashboard: "/dashboard",
    lessons: "/lessons",
    createLesson: "/create-lesson",
    billing: "/billing",
    settings: "/settings",

    lessonDetails: (lessonId: string | number) => 
        `/lessons/${lessonId}`
} as const;
