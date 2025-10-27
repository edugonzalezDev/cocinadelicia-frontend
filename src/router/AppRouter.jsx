import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth";
import PrivateRoute from "./PrivateRoute";

// Pages (crea stubs si no las tenés)
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Forbidden from "@/pages/Forbidden";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ChefBoard from "@/pages/chef/ChefBoard";
import ClientArea from "@/pages/client/ClientArea";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forbidden" element={<Forbidden />} />

          {/* Cliente autenticado (cualquier rol autenticado) */}
          <Route element={<PrivateRoute allowedRoles={[]} />}>
            <Route path="/app" element={<ClientArea />} />
          </Route>

          {/* Chef o Admin */}
          <Route element={<PrivateRoute allowedRoles={["CHEF", "ADMIN"]} />}>
            <Route path="/chef" element={<ChefBoard />} />
          </Route>

          {/* Solo Admin */}
          <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
