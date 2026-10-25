import { describe, it, expect } from 'vitest';
import { pesanError } from '../api';

// Helper ini menentukan apa yang dibaca pengurus saat simpan gagal;
// salah di sini = pesan "Gagal menyimpan" tanpa alasan.
describe('pesanError', () => {
  it('mengambil pesan validasi pertama dari Laravel 422', () => {
    const err = {
      response: {
        status: 422,
        data: {
          message: 'The given data was invalid.',
          errors: {
            name: ['Nama Lengkap wajib diisi.'],
            position: ['Jabatan wajib diisi.'],
          },
        },
      },
    };
    expect(pesanError(err)).toBe('Nama Lengkap wajib diisi.');
  });

  it('memakai message server saat tidak ada errors (mis. 404/500)', () => {
    const err = { response: { status: 404, data: { message: 'Pengurus tidak ditemukan' } } };
    expect(pesanError(err)).toBe('Pengurus tidak ditemukan');
  });

  it('memberi tahu koneksi bermasalah saat tidak ada respons sama sekali', () => {
    expect(pesanError(new Error('Network Error'))).toBe('Tidak bisa menghubungi server. Periksa koneksi Anda.');
  });

  it('memakai pesan bawaan untuk error yang tidak dikenal', () => {
    expect(pesanError(null, 'Gagal menyimpan pengurus')).toBe('Gagal menyimpan pengurus');
    expect(pesanError(undefined, 'Gagal menghapus program')).toBe('Gagal menghapus program');
  });
});
