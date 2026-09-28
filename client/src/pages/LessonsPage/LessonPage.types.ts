export type LessonTab = "all-lessons" | "my-library" | "explore-lessons" | "saved";
export interface LessonsQuery {
    view: LessonTab;

    folderId?: string;
    playlistId?: string;
    // page: number;
    // pageSize: number;
    // sort?: LessonSort;
    // search?: string;
}