// Static data defined outside component — avoids re-declaration on every render
const missions = [
  "Menguatkan kualitas sumber daya mahasiswa melalui pengembangan kompetensi, dan karakter.",
  "Memperkuat sinergi dan kolaborasi antara mahasiswa, alumni, program studi, serta mitra strategis dalam mendukung kemajuan himpunan.",
  "Mengoptimalkan peran HMTP sebagai wadah pengembangan minat, bakat, dan kepedulian sosial mahasiswa.",
  "Membangun budaya organisasi yang inovatif, dan berkelanjutan guna mendukung kemajuan HMTP.",
]

export default function VisionMission() {
  return (
    <section id="vision-mission" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Visi & Misi</span>
          </div>
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
            Arah Juang Himpunan
          </h2>
        </div>

        {/* Grid Layout for Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Left Block: Vision */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between relative group hover:border-primary/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>

            <div className="space-y-6">
              <span className="font-poppins font-black text-lg text-primary tracking-widest uppercase">VISI</span>
              <h3 className="font-poppins font-bold text-2xl md:text-3xl text-white leading-relaxed">
                "Menjadikan Himpunan Mahasiswa Teknik Pertambangan UNISBA sebagai wadah pengembangan mahasiswa yang berintegritas dan adaptif untuk mewujudkan himpunan yang progresif serta berkelanjutan."
              </h3>
            </div>

            <div className="border-t border-white/10 pt-6 mt-8 flex items-center gap-4">
              <span className="text-xs font-inter text-gray-500">HMTP UNISBA 2026/2027</span>
            </div>
          </div>

          {/* Right Block: Mission */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
            <span className="font-poppins font-black text-lg text-primary tracking-widest uppercase mb-2 block">MISI</span>

            <div className="space-y-4">
              {missions.map((mission, index) => (
                <div
                  key={index}
                  className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all duration-300 group"
                >
                  {/* Number bubble */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-black font-poppins font-bold text-base flex items-center justify-center transition-all duration-300">
                    {index + 1}
                  </div>
                  {/* Mission text */}
                  <p className="font-inter text-base text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 pt-1">
                    {mission}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
