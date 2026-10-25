// Mock modules
const mockNavigate = vi.fn();
const mockLocation = vi.fn();

export const mockRouter = {
  navigate: mockNavigate,
  location: mockLocation,
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});
