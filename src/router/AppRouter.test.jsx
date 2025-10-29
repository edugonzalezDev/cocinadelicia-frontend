import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { InternalRoutes } from "./AppRouter";
import MockAuthProvider from "@/test/MockAuthProvider";
import { vi } from "vitest";

// Mocks para que los tests busquen textos consistentes:
vi.mock("@/pages/client/ClientArea", () => ({
  default: () => <div>Área Cliente</div>,
}));
vi.mock("@/pages/Forbidden", () => ({
  default: () => (
    <div className="flex min-h-screen items-center justify-center bg-red-50">
      <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
    </div>
  ),
}));
vi.mock("@/pages/admin/AdminDashboard", () => ({
  default: () => (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Administración</h1>
      <h2 className="text-lg font-medium">Panel de Administración</h2>
    </div>
  ),
}));
vi.mock("@/pages/chef/ChefBoard", () => ({
  default: () => (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Panel de Cocina</h1>
      <h2 className="text-lg font-medium">Panel del Chef</h2>
    </div>
  ),
}));

/** Helper: renderiza las rutas internas dentro de MemoryRouter y MockAuth */
function renderWithRouter(ui, { route = "/", auth = {} } = {}) {
  window.history.pushState({}, "Test page", route);
  return render(
    <MockAuthProvider {...auth}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </MockAuthProvider>,
  );
}

describe("AppRouter – rutas públicas y privadas", () => {
  it("renderiza Home en /", async () => {
    renderWithRouter(<InternalRoutes />, { route: "/" });
    // Busca el H1 del Hero actual
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /sabores que.*en cada bocado/i,
      }),
    ).toBeInTheDocument();
  });

  it("renderiza Login en /login cuando no está autenticado", async () => {
    renderWithRouter(<InternalRoutes />, { route: "/login", auth: { isAuthenticated: false } });
    // Del componente pages/auth/Login.jsx
    expect(await screen.findByRole("heading", { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it("redirige de /login a /app si ya está autenticado (PublicOnlyRoute)", async () => {
    render(
      <MockAuthProvider isAuthenticated={true} roles={[]}>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            {/* Marcador consistente */}
            <Route path="/app" element={<div data-testid="route-app">Área Cliente</div>} />
            <Route path="/*" element={<InternalRoutes />} />
          </Routes>
        </MemoryRouter>
      </MockAuthProvider>,
    );
    expect(await screen.findByTestId("route-app")).toBeInTheDocument();
  });

  it("en /admin: si no está autenticado, redirige a /login", async () => {
    render(
      <MockAuthProvider isAuthenticated={false}>
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route path="/*" element={<InternalRoutes />} />
            <Route path="/login" element={<div>Login (Mock)</div>} />
          </Routes>
        </MemoryRouter>
      </MockAuthProvider>,
    );

    expect(await screen.findByText(/Login \(Mock\)/i)).toBeInTheDocument();
  });

  it("en /admin: si autenticado sin rol ADMIN, redirige a /forbidden", async () => {
    renderWithRouter(<InternalRoutes />, {
      route: "/admin",
      auth: { isAuthenticated: true, roles: ["CLIENT"] },
    });
    expect(await screen.findByText(/Acceso Denegado/i)).toBeInTheDocument();
  });

  it("en /admin: si autenticado con rol ADMIN, renderiza Panel Admin", async () => {
    renderWithRouter(<InternalRoutes />, {
      route: "/admin",
      auth: { isAuthenticated: true, roles: ["ADMIN"] },
    });
    expect(await screen.findByText(/Panel de Administración/i)).toBeInTheDocument();
  });

  it("en /chef: permite CHEF o ADMIN", async () => {
    renderWithRouter(<InternalRoutes />, {
      route: "/chef",
      auth: { isAuthenticated: true, roles: ["CHEF"] },
    });
    expect(await screen.findByText(/Panel del Chef/i)).toBeInTheDocument();
  });
});
