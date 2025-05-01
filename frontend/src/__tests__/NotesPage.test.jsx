import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotesPage from '../pages/NotesPage';
import axios from 'axios';
import { expect, vi, describe, beforeEach, it, afterEach } from 'vitest';  
import '@testing-library/jest-dom';


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


vi.mock('axios');

describe('NotesPage Component', () => {
  const mockIcons = [
    { icon: "Heart", isActive: false, id: '1' },
    { icon: "HeartFilled", isActive: true, id: '2' },
    { icon: "Edit", isActive: false, id: '1' },
    { icon: "Trash", isActive: false, id: '1' },
    { icon: "Eye", isActive: false, id: '1' },
    { icon: "SquarePlus", isActive: true, id: 'create' },
    { icon: "Home", isActive: true, id: 'home' },
  ];

  const mockNotes = [
    {
      _id: '1',
      title: 'Test Note 1',
      content: 'This is a test note.',
      favorite: false,
      status: 'active',
      createdAt: '2025-05-02',
      icons: mockIcons.filter(icon => icon.id === '1'),
    },
    {
      _id: '2',
      title: 'Test Note 2',
      content: 'This is another test note.',
      favorite: true,
      status: 'active',
      createdAt: '2025-05-02',
      icons: mockIcons.filter(icon => icon.id === '2'),
    },
  ];

  beforeEach(() => {
    
    vi.clearAllMocks();
    
    
    axios.get.mockResolvedValue({ data: mockNotes });
    axios.patch.mockResolvedValue({});
    axios.delete.mockResolvedValue({});
    
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'fake-token'),
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      writable: true
    });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the NotesPage component', async () => {
    render(
      <MemoryRouter initialEntries={['/all']}>
        <NotesPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading-message')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('notes-container')).toBeInTheDocument());
  });

  it('should display notes correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/all']}>
        <NotesPage />
      </MemoryRouter>
    );

    
    await waitFor(() => expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument());
    
    
    await waitFor(() => expect(screen.getByTestId('note-1')).toBeInTheDocument());
    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    expect(screen.getByText('Test Note 2')).toBeInTheDocument();
  });

  it('should handle favorite button click', async () => {
    render(
      <MemoryRouter initialEntries={['/all']}>
        <NotesPage />
      </MemoryRouter>
    );
  
    
    await waitFor(() => expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument());
    
    
    const favButton = await screen.findByTestId('favorite-icon-2');
    fireEvent.click(favButton);
  
    
    await waitFor(() => expect(axios.patch).toHaveBeenCalled());
    
    
    expect(screen.getByTestId('unfavorite-icon-2')).toBeInTheDocument();
  });
  
  it('should handle edit button click', async () => {
    render(
      <MemoryRouter initialEntries={['/all']}>
        <NotesPage />
      </MemoryRouter>
    );
  
    
    await waitFor(() => expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument());
    
    
    const editButton = await screen.findByTestId('edit-note-icon-1');
    fireEvent.click(editButton);
  
    
    expect(mockNavigate).toHaveBeenCalledWith(
      '/editor', 
      expect.objectContaining({
        state: expect.objectContaining({
          note: expect.objectContaining({
            _id: '1',
            title: 'Test Note 1',
            content: 'This is a test note.'
          })
        })
      })
    );
  });
  
  it('should handle delete button click', async () => {
    
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);
    
    render(
      <MemoryRouter initialEntries={['/all']}>
        <NotesPage />
      </MemoryRouter>
    );

    
    await waitFor(() => expect(screen.queryByTestId('loading-message')).not.toBeInTheDocument());
    
    
    const deleteButton = await screen.findByTestId('delete-note-icon-1');
    fireEvent.click(deleteButton);

    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this note?');

    
    await waitFor(() => expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/notes/delete/1'),
      expect.anything()
    ));
    
    
    await waitFor(() => expect(screen.queryByTestId('note-1')).not.toBeInTheDocument());
    
    
    window.confirm = originalConfirm;
  });

  it('should handle no notes case', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(
      <MemoryRouter initialEntries={['/all']}>
        <NotesPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByTestId('no-notes-message')).toBeInTheDocument());
  });
});