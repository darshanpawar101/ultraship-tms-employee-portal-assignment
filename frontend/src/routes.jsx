import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";

const routeList = [
  {
    path: "/login",
    page: <Login />,
  },
  {
    path: "/dashboard",
    page: <DashboardLayout />,
  },
];

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        {routeList?.map((route) => (
          <Route path={route.path} element={route.page} />
        ))}
      </Routes>
    </>
  );
};
