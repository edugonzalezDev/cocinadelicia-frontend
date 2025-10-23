import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React from "react";

function App() {
  return <h1>Hola Cocina DeLicia</h1>;
}

describe("App", () => {
  it("renderiza el título", () => {
    render(<App />);
    expect(screen.getByText(/Hola Cocina DeLicia/i)).toBeInTheDocument();
  });
});
