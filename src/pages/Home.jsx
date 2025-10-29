// src/pages/Home.jsx
import { Link } from "react-router-dom";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { useAuth } from "@/context/auth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold tracking-wide text-primary-700">
              Bienvenido a Cocina DeLicia
            </span>
            <h1 className="text-color-text font-title text-4xl leading-tight font-extrabold sm:text-5xl">
              Sabores que <span className="text-color-primary-500">abrazan</span> en cada bocado
            </h1>
            <p className="mt-4 max-w-prose text-base text-gray-600 sm:text-lg">
              Platos caseros, frescos y con cariño. Pedí online y retiralo a la hora que te quede
              mejor.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={isAuthenticated ? "/app" : "/login"}
                className="bg-color-primary-500 hover:bg-color-primary-600 rounded-lg px-5 py-3 font-semibold text-white"
              >
                {isAuthenticated ? "Ir a mi cuenta" : "Hacer pedido"}
              </Link>
              <a
                href="#destacados"
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold hover:bg-gray-50"
              >
                Ver menú
              </a>
            </div>
          </div>

          {/* Imagen/Mock */}
          <div className="relative">
            <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-200/70 to-tertiary-200/70">
              <span className="font-semibold text-primary-800/80">Imagen del día / Hero</span>
            </div>
          </div>
        </div>
      </section>

      {/* Destacados */}
      <section id="destacados" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-title text-2xl font-bold sm:text-3xl">Productos destacados</h2>
            <Link
              to="/login"
              className="text-sm font-semibold text-primary-700 hover:text-primary-900"
            >
              Ver todo →
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary-100">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h3 className="text-color-text font-title text-2xl font-bold sm:text-3xl">
            ¿Listo para probar?
          </h3>
          <p className="mt-2 text-gray-600">Creá tu cuenta y hacé tu primer pedido en minutos.</p>
          <div className="mt-5">
            <Link
              to={isAuthenticated ? "/app" : "/login"}
              className="bg-color-primary-500 hover:bg-color-primary-600 inline-block rounded-lg px-6 py-3 font-semibold text-white"
            >
              {isAuthenticated ? "Ir a mi cuenta" : "Ingresar / Registrarme"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
