import { RouterProvider } from "react-router/dom";
import { router } from "./router";
import { LessonPlayerProvider } from "@/features/lesson-player/model";

function App() {
  return (
    <LessonPlayerProvider>
      <RouterProvider router={router} />
    </LessonPlayerProvider>
  );
}

export default App
