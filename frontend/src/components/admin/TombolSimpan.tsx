interface Props {
  submitting: boolean
  /** Nonaktifkan tombol karena alasan lain (mis. field wajib masih kosong). */
  disabled?: boolean
}

/**
 * Tombol simpan standar semua tab admin: label, ikon, dan status
 * "Menyimpan..." harus seragam supaya pengguna tidak bingung
 * membedakan tombol yang satu dengan yang lain.
 */
export default function TombolSimpan({ submitting, disabled = false }: Props) {
  return (
    <button
      type="submit"
      disabled={submitting || disabled}
      className="px-6 py-2.5 text-xs font-bold rounded-xl bg-primary hover:bg-dark-gold text-black transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
    >
      {submitting ? (
        <>
          <span className="inline-block animate-spin">⏳</span> Menyimpan...
        </>
      ) : (
        <>💾 Simpan</>
      )}
    </button>
  )
}
