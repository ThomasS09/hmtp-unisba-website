import { useState } from 'react'

export default function InformationBoard() {
  const [selectedTag, setSelectedTag] = useState('Semua')
  const [search, setSearch] = useState('')

  const tags = ['Semua', 'Akademik', 'Beasiswa', 'Organisasi', 'Lainnya']

  const announcements = [
    {
      id: 1,
      title: 'Jadwal Pengisian KRS Semester Ganjil 2026/2027',
      category: 'Akademik',
      date: '05 Agustus 2026',
      desc: 'Diberitahukan kepada seluruh mahasiswa Teknik Pertambangan UNISBA bahwa pengisian KRS online akan dilaksanakan mulai tanggal 15 - 25 Agustus 2026. Harap melunasi BPP sebelum masa pengisian dimulai.',
      isImportant: true,
      fileAttached: 'Panduan_KRS_2026.pdf'
    },
    {
      id: 2,
      title: 'Pendaftaran Beasiswa Bakti Tambang PT Freeport Indonesia',
      category: 'Beasiswa',
      date: '29 Juli 2026',
      desc: 'Kesempatan emas! Beasiswa dibuka untuk mahasiswa semester 5 & 7 dengan IPK minimal 3.25. Cakupan beasiswa meliputi biaya kuliah (BPP), tunjangan bulanan, dan bantuan biaya skripsi/penelitian.',
      isImportant: false,
      fileAttached: 'Persyaratan_Beasiswa_Freeport.pdf'
    },
    {
      id: 3,
      title: 'Open Recruitment Magang Internal Kepengurusan HMTP',
      category: 'Organisasi',
      date: '25 Juli 2026',
      desc: 'Bagi mahasiswa angkatan 2025 yang ingin berkontribusi aktif dan belajar mengelola organisasi, pendaftaran program magang internal HMTP resmi dibuka. Pilih bidang minat Anda sekarang.',
      isImportant: true,
      fileAttached: 'Guidebook_Magang_HMTP.pdf'
    },
    {
      id: 4,
      title: 'Pengukuran Jas Laboratorium & Jaket Kuning Angkatan Baru',
      category: 'Lainnya',
      date: '18 Juli 2026',
      desc: 'Jadwal pengukuran jas laboratorium dan jaket kuning kebesaran HMTP bagi mahasiswa baru akan dikoordinasikan oleh Departemen Kewirausahaan bertempat di Gedung SC Lantai 2.',
      isImportant: false,
      fileAttached: 'Ukuran_Jas_HMTP.xlsx'
    }
  ]

  const filteredNotices = announcements.filter((notice) => {
    const matchesTag = selectedTag === 'Semua' || notice.category === selectedTag
    const matchesSearch = notice.title.toLowerCase().includes(search.toLowerCase()) ||
                          notice.desc.toLowerCase().includes(search.toLowerCase())
    return matchesTag && matchesSearch
  })

  return (
    <section id="papan-informasi" className="py-24 bg-light-gray text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Pusat Pengumuman</span>
            </div>
            <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
              Papan Informasi <span className="text-primary text-glow">Kemahasiswaan</span>
            </h2>
            <p className="font-inter text-sm text-gray-400 mt-4 leading-relaxed">
              Dapatkan dokumen akademik penting, pengumuman beasiswa, pengadaan merchandise, dan info krusial himpunan secara terpusat dan interaktif.
            </p>
          </div>

          {/* Search bar inside header */}
          <div className="w-full lg:w-80 relative">
            <input 
              type="text" 
              placeholder="Cari pengumuman..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3.5 bg-white/5 border border-white/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl font-inter text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/5 pb-6">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-5 py-2.5 rounded-xl font-inter text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-primary text-black border-primary shadow-lg shadow-primary/10'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Notices Board Layout */}
        {filteredNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotices.map((notice) => (
              <div 
                key={notice.id}
                className={`glass-panel p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-[0_0_35px_rgba(255,212,0,0.03)] ${
                  notice.isImportant 
                    ? 'border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent hover:border-red-500/30' 
                    : 'border-white/10 hover:border-primary/20'
                }`}
              >
                
                {/* Header elements inside note card */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-inter text-xs text-gray-500">{notice.date}</span>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-inter text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 uppercase">
                        {notice.category}
                      </span>
                      
                      {notice.isImportant && (
                        <span className="font-poppins text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse uppercase">
                          PENTING
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-poppins font-bold text-lg text-white mb-3 tracking-tight">
                    {notice.title}
                  </h3>
                  
                  <p className="font-inter text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                    {notice.desc}
                  </p>
                </div>

                {/* Footer action elements inside note card */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-inter font-semibold">
                    <span className="text-sm">📎</span>
                    <span className="truncate max-w-[200px]">{notice.fileAttached}</span>
                  </div>
                  
                  <button 
                    onClick={() => alert(`Mengunduh berkas: ${notice.fileAttached}`)}
                    className="px-4 py-2 bg-white/5 border border-white/10 hover:border-primary hover:bg-primary hover:text-black font-inter text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    Unduh Dokumen
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <span className="text-4xl block mb-4">📢</span>
            <p className="font-inter text-gray-400 text-sm">Tidak ada pengumuman untuk kategori atau kata kunci tersebut.</p>
          </div>
        )}

      </div>
    </section>
  )
}
