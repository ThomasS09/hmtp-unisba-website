import { useState } from 'react'

export default function AspirationContact() {
  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    category: 'Saran',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulated form submission
    console.log('Submitted Aspiration:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', nim: '', category: 'Saran', message: '' })
    }, 4000)
  }

  const socialChannels = [
    {
      name: 'Instagram',
      handle: '@hmtpunisba',
      url: 'https://instagram.com/hmtpunisba',
      icon: '📸',
      color: 'hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:text-pink-400'
    },
    {
      name: 'TikTok',
      handle: '@hmtp.unisba',
      url: 'https://tiktok.com/@hmtp.unisba',
      icon: '🎵',
      color: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:text-cyan-400'
    },
    {
      name: 'Gmail',
      handle: 'Hmtp.adhikarakarsa@gmail.com',
      url: 'mailto:Hmtp.adhikarakarsa@gmail.com',
      icon: '✉️',
      color: 'hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:text-red-400'
    },
    {
      name: 'WhatsApp Humas',
      handle: '+62 812-1414-1983',
      url: 'https://wa.me/6281214141983',
      icon: '📞',
      color: 'hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:text-emerald-400'
    }
  ]

  return (
    <section id="aspirasi" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Layanan & Kontak</span>
          </div>
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
            Suara Aspirasi <span className="text-primary text-glow">Mahasiswa</span>
          </h2>
          <p className="font-inter text-sm text-gray-400 mt-4 leading-relaxed">
            Sampaikan kritik, saran, masukan, dan aspirasi Anda demi peningkatan kualitas kinerja organisasi, fasilitas mahasiswa, serta kegiatan akademik.
          </p>
        </div>

        {/* Form and Social Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Aspiration Form (7 cols) */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="font-poppins font-bold text-xl text-white mb-2">Formulir Kotak Aspirasi</h3>
              <p className="font-inter text-xs text-gray-500 mb-8">Setiap aspirasi akan diproses secara rahasia dan profesional oleh humas kabinet.</p>

              {submitted ? (
                <div className="bg-primary/10 border border-primary/20 text-primary p-6 rounded-2xl text-center font-inter text-sm mb-6 animate-fade-in">
                  <span className="text-2xl block mb-2">🎉</span>
                  <span className="font-semibold block mb-1">Aspirasi Berhasil Terkirim!</span>
                  Terima kasih atas kontribusi aktif Anda dalam membangun HMTP yang lebih baik.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-inter text-xs text-gray-400 font-semibold uppercase tracking-wider pl-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nama Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/25 rounded-xl font-inter text-xs sm:text-sm text-white outline-none transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-inter text-xs text-gray-400 font-semibold uppercase tracking-wider pl-1">NIM Mahasiswa</label>
                      <input 
                        type="text" 
                        required
                        placeholder="100703..."
                        value={formData.nim}
                        onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/25 rounded-xl font-inter text-xs sm:text-sm text-white outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-inter text-xs text-gray-400 font-semibold uppercase tracking-wider pl-1">Kategori Aspirasi</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/25 rounded-xl font-inter text-xs sm:text-sm text-gray-300 outline-none transition-all duration-300 [&>option]:bg-black [&>option]:text-white cursor-pointer"
                    >
                      <option value="Saran">Saran Pembangunan</option>
                      <option value="Kritik">Kritik Kinerja</option>
                      <option value="Akademik">Aspirasi Kurikulum & Dosen</option>
                      <option value="Kegiatan">Usulan Program / Event</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-inter text-xs text-gray-400 font-semibold uppercase tracking-wider pl-1">Isi Aspirasi & Kritik</label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Tuliskan aspirasi Anda di sini secara rinci..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/25 rounded-xl font-inter text-xs sm:text-sm text-white outline-none transition-all duration-300 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-dark-gold text-black font-poppins font-bold rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/25 transition-all duration-300 text-center text-sm cursor-pointer"
                  >
                    Kirim Aspirasi
                  </button>
                </form>
              )}
            </div>

            {/* Google Form Section */}
            <div className="mt-10 pt-8 border-t border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <div>
                <h4 className="font-poppins font-bold text-sm text-primary">Google Form Resmi</h4>
                <p className="font-inter text-xs text-gray-400 mt-1 max-w-sm">Anda juga dapat mengirimkan aspirasi melalui form Google Docs terstruktur kami.</p>
              </div>
              <a 
                href="https://docs.google.com/forms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 text-white hover:text-primary font-inter text-xs font-bold rounded-lg transition-all duration-300 text-center whitespace-nowrap cursor-pointer"
              >
                Isi Google Form ↗
              </a>
            </div>
          </div>

          {/* Right Column: Social Channels (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 h-full flex flex-col justify-center">
              <h3 className="font-poppins font-bold text-xl text-white mb-2">Saluran Komunikasi Resmi</h3>
              <p className="font-inter text-xs text-gray-500 mb-8 leading-relaxed">Berikut adalah akun media sosial resmi dan saluran informasi cepat untuk berkoordinasi secara responsif dengan Humas HMTP UNISBA.</p>

              <div className="flex flex-col gap-4">
                {socialChannels.map((chan, idx) => (
                  <a
                    key={idx}
                    href={chan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-300 group ${chan.color}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl filter drop-shadow group-hover:scale-110 transition-transform">{chan.icon}</span>
                      <div>
                        <h4 className="font-poppins font-bold text-sm text-white group-hover:text-inherit">{chan.name}</h4>
                        <span className="font-inter text-xs text-gray-500 group-hover:text-inherit/80">{chan.handle}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold tracking-wider transition-transform duration-300 translate-x-0 group-hover:translate-x-1.5">
                      Hubungi ➔
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
