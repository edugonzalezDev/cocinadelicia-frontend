import { useAuth } from "@/context/auth";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <button onClick={login} className="rounded-xl bg-black px-4 py-2 text-white">
        Continuar con email/contraseña
      </button>

      <button onClick={loginWithGoogle} className="rounded-xl border px-4 py-2">
        Continuar con Google
      </button>
    </div>
  );
}
