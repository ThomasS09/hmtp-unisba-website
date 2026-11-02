import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// getNews di-mock supaya test tidak menyentuh jaringan.
const artikel = {
  id: 7,
  title: 'Kunjungan Industri Tambang 2026',
  category: 'Kegiatan',
  date: '15 Juli 2026',
  excerpt: 'Ringkasan singkat kegiatan kunjungan industri.',
  content: 'Paragraf pertama isi berita lengkap.\n\nParagraf kedua isi berita lengkap.',
  author: 'Humas HMTP',
  read_time: '5 menit',
  gradient: 'from-amber-600/30 to-yellow-500/25',
};

vi.mock('../../services/api', async () => {
  const asli = await vi.importActual<typeof import('../../services/api')>('../../services/api');
  return { ...asli, getNews: vi.fn(async () => [artikel]) };
});

import News from '../News';

describe('News — baca berita utuh', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('menampilkan kartu dari data API, bukan artikel karangan', async () => {
    render(<News />);

    expect(await screen.findByText(artikel.title)).toBeInTheDocument();
    // Data palsu lama ("Delegasi HMTP UNISBA Sabet Juara Umum") tidak boleh muncul lagi
    expect(screen.queryByText(/Sabet Juara Umum/)).not.toBeInTheDocument();
  });

  it('membuka detail berisi isi lengkap saat Baca Selengkapnya diklik', async () => {
    render(<News />);

    fireEvent.click(await screen.findByRole('button', { name: /Baca Selengkapnya/ }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveTextContent('Paragraf pertama isi berita lengkap.');
    expect(dialog).toHaveTextContent('Paragraf kedua isi berita lengkap.');
    expect(screen.getByRole('button', { name: 'Tutup detail berita' })).toHaveFocus();
  });

  it('Escape menutup detail dan fokus kembali ke tombol asal', async () => {
    render(<News />);

    const tombol = await screen.findByRole('button', { name: /Baca Selengkapnya/ });
    fireEvent.click(tombol);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(tombol).toHaveFocus();
  });

  it('menyaring kartu berdasarkan kata kunci pencarian', async () => {
    render(<News />);

    await screen.findByText(artikel.title);
    fireEvent.change(screen.getByLabelText('Cari artikel'), { target: { value: 'tidak-ada-yang-cocok' } });

    expect(screen.queryByText(artikel.title)).not.toBeInTheDocument();
    expect(screen.getByText(/Tidak ada artikel yang cocok/)).toBeInTheDocument();
  });
});
