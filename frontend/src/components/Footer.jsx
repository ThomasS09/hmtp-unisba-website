import logo from '../assets/logo.jpg'

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Visual background gradient */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Info (5 columns) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Logo HMTP UNISBA" 
                className="h-12 w-12 rounded-full border border-primary/40 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-poppins font-bold text-white text-lg tracking-wider leading-none">HMTP</span>
                <span className="font-inter text-xs text-primary font-medium tracking-widest mt-1">UNISBA</span>
              </div>
            </div>
            
            <p className="font-inter text-sm leading-relaxed max-w-sm text-gray-400">
              Himpunan Mahasiswa Teknik Pertambangan Universitas Islam Bandung (HMTP UNISBA) sebagai wadah perjuangan, pengembangan, dan keprofesian mahasiswa pertambangan.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a 
                href="https://instagram.com/hmtpunisba" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300"
              >
                <span className="text-xs font-bold font-inter">IG</span>
              </a>
              <a 
                href="https://tiktok.com/@hmtp.unisba" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300"
              >
                <span className="text-xs font-bold font-inter">TT</span>
              </a>
              <a 
                href="mailto:Hmtp.adhikarakarsa@gmail.com" 
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300"
              >
                <span className="text-xs font-bold font-inter">ML</span>
              </a>
            </div>
          </div>

          {/* Quick Links (3 columns) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-poppins font-bold text-white uppercase tracking-wider text-sm">Tautan Cepat</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#home" className="hover:text-primary transition-colors">Beranda</a></li>
              <li><a href="#sejarah" className="hover:text-primary transition-colors">Sejarah Himpunan</a></li>
              <li><a href="#logo-meaning" className="hover:text-primary transition-colors">Arti Lambang</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Semboyan Kabinet</a></li>
              <li><a href="#vision-mission" className="hover:text-primary transition-colors">Visi & Misi</a></li>
              <li><a href="#structure" className="hover:text-primary transition-colors">Struktur Organisasi</a></li>
              <li><a href="#programs" className="hover:text-primary transition-colors">Program Kerja</a></li>
            </ul>
          </div>

          {/* Contact (4 columns) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-poppins font-bold text-white uppercase tracking-wider text-sm">Kontak Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <span className="leading-relaxed">Sekretariat HMTP UNISBA, Gedung Student Center UNISBA, Jl. Tamansari No. 1, Bandung, Jawa Barat.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-lg">✉️</span>
                <a href="mailto:Hmtp.adhikarakarsa@gmail.com" className="hover:text-primary transition-colors">Hmtp.adhikarakarsa@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <a href="https://wa.me/6281214141983" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+62 812-1414-1983 (Humas)</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Sub-footer (Copyright) */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-inter text-gray-500">
          <p>© 2026 HMTP UNISBA. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
