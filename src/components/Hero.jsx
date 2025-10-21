import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[75vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Qe6dlWJktclXcUBS/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs tracking-wide uppercase">404-ready • Modern analyzer</span>
          <h1 className="mt-4 text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Find broken links in video descriptions
          </h1>
          <p className="mt-4 text-white/80 text-sm sm:text-base">
            Paste any YouTube, TikTok, or Vimeo description text and instantly check which links are working, broken, or blocked by CORS.
          </p>
        </div>
      </div>
    </section>
  );
}
