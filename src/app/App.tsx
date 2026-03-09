import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { RealTimeProvider } from "./context/RealTimeContext";

export default function App() {
  return (
    <ThemeProvider>
      <RealTimeProvider>
        <RouterProvider router={router} />
      </RealTimeProvider>
    </ThemeProvider>
  );
}