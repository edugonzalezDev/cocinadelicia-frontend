import React from "react";

const Home = () => {
  return (
    <div className="home">
      <header className="hero">
        <h1>Bienvenido a Cocina Delicia</h1>
        <p>Descubre los mejores sabores</p>
      </header>

      <main>
        <section className="featured">
          <h2>Platos Destacados</h2>
          <div className="featured-items">{/* Contenido de platos destacados */}</div>
        </section>

        <section className="about">
          <h2>Acerca de Nosotros</h2>
          <p>En Cocina Delicia ofrecemos los mejores platos preparados con ingredientes frescos.</p>
        </section>
      </main>
    </div>
  );
};

export default Home;
