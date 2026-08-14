import picture1 from '../assets/Picture1.jpg'
import picture2 from '../assets/Picture2.jpg'

// Static data defined outside component — avoids re-declaration on every render
const timelineData = [
  {
    year: '1983',
    title: 'Pembentukan & Fondasi Awal',
    date: '19 September 1983',
    location: 'Kampus UNISBA, Jl. Tamansari No. 1, Bandung',
    desc: 'Himpunan Mahasiswa Teknik Pertambangan (HMTP) Universitas Islam Bandung resmi didirikan. Lahir dari panggilan jiwa mahasiswa yang membutuhkan wadah pergerakan solid untuk menghimpun, membina, serta mengabdi kepada almamater, bangsa, dan negara.',
    icon: '🏛️',
    image: picture1,
  },
  {
    year: 'Identitas',
    title: 'Perumusan Lambang Himpunan',
    date: 'Jejak Historis Abadi',
    location: 'Fakultas Teknik',
    desc: 'Setiap lekukan dan lambang dirumuskan secara mendalam. Tujuh lekukan kerang pada lambang secara khusus menyimbolkan bahwa HMTP merupakan bagian dari Fakultas Teknik pada tahap pendirian ke-7 di UNISBA. Semangat perjuangan ini terukir abadi.',
    icon: '🛡️',
    image: picture2,
  },
  {
    year: 'Evolusi',
    title: 'Perjalanan & Estafet Perjuangan',
    date: 'Era Kabinet KATARA',
    location: 'Roda Kepemimpinan',
    desc: 'Perjuangan HMTP terus diteruskan dari generasi ke generasi. Berbagai kabinet, menjaga api semangat perjuangan tahun 1983 tetap menyala, beradaptasi dengan tantangan zaman demi kemajuan dunia pertambangan.',
    icon: '⚒️',
  },
  {
    year: '2026+',
    title: 'Kabinet Adhikara Karsa',
    date: 'Periode Kepengurusan Baru',
    location: 'Masa Kini & Masa Depan',
    desc: 'Melanjutkan tongkat estafet perjuangan demi mewujudkan insan pertambangan yang kompeten, religius, dan berkarakter. Menjadikan HMTP sebagai wadah pengembangan mahasiswa yang berintegritas, adaptif, progresif, dan berkelanjutan.',
    icon: '🚀',
  },
]

export default function History() {
  return (
    <section id="sejarah" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="font-inter text-xs text-primary font-bold tracking-wider uppercase">Jejak Langkah</span>
          </div>
          <h2 className="font-poppins font-black text-4xl md:text-5xl text-white">
            Sejarah <span className="text-primary text-glow">HMTP UNISBA</span>
          </h2>
          <p className="font-inter text-sm text-gray-400 mt-4 leading-relaxed">
            Menelusuri sejarah panjang berdirinya Himpunan Mahasiswa Teknik Pertambangan Universitas Islam Bandung sejak tahun 1983.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l border-white/10 max-w-4xl mx-auto pl-6 sm:pl-12 space-y-12">

          {/* Vertical Glowing Line */}
          <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-primary via-primary/30 to-transparent"></div>

          {timelineData.map((item, index) => (
            <div key={index} className="relative group">

              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[31px] sm:-left-[55px] top-1.5 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black border-2 border-primary group-hover:bg-primary transition-all duration-300 relative">
                  <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping group-hover:opacity-100 opacity-0 transition-opacity"></div>
                </div>
              </div>

              {/* Glassmorphic Timeline Card */}
              <div className="glass-panel hover:border-primary/20 hover:shadow-[0_0_30px_rgba(255,212,0,0.05)] rounded-2xl p-6 sm:p-8 transition-all duration-300 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-3xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="font-poppins font-bold text-lg sm:text-xl text-white group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <span className="font-inter text-xs text-primary/80 font-medium">
                        {item.date} • {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="self-start sm:self-center font-poppins font-black text-sm tracking-wider px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full">
                    {item.year}
                  </span>
                </div>

                <p className="font-inter text-sm text-gray-400 leading-relaxed mb-4">
                  {item.desc}
                </p>

                {item.image && (
                  <div className="mt-6 relative max-w-lg rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/20 transition-all duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-cover max-h-[300px] hover:scale-[1.03] transition-transform duration-500 rounded-xl"
                    />
                  </div>
                )}
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}
