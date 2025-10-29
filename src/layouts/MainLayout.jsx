// src/layouts/MainLayout.jsx
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="bg-color-background text-color-text flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
