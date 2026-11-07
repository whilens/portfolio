export function Footer() {
  return (
    <footer className="relative z-[2] overflow-hidden border-t border-white/8 px-5 py-9 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-[#8D97AB] sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4">
        <span>© 2026 [Название студии]</span>
        <span>Сайты и мобильные приложения · Омск и вся Россия</span>
        <a
          href="https://github.com/PavelDoGreat/WebGL-Fluid-Simulation"
          className="text-ice/80 hover:text-ice"
          target="_blank"
          rel="noreferrer"
        >
          Fluid sim © Pavel Dobryakov
        </a>
      </div>
    </footer>
  );
}
