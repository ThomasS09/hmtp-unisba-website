import { useState } from 'react'
import { useSiteData } from '../hooks/useSiteData'
import type { Member } from '../types'

// Ikon & deskripsi tampilan per bidang (kunci = slug tanpa awalan "bidang-").
const BIDANG_META: Record<string, { icon: string; tugas: string }> = {
  kesekretariatan: {
    icon: '📁',
    tugas: 'Mendukung pengelolaan administrasi, kebersihan, kerapian sekretariat, serta inventarisasi barang milik himpunan.',
  },
  medkominfo: {
    icon: '📢',
    tugas: 'Pusat pengelolaan informasi, publikasi, dokumentasi, dan media komunikasi HMTP UNISBA yang adaptif dan terintegrasi.',
  },
  kaderisasi: {
    icon: '🤝',
    tugas: 'Merancang dan mengembangkan sistem kaderisasi berorientasi pembinaan karakter, peningkatan kompetensi, serta regenerasi SDM.',
  },
  intrakampus: {
    icon: '🏫',
    tugas: 'Jembatan strategis komunikasi dan kolaborasi antara HMTP dengan organisasi kemahasiswaan di tingkat universitas.',
  },
  ekstrakampus: {
    icon: '🌍',
    tugas: 'Wadah mahasiswa dalam mengembangkan wawasan industri, relasi, dan kolaborasi eksternal dengan perusahaan, alumni, dan institusi.',
  },
  kewirausahaan: {
    icon: '💰',
    tugas: 'Motor penggerak pendapatan himpunan melalui unit usaha mandiri demi tercapainya kemandirian finansial organisasi.',
  },
  'sosial-dan-keagamaan': {
    icon: '🕌',
    tugas: 'Wadah bersosialisasi dan meningkatkan nilai-nilai keislaman demi memperkuat pribadi Mujahid, Mujtahid, dan Mujaddid (3M).',
  },
  'seni-dan-olahraga': {
    icon: '⚽',
    tugas: 'Wadah pembinaan minat bakat olahraga dan seni anggota untuk merajut kebersamaan serta menyalurkan potensi prestasi.',
  },
  'keilmuan-dan-keprofesian': {
    icon: '⛏️',
    tugas: 'Wadah strategis dalam meningkatkan kapasitas keilmuan akademik serta keahlian teknis pertambangan.',
  },
}

const BUKAN_BIDANG = ['sekretaris-umum', 'bendahara-umum']

const meta = (slug: string) => BIDANG_META[slug.replace(/^bidang-/, '')] ?? { icon: '📌', tugas: '' }

function PengurusCard({ member }: { member: Member }) {
  return (
    <div className="glass-panel p-6 rounded-2xl hover:border-primary/30 hover:shadow-[0_0_30px_rgba(255,212,0,0.05)] transition-all duration-300 text-center">
      {member.photo_url ? (
        <img
          src={member.photo_url}
          alt={member.name}
          loading="lazy"
          className="w-24 h-24 rounded-full object-cover object-top mx-auto mb-4 border-2 border-primary/40"
        />
      ) : (
        <div className="w-24 h-24 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center mx-auto mb-4 font-poppins text-xl">
          {member.name.charAt(0)}
        </div>
      )}
      <h4 className="font-poppins font-bold text-lg text-white mb-1">{member.name}</h4>
      <p className="font-inter text-xs text-primary font-semibold uppercase tracking-wider mb-2">
        {member.position}
      </p>
      {member.department && (
        <p className="font-inter text-xs text-gray-400 leading-relaxed">{member.department}</p>
      )}
    </div>
  )
}

export default function Structure() {
  const [activeBidang, setActiveBidang] = useState<string | null>(null)
  const { data } = useSiteData()

  const members = data?.members ?? []
  const pengurusInti = members.filter((m) => m.kelompok === 'Pengurus Inti')
  const ketuaBidang = members.filter((m) => m.kelompok === 'Ketua Bidang')
  const departments = (data?.departments ?? []).filter((d) => !BUKAN_BIDANG.includes(d.slug))
  const programs = data?.programs ?? []

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
            {data?.cabinet ? `Kabinet ${data.cabinet.name}` : 'Struktur Kepengurusan'}
          </h2>
          <p className="font-inter text-sm text-gray-400 mt-4">
            Daftar pengurus inti dan pembagian bidang kerja yang menggerakkan organisasi HMTP UNISBA periode
            {` ${data?.cabinet?.period ?? ''}`}.
          </p>
        </div>

        {/* Pengurus Inti Section */}
        <div className="mb-20">
          <h3 className="font-poppins font-bold text-2xl text-white text-center mb-10">Pengurus Harian</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {pengurusInti.map((member) => (
              <PengurusCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Ketua Bidang Section */}
        {ketuaBidang.length > 0 && (
          <div className="mb-20">
            <h3 className="font-poppins font-bold text-2xl text-white text-center mb-10">Ketua Bidang</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {ketuaBidang.map((member) => (
                <PengurusCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* Bidang/Divisi Grid Section */}
        <div>
          <h3 className="font-poppins font-bold text-2xl text-white text-center mb-4">Bidang & Divisi Kerja</h3>
          <p className="font-inter text-sm text-gray-400 text-center mb-10">
            Klik pada kartu bidang untuk melihat program kerja dan detail fungsinya.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((bidang) => {
              const info = meta(bidang.slug)
              const items = programs.filter((p) => p.department_slug === bidang.slug)

              return (
                <div
                  key={bidang.id}
                  onClick={() => setActiveBidang(activeBidang === bidang.slug ? null : bidang.slug)}
                  className={`glass-panel rounded-2xl p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 ${
                    activeBidang === bidang.slug
                      ? 'border-primary/40 ring-1 ring-primary/20 shadow-[0_0_25px_rgba(255,212,0,0.05)] bg-white/[0.03]'
                      : 'hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{info.icon}</span>
                    <h4 className="font-poppins font-bold text-lg text-white leading-tight">{bidang.name}</h4>
                  </div>

                  <p className="font-inter text-xs text-gray-400 leading-relaxed mb-4">
                    {info.tugas}
                  </p>

                  {/* Collapsible Area */}
                  <div className={`transition-all duration-300 overflow-hidden ${
                    activeBidang === bidang.slug ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="border-t border-white/10 pt-4">
                      <span className="font-poppins font-bold text-xs text-primary uppercase tracking-wider block mb-2">Program & Aktivitas:</span>
                      <ul className="space-y-1.5">
                        {items.map((prog) => (
                          <li key={prog.id} className="flex items-center gap-2 font-inter text-xs text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                            {prog.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Toggle Hint */}
                  <div className="flex justify-end mt-2">
                    <span className="text-[10px] font-semibold text-primary font-inter uppercase tracking-wider">
                      {activeBidang === bidang.slug ? 'Tutup Detail' : 'Lihat Detail'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
