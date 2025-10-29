// src/components/shared/Footer.jsx
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-gray-600 sm:flex-row sm:gap-6 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Cocina DeLicia · Todos los derechos reservados</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-primary-700" href="mailto:hola@lacocinadelicia.com">
            Contacto
          </a>
          <a
            className="hover:text-primary-700"
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
