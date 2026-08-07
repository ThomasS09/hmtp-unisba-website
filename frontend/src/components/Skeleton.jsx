export default function Skeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16 animate-pulse">
      {/* Title & Badge placeholder */}
      <div className="flex flex-col items-center space-y-4">
        <div className="h-6 w-36 bg-white/5 border border-white/10 rounded-full"></div>
        <div className="h-10 w-64 sm:w-96 bg-white/5 border border-white/10 rounded-xl"></div>
        <div className="h-4 w-80 max-w-full bg-white/5 border border-white/10 rounded-lg"></div>
      </div>

      {/* Grid structure placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 h-64 flex flex-col justify-between"
            style={{ background: 'rgba(255,255,255,0.01)' }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl"></div>
                <div className="h-4 w-16 bg-white/5 border border-white/10 rounded-full"></div>
              </div>
              <div className="h-6 w-3/4 bg-white/5 border border-white/10 rounded-lg"></div>
              <div className="h-3.5 w-full bg-white/5 border border-white/10 rounded-lg"></div>
              <div className="h-3.5 w-5/6 bg-white/5 border border-white/10 rounded-lg"></div>
            </div>
            <div className="h-4 w-28 bg-white/5 border border-white/10 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
