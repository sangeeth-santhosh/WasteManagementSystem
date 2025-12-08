const Awarness = () => {
  return (
    <div>
      {/* SCROLL JOURNEY */}
      <main className="w-full max-w-11xl space-y-12 pb-16">
        {/* 1) Journey Hero: Know Your Waste */}
        <section className="reveal rounded-[32px] bg-gradient-to-br from-emerald-700 via-emerald-500 to-sky-500 text-white px-6 sm:px-10 py-14 md:py-16 relative overflow-hidden">
          {/* soft nature glow */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="w-40 h-40 rounded-full bg-emerald-300/40 float-slow absolute -left-10 top-6"></div>
            <div className="w-52 h-52 rounded-full bg-sky-300/40 float-slow absolute right-0 bottom-0"></div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* LEFT: TEXT + NATURE PROTECTION MESSAGE */}
            <div className="space-y-4">
              <p className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 border border-white/30">
                🌱 Know your waste · Protect our nature
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Know your waste.
                <span className="block">Guard the green around you.</span>
              </h2>
              <p className="text-sm sm:text-base text-emerald-50/90 max-w-md">
                Every correctly sorted bin keeps soil cleaner, water clearer,
                and trees standing taller.
              </p>
              <p className="text-[12px] sm:text-[13px] text-emerald-50/90 max-w-md">
                One tiny action at home can shield entire streets, lakes, and
                parks from hidden toxins.
              </p>
            </div>

            {/* RIGHT: NATURE TREE FOCUS */}
            <div className="relative flex justify-center md:justify-end">
              {/* drifting leaves around tree */}
              <span className="leaf leaf--small -left-3 top-4"></span>
              <span className="leaf right-4 top-2 leaf--slow"></span>
              <span className="leaf leaf--small left-4 bottom-4"></span>
              <span className="leaf right-12 bottom-8 leaf--slow"></span>

              <div className="relative w-full max-w-sm">
                {/* soft sun + sky behind tree */}
                <div
                  className="absolute inset-x-6 -top-10 h-44 rounded-full bg-gradient-to-b from-amber-100/90 via-emerald-100/70 to-transparent blur-3xl opacity-90"
                  aria-hidden="true"
                ></div>

                {/* main nature card */}
                <div className="relative rounded-[30px] bg-white/10 border border-white/45 backdrop-blur-md px-6 pt-7 pb-6 hover-tilt">
                  <div className="relative h-40 w-full flex items-end justify-center">
                    {/* ground + hill */}
                    <div className="absolute bottom-1 w-40 h-10 bg-gradient-to-r from-emerald-800/90 via-emerald-700 to-emerald-900/95 rounded-full blur-[2px]"></div>
                    <div className="absolute bottom-6 w-48 h-12 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700 rounded-full opacity-80"></div>

                    {/* tree group */}
                    <div className="relative tree-sway">
                      {/* trunk */}
                      <div className="relative mx-auto w-7 h-20 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-full shadow-[0_8px_18px_rgba(15,23,42,0.7)]">
                        <div className="absolute inset-x-1 top-4 h-px bg-amber-600/60"></div>
                        <div className="absolute inset-x-1 top-8 h-px bg-amber-600/40"></div>
                      </div>
                      {/* canopy layers */}
                      <div className="absolute -top-8 left-1 w-24 h-20 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-[0_18px_40px_rgba(4,120,87,0.75)]"></div>
                      <div className="absolute -top-10 right-0 w-22 h-20 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 shadow-[0_18px_40px_rgba(16,185,129,0.8)]"></div>
                      <div className="absolute -top-4 left-5 right-3 h-18 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800"></div>
                      {/* small highlight leaves */}
                      <span className="absolute -top-4 left-4 text-[11px]">
                        🍃
                      </span>
                      <span className="absolute -top-2 right-3 text-[10px]">
                        ✨
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-[11px] text-emerald-50/95 text-center max-w-[240px] mx-auto">
                    When you sort your waste, you keep roots in the ground,
                    leaves in the sky, and rivers flowing clean.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* scroll indicator */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex flex-col items-center gap-1 text-[10px] text-emerald-100/90">
            <span className="uppercase tracking-[0.15em]">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-emerald-100 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-emerald-100 bounce-arrow"></div>
            </div>
          </div>
        </section>

        {/* 2) Household waste: Wet & Dry together */}
        <section className="reveal rounded-[32px] bg-gradient-to-br from-emerald-50 via-emerald-100 to-sky-50 px-6 sm:px-10 py-10 md:py-14 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl md:text-3xl font-semibold text-emerald-900">
              Household waste. Everyday impact.
            </h3>
            <p className="text-sm md:text-base text-emerald-900/85 max-w-xl">
              What leaves your kitchen and living room decides how clean your
              street, lake and sky stay.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-3 py-1 rounded-full bg-white/80 shadow-sm">
                Smarter kitchens
              </span>
              <span className="px-3 py-1 rounded-full bg-white/80 shadow-sm">
                Cleaner corridors
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-emerald-50 shadow-md">
                Nature-friendly habits
              </span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="hover-tilt rounded-[24px] bg-white shadow-[0_20px_50px_rgba(22,101,52,0.25)] p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌿</span>
                <p className="text-sm font-semibold text-emerald-900">
                  Wet waste
                </p>
              </div>
              <p className="text-[12px] text-emerald-900/85">
                Food scraps, peels, flowers. Keep it separate and let it become
                compost, not methane.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                  No plastic covers
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                  Drain excess liquid
                </span>
              </div>
            </div>
            <div className="hover-tilt rounded-[24px] bg-white shadow-[0_20px_50px_rgba(59,130,246,0.25)] p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <p className="text-sm font-semibold text-sky-900">Dry waste</p>
              </div>
              <p className="text-[12px] text-sky-900/85">
                Paper, cardboard, metal, clean plastic. Keep it dry so it can be
                recycled again and again.
              </p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-sky-50 border border-sky-100">
                  Rinse and dry
                </span>
                <span className="px-2.5 py-1 rounded-full bg-sky-50 border border-sky-100">
                  Flatten bulky items
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4) Plastic Waste section */}
        <section className="reveal rounded-[32px] bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100 px-6 sm:px-10 py-10 md:py-14 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl md:text-3xl font-semibold text-amber-900 flex items-center gap-2">
              <span className="text-3xl">🧴</span>
              <span>Plastic &amp; packaging</span>
            </h3>
            <p className="text-sm md:text-base text-amber-900/90 max-w-xl">
              Light, cheap and everywhere — but also one of nature&apos;s
              biggest headaches when mixed with other waste.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-3 py-1 rounded-full bg-white/80 shadow-sm">
                Say no to single-use
              </span>
              <span className="px-3 py-1 rounded-full bg-white/80 shadow-sm">
                Carry your own bag
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-600 text-amber-50 shadow-md">
                Choose refill &amp; bulk
              </span>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="hover-tilt w-full max-w-xs rounded-[28px] bg-white shadow-[0_20px_50px_rgba(234,179,8,0.4)] p-5 space-y-3">
              <p className="text-xs font-semibold text-amber-900">
                Give plastic a better ending.
              </p>
              <ul className="space-y-2 text-[11px] text-amber-900/90">
                <li className="flex items-start gap-2">
                  <span className="mt-[1px] text-[10px]">●</span>
                  <span>
                    Keep clean bottles and containers aside for recycling
                    drives.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[1px] text-[10px]">●</span>
                  <span>
                    Avoid thin, multi-layered plastic that is hard to recycle.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[1px] text-[10px]">●</span>
                  <span>
                    Switch one plastic habit at home this week — bottles, bags
                    or boxes.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5) E-waste section */}
        <section className="reveal rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 px-6 sm:px-10 py-10 md:py-14 flex flex-col md:flex-row items-center gap-8 text-slate-100">
          <div className="flex-1 space-y-3 order-1 md:order-2">
            <h3 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <span className="text-3xl">🔋</span>
              <span>Special waste: E-waste</span>
            </h3>
            <p className="text-sm md:text-base text-slate-100/90 max-w-xl">
              Phones, laptops, chargers and batteries hide toxic metals —
              powerful when recycled, dangerous when burnt or dumped.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-3 py-1 rounded-full bg-white/10">
                Store separately at home
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10">
                Use authorised collection drives
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-900">
                Keep toxins out of soil &amp; water
              </span>
            </div>
          </div>
          <div className="flex-1 flex justify-center order-2 md:order-1">
            <div className="hover-tilt w-full max-w-xs rounded-[28px] bg-slate-900/70 border border-emerald-400/40 shadow-[0_20px_60px_rgba(8,47,73,0.6)] p-5 space-y-3">
              <p className="text-xs font-semibold text-emerald-200">
                Simple e-waste routine
              </p>
              <ul className="space-y-2 text-[11px] text-slate-100/90">
                <li className="flex items-start gap-2">
                  <span className="mt-[1px] text-[10px]">●</span>
                  <span>
                    Keep a separate box at home for dead batteries and gadgets.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[1px] text-[10px]">●</span>
                  <span>
                    Drop them off during municipality or campus e-waste drives.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[1px] text-[10px]">●</span>
                  <span>
                    Never burn, break or throw e-waste in normal bins.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6) Swipe to report style CTA */}
        <section className="reveal rounded-[32px] bg-white px-6 sm:px-10 py-10 md:py-14 shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md space-y-3">
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
                Ready to report?
              </h3>
              <p className="text-sm md:text-base text-slate-600">
                Tap your bin type and create a clean, clear report in a few
                seconds.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="group rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-center text-[12px] cursor-pointer transform transition hover:-translate-y-2 hover:shadow-xl hover:bg-emerald-100">
                <p className="text-2xl mb-1">🌿</p>
                <p className="font-semibold text-emerald-800">Wet</p>
              </div>
              <div className="group rounded-2xl bg-sky-50 border border-sky-100 p-4 text-center text-[12px] cursor-pointer transform transition hover:-translate-y-2 hover:shadow-xl hover:bg-sky-100">
                <p className="text-2xl mb-1">📦</p>
                <p className="font-semibold text-sky-800">Dry</p>
              </div>
              <div className="group rounded-2xl bg-amber-50 border border-amber-100 p-4 text-center text-[12px] cursor-pointer transform transition hover:-translate-y-2 hover:shadow-xl hover:bg-amber-100">
                <p className="text-2xl mb-1">🧴</p>
                <p className="font-semibold text-amber-800">Plastic</p>
              </div>
              <div className="group rounded-2xl bg-slate-900 border border-slate-800 p-4 text-center text-[12px] cursor-pointer transform transition hover:-translate-y-2 hover:shadow-xl">
                <p className="text-2xl mb-1">🔋</p>
                <p className="font-semibold text-slate-50">E-waste</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Awarness;
