import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";

/**
 * SIMPLE TEST CASE FOR THE USER PROFILE COMPONENT
 */
describe("User profile component", () => {
  it("renders the user profile component", () => {
    render(<UserProfile color="#000" name="Nico Gonzalez" />);

    const Profile = screen.getByTestId("user-profile");

    expect(Profile).toBeInTheDocument();
  });
});
