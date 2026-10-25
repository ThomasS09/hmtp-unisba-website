import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../Navbar';

describe('Navbar — akses keyboard', () => {
  it('tombol menu mobile melaporkan status buka/tutup', () => {
    const { container } = render(<Navbar />);

    const tombol = screen.getByRole('button', { name: 'Buka menu' });
    expect(tombol).toHaveAttribute('aria-expanded', 'false');
    expect(tombol).toHaveAttribute('aria-controls', 'menu-mobile');

    const panel = container.querySelector('#menu-mobile') as HTMLElement;
    expect(panel).toHaveAttribute('inert');

    fireEvent.click(tombol);

    expect(screen.getByRole('button', { name: 'Tutup menu' })).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('inert');
    expect(panel).toHaveAttribute('aria-hidden', 'false');
    expect(within(panel).getByRole('link', { name: 'Sejarah' })).toBeInTheDocument();
  });

  it('link di panel tertutup tidak bisa di-tab', () => {
    const { container } = render(<Navbar />);

    const panel = container.querySelector('#menu-mobile') as HTMLElement;
    expect(panel).toHaveAttribute('inert');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
  });

  it('Escape menutup menu mobile', () => {
    render(<Navbar />);

    fireEvent.click(screen.getByRole('button', { name: 'Buka menu' }));
    expect(screen.getByRole('button', { name: 'Tutup menu' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.getByRole('button', { name: 'Buka menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('dropdown desktop terbuka saat fokus keyboard masuk dan tertutup saat fokus keluar', () => {
    render(<Navbar />);

    const tombolProfil = screen.getByRole('button', { name: /Profil HMTP/ });
    expect(tombolProfil).toHaveAttribute('aria-expanded', 'false');
    expect(tombolProfil).toHaveAttribute('aria-haspopup', 'true');

    // Fokus pindah ke tombol dropdown → grup menerima focusin
    fireEvent.focus(tombolProfil);
    expect(tombolProfil).toHaveAttribute('aria-expanded', 'true');

    // Fokus keluar grup (ke link "Beranda" di luar) → dropdown menutup
    const grup = tombolProfil.parentElement as HTMLElement;
    fireEvent.focusOut(grup, { relatedTarget: screen.getAllByRole('link', { name: 'Beranda' })[0] });

    expect(tombolProfil).toHaveAttribute('aria-expanded', 'false');
  });

  it('klik tombol dropdown membuka dan menutup pilihan', () => {
    render(<Navbar />);

    const tombolAktivitas = screen.getByRole('button', { name: /Aktivitas/ });

    fireEvent.click(tombolAktivitas);
    expect(tombolAktivitas).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(tombolAktivitas);
    expect(tombolAktivitas).toHaveAttribute('aria-expanded', 'false');
  });
});
