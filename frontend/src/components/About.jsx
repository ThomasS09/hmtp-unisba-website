export default function About() {
  return (
    <section id="about" className="py-24 bg-light-gray relative overflow-hidden">
      {/* Dynamic background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Heading and main text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="font-inter text-xs text-dark-gold font-bold tracking-wider uppercase">Tentang Kami</span>
            </div>
            
            <h2 className="font-poppins font-black text-4xl md:text-5xl text-black leading-tight">
              Semboyan Kabinet <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-dark-gold filter drop-shadow">ADHIKARA KARSA</span>
            </h2>
            
            <p className="font-inter text-base md:text-lg text-gray-700 leading-relaxed">
              Adhikara Karsa merupakan semboyan yang mencerminkan amanah dan tekad dalam setiap langkah kepengurusan HMTP UNISBA periode 2026/2027. Semboyan ini memandu pengurus dalam menjalankan roda organisasi dengan profesionalitas tinggi.
            </p>
            
            <div className="border-l-4 border-primary pl-4 py-2 italic font-inter text-gray-600">
              "Dengan menjunjung integritas, kolaborasi, dan komitmen bersama, kabinet ini berkomitmen untuk mewujudkan kemajuan himpunan yang berkelanjutan."
            </div>
          </div>

          {/* Right Column: Definition cards (Adhikara & Karsa) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card 1: Adhikara */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-dark-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-poppins font-bold text-xl text-black mb-3">ADHIKARA</h3>
              <p className="font-inter text-sm text-gray-600 leading-relaxed">
                Bermakna <span className="font-semibold text-black">kepercayaan</span> dan <span className="font-semibold text-black">tanggung jawab</span>. Merepresentasikan dedikasi penuh pengurus dalam menjalankan amanah organisasi.
              </p>
            </div>

            {/* Card 2: Karsa */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-dark-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-poppins font-bold text-xl text-black mb-3">KARSA</h3>
              <p className="font-inter text-sm text-gray-600 leading-relaxed">
                Melambangkan <span className="font-semibold text-black">kehendak</span> serta <span className="font-semibold text-black">semangat untuk berkarya</span>. Mewakili daya cipta inovatif mahasiswa tambang UNISBA.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
