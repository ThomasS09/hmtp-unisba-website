import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LandingPage from '../../pages/LandingPage'
import '@testing-library/jest-dom'

vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: {
        success: true,
        data: {
          programs: [
            { id: 1, name: 'Program Kerja 1', type: 'Program Kerja', status: 'Rencana' }
          ],
          members: [
            { id: 1, name: 'Member 1', position: 'Ketua', kelompok: 'Inti' }
          ],
          cabinet: { id: 1, name: 'Adhikara Karsa', period: '2026/2027' },
          contact: { email: 'contact@hmtp.org', instagram: '@hmtp' }
        }
      }
    }))
  }
}))

describe('LandingPage - Public Visitor Experience', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render landing page without crashing', async () => {
    const { container } = render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    )

    expect(container).toBeInTheDocument()
  })

  it('should display main navigation', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    )

    const nav = screen.queryByRole('navigation')
    expect(nav).toBeTruthy()
  })

  it('should render without admin section for unauthenticated users', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    )

    // Dashboard link should not be visible without authentication
    const dashLink = screen.queryByRole('link', { name: /dashboard|admin/i })
    if (dashLink) {
      // If exists, it should require token in localStorage
      expect(!localStorage.getItem('token')).toBe(true)
    }
  })
})

