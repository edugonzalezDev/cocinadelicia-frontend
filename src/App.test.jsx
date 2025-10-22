import { render, screen } from "@testing-library/react";
import { test, expect } from "@jest/globals";
import React from "react";

function App() {
  return <h1>Hola Cocina DeLicia</h1>;
}

test("renderiza título", () => {
  render(<App />);
  expect(screen.getByText(/Cocina DeLicia/i)).toBeInTheDocument();
});
