export const routes = {
    landing: "/",

    features: "/#features",
    howItWorks: "/#how-it-works",
    pricing: "/#pricing",
    faq: "/#faq",

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
