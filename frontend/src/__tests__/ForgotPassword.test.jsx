import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, beforeEach, it, vi, describe } from "vitest";
import ForgotPassword from "../components/ForgotPassword";
import axios from "axios";
import '@testing-library/jest-dom'
import { ToastContainer } from "react-toastify";

vi.mock("axios");
describe("ForgotPassword Component", () => {
  beforeEach(() => {
    render(
      <>
        <ToastContainer />
        <ForgotPassword />
      </>
    );
  });

  it("renders the form elements correctly", () => {
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Reset Link" })
    ).toBeInTheDocument();
  });

  it("allows user to type in email input", () => {
    const input = screen.getByPlaceholderText("Enter your email");
    fireEvent.change(input, { target: { value: "user@example.com" } });
    expect(input.value).toBe("user@example.com");
  });

  it("calls API and shows success toast on valid submission", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    const input = screen.getByPlaceholderText("Enter your email");
    const button = screen.getByRole("button", { name: "Send Reset Link" });

    fireEvent.change(input, { target: { value: "user@example.com" } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(
        screen.getByText("Reset link sent to your email")
      ).toBeInTheDocument()
    );
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/forgot-password"),
      { email: "user@example.com" }
    );
  });

  it("shows error toast on API failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Email not found" } },
    });

    const input = screen.getByPlaceholderText("Enter your email");
    const button = screen.getByRole("button", { name: "Send Reset Link" });

    fireEvent.change(input, { target: { value: "wrong@example.com" } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(screen.getByText("Email not found")).toBeInTheDocument()
    );
  });
});
