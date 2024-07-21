import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

/**
 * SIMPLE TEST CASE FOR THE INPUT COMPONENT
 */
describe("Input", () => {
  it("renders the input component", () => {
    render(<Input label="Email" />);

    const input = screen.getByTestId("input-wrapper");

    expect(input).toBeInTheDocument();
  });

  it("should render the label correctly", () => {
    render(<Input label="Email" />);

    const input = screen.getByTestId("input-wrapper");

    expect(input).to.toHaveTextContent("Email");
  });
});
