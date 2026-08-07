import { useState } from 'react'

export default function Structure() {
  const [activeBidang, setActiveBidang] = useState(null)

  const pengurusInti = [
    { role: 'Ketua Umum', desc: 'Pimpinan tertinggi organisasi yang bertanggung jawab penuh atas jalannya himpunan.' },
    { role: 'Wakil Ketua Umum', desc: 'Membantu Ketua Umum dalam memimpin, mengawasi, dan mengkoordinasikan bidang-bidang.' },
    { role: 'Sekretaris Umum', desc: 'Mengkoordinasikan dan memastikan tertib administrasi serta tata kelola organisasi.' },
    { role: 'Bendahara Umum', desc: 'Mengelola keuangan himpunan meliputi perencanaan, pengawasan, dan pelaporan anggaran.' }
  ]

  const bidangData = [
    {
      id: 'kesekretariatan',
      title: 'Kesekretariatan',
      icon: '📁',
      tugas: 'Mendukung pengelolaan administrasi, kebersihan, kerapian sekretariat, serta inventarisasi barang milik himpunan.',
      programs: ['Pengelolaan Inventaris Himpunan', 'Penyusunan Arsip Kesekretariatan']
    },
    {
      id: 'media-informasi',
      title: 'Media Komunikasi & Informasi',
      icon: '📢',
      tugas: 'Pusat pengelolaan informasi, publikasi, dokumentasi, dan media komunikasi HMTP UNISBA yang adaptif dan terintegrasi.',
      programs: ['Booklet HMTP', 'Jakun Story Competition', 'HMTP One Data', 'Publikasi & Dokumentasi Kegiatan']
    },
    {
      id: 'kaderisasi',
      title: 'Kaderisasi',
      icon: '🤝',
      tugas: 'Merancang dan mengembangkan sistem kaderisasi berorientasi pembinaan karakter, peningkatan kompetensi, serta regenerasi SDM.',
      programs: ['PPMB (Program Pembinaan Mahasiswa Baru)', 'Blueprint PPMB', 'Jakun Day', 'Magang Himpunan', 'Mine Map']
    },
    {
      id: 'intrakampus',
      title: 'Intrakampus',
      icon: '🏫',
      tugas: 'Jembatan strategis komunikasi dan kolaborasi antara HMTP dengan organisasi kemahasiswaan di tingkat universitas.',
      programs: ['HMTP Anniversary', 'Mine Graduate', 'PIT (Performance & Integrity Tracking)', 'SEAM']
    },
    {
      id: 'ekstrakampus',
      title: 'Ekstrakampus',
      icon: '🌍',
      tugas: 'Wadah mahasiswa dalam mengembangkan wawasan industri, relasi, dan kolaborasi eksternal dengan perusahaan, alumni, dan institusi.',
      programs: ['Hubungan Industri & Alumni', 'Kunjungan Industri Tambang', 'Kerjasama Stakeholder Eksternal']
    },
    {
      id: 'kewirausahaan',
      title: 'Kewirausahaan',
      icon: '💰',
      tugas: 'Motor penggerak pendapatan himpunan melalui unit usaha mandiri demi tercapainya kemandirian finansial organisasi.',
      programs: ['Penyediaan Jaket Kuning & Jas Lab', 'MINE (Merchandise Inovatif)', 'BINA (Bisnis & Niaga Adaptif)']
    },
    {
      id: 'sosial-keagamaan',
      title: 'Sosial & Keagamaan',
      icon: '🕌',
      tugas: 'Wadah bersosialisasi dan meningkatkan nilai-nilai keislaman demi memperkuat pribadi Mujahid, Mujtahid, dan Mujaddid (3M).',
      programs: ['GRANIT (Gema Ramadhan)', 'HMTP Peduli', 'Sedekah Jum\'at', 'HMTP Berbagi']
    },
    {
      id: 'seni-olahraga',
      title: 'Seni & Olahraga',
      icon: '⚽',
      tugas: 'Wadah pembinaan minat bakat olahraga dan seni anggota untuk merajut kebersamaan serta menyalurkan potensi prestasi.',
      programs: ['PORSETA (Pekan Olahraga Seni Tambang)', 'MFC (Mining Futsal Championship)', 'Sebat (Sehat Bareng Anak Tambang)', 'CINERGY']
    },
    {
      id: 'ilmu-keprofesian',
      title: 'Keilmuan & Keprofesian',
      icon: '⛏️',
      tugas: 'Wadah strategis dalam meningkatkan kapasitas keilmuan akademik serta keahlian teknis pertambangan.',
      programs: ['SEMPRO (Seminar Keprofesian)', 'U MINE FEST', 'MCU (Mining Class Upgrading)', 'FORTA (Forum Riset Tambang)', 'MASTA (Mining Software Training)']
    }
  ]

  return (
    <section id="structure" className="py-24 bg-light-gray relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-dark-gold/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Struktur Kepengurusan</span>
          </div>
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
            Kabinet Adhikara Karsa
          </h2>
          <p className="font-inter text-sm text-gray-400 mt-4">
            Daftar pengurus inti dan pembagian bidang kerja yang menggerakkan organisasi HMTP UNISBA periode ini.
          </p>
        </div>

        {/* Pengurus Inti Section */}
        <div className="mb-20">
          <h3 className="font-poppins font-bold text-2xl text-white text-center mb-10">Pengurus Harian</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pengurusInti.map((inti, index) => (
              <div 
                key={index} 
                className="glass-panel p-6 rounded-2xl hover:border-primary/30 hover:shadow-[0_0_30px_rgba(255,212,0,0.05)] transition-all duration-300 text-center"
              >
                <div className="w-12 h-12 bg-primary text-black font-bold rounded-full flex items-center justify-center mx-auto mb-4 font-poppins">
                  PH
                </div>
                <h4 className="font-poppins font-bold text-lg text-white mb-2">{inti.role}</h4>
                <p className="font-inter text-xs text-gray-400 leading-relaxed">{inti.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bidang/Divisi Grid Section */}
        <div>
          <h3 className="font-poppins font-bold text-2xl text-white text-center mb-4">Bidang & Divisi Kerja</h3>
          <p className="font-inter text-sm text-gray-400 text-center mb-10">
            Klik pada kartu bidang untuk melihat program kerja dan detail fungsinya.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bidangData.map((bidang) => (
              <div 
                key={bidang.id}
                onClick={() => setActiveBidang(activeBidang === bidang.id ? null : bidang.id)}
                className={`glass-panel rounded-2xl p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ${
                  activeBidang === bidang.id 
                    ? 'border-primary/40 ring-1 ring-primary/20 shadow-[0_0_25px_rgba(255,212,0,0.05)] bg-white/[0.03]' 
                    : 'hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{bidang.icon}</span>
                  <h4 className="font-poppins font-bold text-lg text-white leading-tight">{bidang.title}</h4>
                </div>

                <p className="font-inter text-xs text-gray-400 leading-relaxed mb-4">
                  {bidang.tugas}
                </p>

                {/* Collapsible Area */}
                <div className={`transition-all duration-300 overflow-hidden ${
                  activeBidang === bidang.id ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}>
                  <div className="border-t border-white/10 pt-4">
                    <span className="font-poppins font-bold text-xs text-primary uppercase tracking-wider block mb-2">Program & Aktivitas:</span>
                    <ul className="space-y-1.5">
                      {bidang.programs.map((prog, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-2 font-inter text-xs text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                          {prog}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Toggle Hint */}
                <div className="flex justify-end mt-2">
                  <span className="text-[10px] font-semibold text-primary font-inter uppercase tracking-wider">
                    {activeBidang === bidang.id ? 'Tutup Detail' : 'Lihat Detail'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
