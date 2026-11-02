import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * Halaman kebijakan privasi singkat.
 * Dibuat karena website menerima aspirasi (nama/NIM opsional), sehingga
 * pengunjung berhak tahu data apa yang disimpan dan siapa yang bisa melihatnya.
 */
export default function KebijakanPrivasi() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <h1 className="font-poppins font-black text-3xl sm:text-4xl mb-2">Kebijakan Privasi</h1>
        <p className="font-inter text-xs text-gray-500 mb-10">
          Berlaku untuk website resmi HMTP UNISBA.
        </p>

        <div className="space-y-8 font-inter text-sm text-gray-300 leading-relaxed">
          <section>
            <h2 className="font-poppins font-bold text-lg text-white mb-2">Data yang kami terima</h2>
            <p>
              Saat Anda mengirim aspirasi melalui formulir di website, kami menyimpan isi pesan, kategori, dan
              waktu pengiriman. Nama dan NIM hanya disimpan bila Anda mengisinya sendiri; keduanya opsional dan
              tidak diminta pada mode anonim.
            </p>
          </section>

          <section>
            <h2 className="font-poppins font-bold text-lg text-white mb-2">Siapa yang bisa melihat</h2>
            <p>
              Aspirasi hanya dapat dibaca oleh pengurus HMTP UNISBA yang memiliki akses ke dashboard admin.
              Data tidak dijual, tidak dibagikan, dan tidak dipublikasikan ke halaman publik website.
            </p>
          </section>

          <section>
            <h2 className="font-poppins font-bold text-lg text-white mb-2">Mode anonim</h2>
            <p>
              Jika Anda memilih "Kirim sebagai anonim", nama dan NIM tidak dikirim ke server sama sekali.
              Aspirasi tetap tercatat dengan penanda anonim agar pengurus tidak mengetahui identitas pengirim.
            </p>
          </section>

          <section>
            <h2 className="font-poppins font-bold text-lg text-white mb-2">Penyimpanan dan penghapusan</h2>
            <p>
              Aspirasi disimpan selama diperlukan untuk ditindaklanjuti pengurus. Anda dapat meminta
              penghapusan data dengan menghubungi kontak resmi di bawah.
            </p>
          </section>

          <section>
            <h2 className="font-poppins font-bold text-lg text-white mb-2">Kontak</h2>
            <p>
              Pertanyaan soal data pribadi:{' '}
              <a className="text-primary hover:underline" href="mailto:hmtp.adhikarakarsa@gmail.com">
                hmtp.adhikarakarsa@gmail.com
              </a>
            </p>
          </section>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-12 text-xs font-bold text-primary uppercase tracking-wider hover:underline"
        >
          ← Kembali ke beranda
        </Link>
      </main>
      <Footer />
    </div>
  )
}
