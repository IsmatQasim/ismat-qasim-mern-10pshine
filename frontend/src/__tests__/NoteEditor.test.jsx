import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NoteEditor from "../pages/NoteEditor";
import { expect, vi, describe, it, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import axios from "axios";
import { toast } from "react-toastify";

vi.mock("jodit-react", () => ({
  default: ({ value, onBlur, "data-testid": testId }) => (
    <div
      data-testid={testId || "content-editor"}
      data-value={value}
      onBlur={(e) => onBlur(e.target.innerHTML)}
    >
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  ),
}));

vi.mock("axios");

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...mod,
    useNavigate: () => navigateMock,
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

const localStorageMock = {
  getItem: vi.fn(() => "fake-token"),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

describe("NoteEditor Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderWithRouter = (
    initialEntries = [{ pathname: "/", state: {} }]
  ) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<NoteEditor />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders create mode correctly", () => {
    renderWithRouter();

    expect(screen.getByText(/Create Note/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter title")).toBeInTheDocument();
    expect(screen.getByText("Save Note")).toBeInTheDocument();
    expect(screen.getByText("Save as Draft")).toBeInTheDocument();
  });

  it("renders edit mode when note data exists in location state", () => {
    renderWithRouter([
      {
        pathname: "/",
        state: {
          note: {
            _id: "123",
            title: "Test Note",
            content: "<p>Hello</p>",
            favourite: false,
          },
        },
      },
    ]);

    expect(screen.getByDisplayValue("Test Note")).toBeInTheDocument();
    expect(screen.getByText(/Edit Note/i)).toBeInTheDocument();
    expect(screen.getByText("Update Note")).toBeInTheDocument();
  });

  it("renders HTML content in editor when editing", () => {
    renderWithRouter([
      {
        pathname: "/",
        state: {
          note: {
            _id: "999",
            title: "Edit Test",
            content: "<p>This is a test</p>",
            favourite: false,
          },
        },
      },
    ]);

    const editor = screen.getByTestId("content-editor");
    expect(editor.innerHTML).toContain("This is a test");
  });

  it("shows validation error if title or content is empty", async () => {
    renderWithRouter();

    fireEvent.click(screen.getByText("Save Note"));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Title and Content cannot be empty!"
      )
    );
  });

  it("calls axios POST on new note save", async () => {
    axios.post.mockResolvedValueOnce({});
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "My Note" },
    });

    const editor = screen.getByTestId("content-editor");
    fireEvent.blur(editor, {
      target: { innerHTML: "<p>My Content</p>" },
    });

    fireEvent.click(screen.getByText("Save Note"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/notes"),
        expect.objectContaining({
          title: "My Note",
          content: "<p>My Content</p>",
        }),
        expect.any(Object)
      )
    );
  });

  it("calls axios POST with status='draft' when 'Save as Draft' is clicked", async () => {
    axios.post.mockResolvedValueOnce({});
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "Draft Note" },
    });

    const editor = screen.getByTestId("content-editor");
    fireEvent.blur(editor, {
      target: { innerHTML: "<p>Draft Content</p>" },
    });

    fireEvent.click(screen.getByText("Save as Draft"));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/notes"),
        expect.objectContaining({
          title: "Draft Note",
          content: "<p>Draft Content</p>",
          status: "draft",
        }),
        expect.any(Object)
      )
    );
  });

  it("calls axios PUT on note update", async () => {
    axios.put.mockResolvedValueOnce({});
    renderWithRouter([
      {
        pathname: "/",
        state: {
          note: {
            _id: "note123",
            title: "Old Title",
            content: "<p>Old content</p>",
            favourite: true,
          },
        },
      },
    ]);

    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "Updated Title" },
    });

    const editor = screen.getByTestId("content-editor");
    fireEvent.blur(editor, {
      target: { innerHTML: "<p>Updated Content</p>" },
    });

    fireEvent.click(screen.getByText("Update Note"));

    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("/api/notes/update/note123"),
        expect.objectContaining({
          title: "Updated Title",
          content: "<p>Updated Content</p>",
        }),
        expect.any(Object)
      )
    );
  });

  it("navigates away on cancel click if cancel button exists", () => {
    renderWithRouter();

    const cancelButton = screen.queryByText("Cancel");
    if (cancelButton) {
      fireEvent.click(cancelButton);
      expect(navigateMock).toHaveBeenCalled();
    }
  });
});
