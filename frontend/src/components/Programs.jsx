// Static data defined outside component — avoids re-declaration on every render
const majorPrograms = [
  {
    title: 'Mining Talk & Seminar Keprofesian',
    tag: 'Akademik & Profesi',
    desc: 'Forum diskusi dan sharing bersama praktisi, alumni, dan akademisi pertambangan guna membahas perkembangan isu serta tantangan terkini di dunia industri tambang untuk meningkatkan wawasan keprofesian mahasiswa.',
    icon: '💬',
  },
  {
    title: 'MASTA (Mining Software Training Academy)',
    tag: 'Pelatihan & Keahlian',
    desc: 'Program penguatan skill perangkat lunak pertambangan untuk menunjang praktikum dan kompetensi luar kuliah, guna membentuk mahasiswa yang adaptif terhadap teknologi industri tambang terkini.',
    icon: '💻',
  },
  {
    title: 'HMTP Digital & One Data',
    tag: 'Digitalisasi & Organisasi',
    desc: 'Sistem pengelolaan data organisasi HMTP yang terintegrasi. Mencakup database anggota, dokumentasi kegiatan, dan arsip administrasi agar lebih rapi, efisien, dan mudah diakses.',
    icon: '📊',
  },
  {
    title: 'FORTA (Forum Riset Tambang)',
    tag: 'Riset & Kolaborasi',
    desc: 'Wadah kolaborasi kajian isu pertambangan terkini antara mahasiswa, dosen, dan pihak eksternal dengan luaran berupa paper ilmiah atau kajian kritis yang dapat dipublikasikan secara resmi.',
    icon: '🔬',
  },
]

export default function Programs() {
  return (
    <section id="programs" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Program Unggulan</span>
          </div>
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
            Major Program Kabinet
          </h2>
          <p className="font-inter text-base text-gray-400 mt-4">
            Inisiatif strategis yang dicanangkan untuk mendorong inovasi, meningkatkan kualitas akademis, dan efisiensi manajemen data himpunan.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {majorPrograms.map((prog, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 hover:border-primary/30 p-8 rounded-3xl hover:bg-white/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Icon & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl">{prog.icon}</span>
                  <span className="font-inter text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    {prog.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-poppins font-bold text-2xl text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  {prog.title}
                </h3>

                {/* Description */}
                <p className="font-inter text-sm text-gray-400 leading-relaxed mb-6">
                  {prog.desc}
                </p>
              </div>

              {/* Action decoration */}
              <div className="flex items-center gap-2 text-xs font-semibold text-primary/80 group-hover:text-primary tracking-wider uppercase font-inter transition-all duration-300">
                Detail Kegiatan
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
