// src/router/AppRouter.jsx (o el archivo donde definís las rutas)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./PrivateRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

import ClientLayout from "@/layouts/ClientLayout";
import ChefLayout from "@/layouts/ChefLayout";
import AdminLayout from "@/layouts/AdminLayout";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Forbidden = lazy(() => import("@/pages/Forbidden"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminOrdersPage = lazy(() => import("@/pages/admin/AdminOrdersPage"));
const ChefBoard = lazy(() => import("@/pages/chef/ChefBoard"));
const ClientArea = lazy(() => import("@/pages/client/ClientArea"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const NewOrder = lazy(() => import("@/pages/orders/NewOrder"));
const MyOrders = lazy(() => import("@/pages/orders/MyOrders"));

export function InternalRoutes() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Cargando vista…</div>}>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute allowedRoles={[]} />}>
            <Route path="/app" element={<ClientArea />} />
            <Route path="/orders/new" element={<NewOrder />} />
            <Route path="/orders/mine" element={<MyOrders />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["CHEF", "ADMIN"]} />}>
          <Route element={<ChefLayout />}>
            <Route path="/chef" element={<ChefBoard />} />
            <Route path="/chef/orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>

        {/* Admin con layout + sidebar */}
        <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>

        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <InternalRoutes />
    </BrowserRouter>
  );
}
