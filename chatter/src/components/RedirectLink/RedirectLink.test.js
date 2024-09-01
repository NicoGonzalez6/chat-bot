import { expect, it, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RedirectLink } from "./RedirectLink";
import { BrowserRouter } from "react-router-dom";

/**
 * SIMPLE TEST CASE FOR THE REDIRECT LINK COMPONENT
 */
describe("Redirect link component", () => {
  const childrenText = "redirect test";

  it("renders the redirect link component", () => {
    render(
      <BrowserRouter>
        <RedirectLink to="/" />
      </BrowserRouter>
    );

    const Redirect = screen.getByTestId("redirect-link");

    expect(Redirect).toBeInTheDocument();
  });

  it("renders the redirect link children", () => {
    render(
      <BrowserRouter>
        <RedirectLink to="/">{childrenText}</RedirectLink>
      </BrowserRouter>
    );

    const Redirect = screen.getByTestId("redirect-link");

    expect(Redirect).toHaveTextContent(childrenText);
  });

  it("calls onClick event handler when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <RedirectLink to="/" onClick={handleClick}>
          {childrenText}
        </RedirectLink>
      </BrowserRouter>
    );

    const Redirect = screen.getByTestId("redirect-link");

    await user.click(Redirect);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
