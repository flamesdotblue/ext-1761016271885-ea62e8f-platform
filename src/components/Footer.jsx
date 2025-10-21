export default function Footer() {
  return (
    <footer className="mt-16 py-10 text-center text-xs text-white/40">
      <div className="mx-auto max-w-5xl px-4">
        <p>Built for creators and teams who care about keeping links alive. Some results may show as Unknown due to CORS restrictions from destination sites.</p>
        <p className="mt-2">No data leaves your browser. © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
