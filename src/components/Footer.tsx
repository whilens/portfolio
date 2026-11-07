export function Footer() {
  return (
    <footer className="relative z-[2] border-t border-white/8 px-6 py-9">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 text-sm text-[#8D97AB]">
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
