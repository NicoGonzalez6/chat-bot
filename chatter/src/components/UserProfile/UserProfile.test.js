import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";

/**
 * SIMPLE TEST CASE FOR THE INPUT COMPONENT
 */
describe("Input", () => {
  it("renders the input component", () => {
    render(<UserProfile color="#000" name="Nico Gonzalez" />);

    const Profile = screen.getByTestId("user-profile");

    expect(Profile).toBeInTheDocument();
  });
});
