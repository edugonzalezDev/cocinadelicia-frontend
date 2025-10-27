// src/App.jsx
import "@/config/amplify"; // Inicializa AWS Amplify (solo una vez)
import AppRouter from "@/router/AppRouter"; // Nuestro router con layouts y roles
import "./App.css";

function App() {
  return <AppRouter />;
}

export default App;
