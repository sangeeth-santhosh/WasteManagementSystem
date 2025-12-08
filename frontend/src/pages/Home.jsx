import Awarness from "../components/Awarness";

const Home = () => {
  return (
    <div>
      {/* Hero content */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-8 sm:px-12 xl:px-0 pt-10 pb-12 items-center">
        {/* Left text */}
        <div className="space-y-6">
          <p className="inline-flex items-center text-[12px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5">
            ♻️ Smart Waste Segregation · Wet · Dry · Plastic · E-waste
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-slate-900">
            Welcome to
            <span className="block text-emerald-600">Clean City Hub</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl">
            Learn how to separate{" "}
            <span className="font-semibold">
              wet, dry, plastic, and e-waste
            </span>{" "}
            the right way. Every correct report helps your neighbourhood stay
            cleaner, greener, and healthier.
          </p>

          {/* Category chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex flex-col gap-1">
              <span className="text-[12px] font-semibold text-emerald-700">
                Wet Waste
              </span>
              <span className="text-[11px] text-emerald-900/80">
                Food, peels, garden waste.
              </span>
            </div>
            <div className="rounded-2xl bg-sky-50 border border-sky-100 px-4 py-3 flex flex-col gap-1">
              <span className="text-[12px] font-semibold text-sky-700">
                Dry Waste
              </span>
              <span className="text-[11px] text-sky-900/80">
                Paper, cardboard, metal.
              </span>
            </div>
            <div className="rounded-2xl bg-yellow-50 border border-yellow-100 px-4 py-3 flex flex-col gap-1">
              <span className="text-[12px] font-semibold text-amber-700">
                Plastic
              </span>
              <span className="text-[11px] text-amber-900/80">
                Bottles, wrappers, covers.
              </span>
            </div>
            <div className="rounded-2xl bg-slate-900 text-white border border-slate-700 px-4 py-3 flex flex-col gap-1">
              <span className="text-[12px] font-semibold">E-waste</span>
              <span className="text-[11px] text-slate-100/80">
                Phones, chargers, gadgets.
              </span>
            </div>
          </div>

          {/* Secondary CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-5 py-2.5 text-xs md:text-sm font-medium shadow hover:bg-slate-800 transition">
              Learn Segregation Rules
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
              View Community Impact
            </button>
          </div>
        </div>

        {/* Right visual: card */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Big circular backdrop */}
          <div
            className="absolute -top-6 inset-x-10 h-72 bg-white/70 rounded-[32px] blur-2xl"
            aria-hidden="true"
          ></div>

          <div className="relative w-full max-w-sm sm:max-w-md flex justify-center">
            {/* Main card */}
            <div className="w-full rounded-[30px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.35)] border border-slate-100 px-5 pt-5 pb-6 flex flex-col gap-3.5">
              {/* top bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold">
                    U
                  </div>
                  <div className="leading-tight">
                    <p className="text-[12px] font-semibold text-slate-900">
                      You
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Today&apos;s impact
                    </p>
                  </div>
                </div>
                <span className="text-[12px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                  +12 pts
                </span>
              </div>

              {/* mini list of last reports */}
              <div className="mt-1.5 space-y-2.5">
                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs">
                      🌿
                    </div>
                    <div className="leading-tight">
                      <p className="text-[12px] font-semibold text-slate-900">
                        Wet Waste
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Kitchen scraps · 2kg
                      </p>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-emerald-700">
                    +5
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-sky-50 px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs">
                      📦
                    </div>
                    <div className="leading-tight">
                      <p className="text-[12px] font-semibold text-slate-900">
                        Dry Waste
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Cardboard · 1kg
                      </p>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-sky-700">
                    +3
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-900 text-white px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs">
                      🔋
                    </div>
                    <div className="leading-tight">
                      <p className="text-[12px] font-semibold">E-waste</p>
                      <p className="text-[10px] text-slate-300">
                        Old phone dropped off
                      </p>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-emerald-300">
                    +8
                  </span>
                </div>
              </div>

              {/* footer stats */}
              <div className="mt-2 grid grid-cols-3 gap-2.5 text-center">
                <div className="rounded-2xl bg-slate-50 py-2.5">
                  <p className="text-[12px] font-semibold text-slate-900">
                    32 kg
                  </p>
                  <p className="text-[10px] text-slate-500">Total sorted</p>
                </div>
                <div className="rounded-2xl bg-slate-50 py-2.5">
                  <p className="text-[12px] font-semibold text-emerald-600">
                    18
                  </p>
                  <p className="text-[10px] text-slate-500">Reports</p>
                </div>
                <div className="rounded-2xl bg-slate-50 py-2.5">
                  <p className="text-[12px] font-semibold text-amber-600">A+</p>
                  <p className="text-[10px] text-slate-500">Score</p>
                </div>
              </div>
            </div>

            {/* floating badge left */}
            <div className="hidden sm:flex absolute -left-7 top-12 flex-col items-center gap-2">
              <div className="rounded-2xl bg-white shadow-lg border border-slate-100 px-3.5 py-2.5 text-[11px] text-slate-700 max-w-[150px]">
                <span className="font-semibold text-emerald-600">
                  Did you know?
                </span>
                <p className="mt-1 text-[10px]">
                  Segregated waste can reduce landfill volume by up to 60%.
                </p>
              </div>
            </div>

            {/* floating avatar right */}
            <div className="hidden sm:flex absolute -right-5 bottom-8">
              <div className="rounded-2xl bg-white shadow-lg border border-slate-100 px-3.5 py-2.5 flex items-center gap-2.5 text-[11px]">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
                  🌍
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-slate-900">
                    Neighbourhood Stats
                  </p>
                  <p className="text-[10px] text-slate-500">
                    124 active reporters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        <Awarness />
      </div>
    </div>
  );
};

export default Home;
