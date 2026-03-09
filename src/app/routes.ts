import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Expenses } from "./pages/Expenses";
import { Family } from "./pages/Family";
import { Reports } from "./pages/Reports";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { AIFeatures } from "./pages/AIFeatures";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true,       Component: Dashboard  },
      { path: "expenses",  Component: Expenses   },
      { path: "family",    Component: Family     },
      { path: "reports",   Component: Reports    },
      { path: "analytics", Component: Analytics  },
      { path: "ai",        Component: AIFeatures },
      { path: "settings",  Component: Settings   },
    ],
  },
]);