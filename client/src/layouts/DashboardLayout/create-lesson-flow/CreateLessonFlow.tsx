import { Outlet } from "react-router";
import { CreateLessonProvider } from "@/features/create-lesson/model";

export function CreateLessonFlow() {
  return (
    <CreateLessonProvider>
      <Outlet />
    </CreateLessonProvider>
  );
}