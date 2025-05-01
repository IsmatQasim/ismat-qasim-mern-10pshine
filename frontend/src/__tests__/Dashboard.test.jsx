// Dashboard.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { describe, it, expect } from "vitest";
import '@testing-library/jest-dom'

describe("Dashboard", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText("All Notes")).toBeInTheDocument();
    expect(screen.getByText("Create Note")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Today's Notes")).toBeInTheDocument();
    expect(screen.getByText("Favourite Notes")).toBeInTheDocument();
    expect(screen.getByText("Drafts")).toBeInTheDocument();
  });

  it("renders dynamic date and time", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const dateElement = screen.getByText((content) =>
      content.includes("📅")
    );
    const timeElement = screen.getByText((content) =>
      content.includes("🕒")
    );
    expect(dateElement).toBeInTheDocument();
    expect(timeElement).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /All Notes/i })).toHaveAttribute(
      "href",
      "/notes/all"
    );
    expect(screen.getByRole("link", { name: /Create Note/i })).toHaveAttribute(
      "href",
      "/editor"
    );
    expect(screen.getByRole("link", { name: /Profile/i })).toHaveAttribute(
      "href",
      "/profile"
    );
  });
});
