// src/components/home/FeaturedProducts.jsx
const mock = [
  { id: 1, name: "Tarta de Jamón y Queso", price: 180, tag: "Nuevo" },
  { id: 2, name: "Empanadas Criollas (x3)", price: 200, tag: "Popular" },
  { id: 3, name: "Pastas Caseras", price: 240, tag: "Clásico" },
];

export default function FeaturedProducts() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mock.map((item) => (
        <li
          key={item.id}
          className="rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
        >
          <div className="grid aspect-[4/3] place-items-center rounded-t-2xl bg-tertiary-100">
            <span className="text-sm text-tertiary-700/80">{item.tag}</span>
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="mt-1 text-sm text-gray-600">Hecho en el día</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold">${item.price}</span>
              <button
                className="bg-color-secondary-500 hover:bg-color-secondary-600 rounded-md px-3 py-2 text-sm text-white"
                onClick={() => alert("Próximamente 🧡")}
              >
                Pedir
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
