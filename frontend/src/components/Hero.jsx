import logo from '../assets/logo.jpg'

export default function Hero() {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-20"
    >
      {/* Honeycomb/Hexagonal Background Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66zm0-2L54 49L54 17L28 2L2 17L2 49L28 64zm28 34L28 82L0 98L0 100L28 100L56 100L56 98z' fill='%23FFD400' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px'
        }}
      ></div>

      {/* Modern Gradient Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-dark-gold/10 blur-3xl"></div>

      {/* Diagonal swoosh visual line inspired by PDF design */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 via-transparent to-transparent transform skew-x-12 origin-top-right"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-down">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-inter text-xs text-gray-300 font-semibold tracking-wider uppercase">Website Resmi HMTP UNISBA</span>
        </div>

        {/* Logo container */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:bg-primary/50 transition duration-500"></div>
            <img 
              src={logo} 
              alt="Logo HMTP UNISBA" 
              className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-primary shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-poppins font-black text-5xl md:text-7xl text-white tracking-tight leading-none mb-4">
          HMTP <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-dark-gold">UNISBA</span>
        </h1>

        {/* Description / tagline */}
        <p className="max-w-2xl mx-auto font-inter text-base md:text-lg text-gray-400 leading-relaxed mb-12">
          Himpunan Mahasiswa Teknik Pertambangan Universitas Islam Bandung. Media informasi resmi, publikasi kegiatan, dan wadah komunikasi organisasi tambang.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#about" 
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-dark-gold text-black font-poppins font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            Jelajahi Profil
          </a>
          <a 
            href="#programs" 
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-poppins font-semibold rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
          >
            Program Kerja
          </a>
        </div>
      </div>
    </section>
  )
}
