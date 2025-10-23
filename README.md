# Cocina DeLicia – Frontend (React + Vite)

> **Estado:** Sprint 1 · Historia 1 · Versión extendida inicial (documento vivo)

Aplicación web **mobile‑first** para el emprendimiento familiar _Cocina DeLicia_. Este repositorio contiene el **frontend** construido con **React + Vite + TailwindCSS**, enrutamiento con **React Router DOM**, estado global con **Zustand** (planificado) y **Context API** (solo para autenticación más adelante).

---

## 🧭 Índice

- [Visión general](#-visión-general)
- [Stack técnico](#-stack-técnico)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Scripts](#-scripts)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura de carpetas](#-estructura-de-carpetas)
- [Convenciones y ramas](#-convenciones-y-ramas)
- [Roadmap breve](#-roadmap-breve)
- [CI/CD (placeholder)](#-cicd-placeholder)
- [Despliegue (placeholder)](#-despliegue-placeholder)
- [Troubleshooting](#-troubleshooting)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Visión general

- **Objetivo:** ofrecer una interfaz rápida y clara para que clientes y administradores gestionen **catálogo, pedidos y estados**.
- **Dominio previsto (prod):** `https://lacocinadelicia.com` _(por definir)_
- **Backend API:** endpoint público **por definir** (EC2 / API Gateway, etc.).

> Nota: en **Sprint 1** nos enfocamos en la base del repo, estructura, scripts y convenciones. Autenticación con Cognito y stores de Zustand llegarán en sprints siguientes.

---

## 🧪 Stack técnico

- **Framework:** React 18 + **Vite**
- **Estilos:** TailwindCSS
- **Routing:** React Router DOM
- **Estado global:** Context API (solo Auth en el futuro) + **Zustand** (productos, pedidos, UI)
- **Build:** Vite
- **Gestor de paquetes:** **npm**
- **Testing:** a definir según _Convenciones.md_ (Vitest/Testing Library en sprints próximos)

---

## 🔧 Requisitos previos

- **Node.js** `v24.9`
- **npm** `v11.6`
- Git

> Verificá versiones:

```bash
node -v
npm -v
```

---

## 🚀 Instalación y ejecución

```bash
# clonar
git clone <URL_DEL_REPO_FRONTEND>
cd cocinadelicia-frontend

# instalar deps
npm install

# ejecutar en desarrollo
npm run dev

# build producción
npm run build

# previsualizar build
npm run preview
```

---

## 📜 Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "format": "prettier --write .",
    "lint": "eslint . --ext .js,.jsx"
  }
}
```

> **Husky/Commitlint/ESLint/Prettier** ya instalados (ver hooks en `.husky/`).

---

## 🔐 Variables de entorno

Crear un archivo `.env` en la raíz. Vite requiere prefijo `VITE_`.

```dotenv
VITE_API_BASE_URL=https://api.lacocinadelicia.com # placeholder
VITE_COGNITO_USER_POOL_ID=us-xx_XXXXXXXXX         # placeholder
VITE_COGNITO_CLIENT_ID=XXXXXXXXXXXX               # placeholder
VITE_COGNITO_REGION=us-xx                         # placeholder
VITE_S3_PUBLIC_BUCKET=cocinadelicia-assets        # opcional/placeholder
VITE_ENV=development
```

> Por ahora son **placeholders**. Se completarán cuando se configure Cognito/S3/endpoint backend.

---

## 🗂️ Estructura de carpetas

> Basada en **Convenciones.md** del proyecto. Puede evolucionar.

```
src/
├─ assets/                # Imágenes, íconos, fuentes
├─ components/            # Componentes reutilizables
│  ├─ ui/                 # Botón, Modal, etc.
│  └─ shared/             # Navbar, Footer, etc.
├─ context/               # AuthContext (futuro)
├─ hooks/                 # Custom hooks reutilizables
├─ layouts/               # Layouts por rol (Client/Chef/Admin)
├─ pages/                 # Vistas principales (Landing, Login, Admin, etc.)
├─ routes/                # AppRouter / protección de rutas
├─ store/                 # Zustand stores (por definir)
├─ utils/                 # Helpers
├─ App.jsx
├─ main.jsx
└─ index.css
```

---

## 🔀 Convenciones y ramas

- **Rama principal:** `main`
- **Ramas de trabajo:** `feature/<nombre>`, `bugfix/<nombre>`, `hotfix/<nombre>`
- **Commits:** _Conventional Commits_ (ej: `feat: agregar landing básica`)

> Ver documento **Convenciones.md** para detalle de estilo, linters y estructura.

---

## 🗺️ Roadmap breve

- **Sprint 1:** base del repo, estructura, scripts, landing mínima
- **Sprint 2:** CRUD pedidos (vista cliente básica)
- **Sprint 3:** visor de pedidos para chef (lista/Kanban)
- **Sprint 4:** catálogo público con imágenes (S3)
- **Sprint 5:** autenticación y roles (Cognito + guarding de rutas)

_(Basado en `Plan_Sprints_CocinaDeLicia.md`)_

---

## 🔄 CI/CD (placeholder)

- **Objetivo:** GitHub Actions → build Vite → deploy a **S3 + CloudFront** (inval cache)
- **Secrets esperados (placeholder):** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`
- **Pipeline:** se documentará en Sprint 1/2 cuando se creen los recursos AWS.

---

## ☁️ Despliegue (placeholder)

- **S3 estático + CloudFront** (dominio `lacocinadelicia.com`)
- **Pasos:** build → sync a S3 → invalidar CloudFront
- **Notas:** configurar `SPA fallback` (index.html) para rutas de React Router

---

## 🧰 Troubleshooting

- **Pantalla en blanco / rutas rotas:** verificar SPA fallback en CloudFront/S3
- **CORS:** asegurar que el backend permite el origen del dominio del frontend
- **Cache desactualizada:** invalidar distribución de CloudFront tras cada deploy
- **Variables Vite:** recordar prefijo `VITE_` y reiniciar `npm run dev` tras cambios

---

## 📄 Licencia

Proyecto **privado** por el momento. **All rights reserved © Eduardo González**.

---

## 📬 Contacto

- Autor: **Eduardo González**
- Sitio/Portfolio: _(por definir)_
- Email: _(por definir)_
