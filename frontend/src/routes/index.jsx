import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TeamRequest from "../pages/admin/TeamRequest";
import UserRequest from "../pages/admin/UserRequest";
import Settings from "../pages/Settings";
import SelectAction from "../pages/SelectAction";
import JoinTeam from "../pages/JoinTeam";
import CreateTeam from "../pages/CreateTeam";
import ChooseTeam from "../pages/ChooseTeam";
import AuthFlowLayout from "../layouts/AuthFlowLayout";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (requires login) */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin/team-request" element={<TeamRequest />} />
        <Route path="/admin/user-request" element={<UserRequest />} />
      </Route>

      {/* Protected but outside layout (like team selection) */}
      <Route element={<PrivateRoute><AuthFlowLayout /></PrivateRoute>}>
        <Route path="/select-action" element={<SelectAction />} />
        <Route path="/join-team" element={<JoinTeam />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/choose-team" element={<ChooseTeam />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
