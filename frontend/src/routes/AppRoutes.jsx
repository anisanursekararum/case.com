import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage.jsx";
import TestSuiteListPage from "../features/test-suites/pages/TestSuiteListPage.jsx";
import TestSuiteList from "../features/test-suites/components/TestSuiteList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "test-suites", element: <TestSuiteListPage /> },
      { path: "test-suite-collapsed", element: <TestSuiteList /> },
      // Tambahkan route lain di sini jika perlu
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
