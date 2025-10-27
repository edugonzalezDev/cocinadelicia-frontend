import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/context/auth";
import PrivateRoute from "./PriveateRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

import ClientLayout from "@/layouts/ClientLayout";
import ChefLayout from "@/layouts/ChefLayout";
import AdminLayout from "@/layouts/AdminLayout";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Forbidden = lazy(() => import("@/pages/Forbidden"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const ChefBoard = lazy(() => import("@/pages/chef/ChefBoard"));
const ClientArea = lazy(() => import("@/pages/client/ClientArea"));
const NotFound = lazy(() => import("@/pages/NotFound")); // crea un stub simple

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={null /* o <Spinner/> */}>
          <Routes>
            <Route element={<ClientLayout />}>
              <Route path="/" element={<Home />} />

              {/* Rutas públicas-solo (login, register, etc.) */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Cliente autenticado (cualquier rol autenticado) */}
              <Route element={<PrivateRoute allowedRoles={[]} />}>
                <Route path="/app" element={<ClientArea />} />
              </Route>
            </Route>

            {/* Chef o Admin */}
            <Route element={<PrivateRoute allowedRoles={["CHEF", "ADMIN"]} />}>
              <Route element={<ChefLayout />}>
                <Route path="/chef" element={<ChefBoard />} />
              </Route>
            </Route>

            {/* Solo Admin */}
            <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
