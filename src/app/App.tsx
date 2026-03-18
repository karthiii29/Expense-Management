import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { RealTimeProvider } from "./context/RealTimeContext";
import { DataProvider } from "./context/DataContext";

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <RealTimeProvider>
          <RouterProvider router={router} />
        </RealTimeProvider>
      </DataProvider>
    </ThemeProvider>
  );
}