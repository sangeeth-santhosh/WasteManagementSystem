import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { wasteService } from '../services/wasteService';
import Card from '../components/ui/Card';

const journeySteps = [
  {
    id: 1,
    title: 'Wet Waste – Start of the Flow',
    short: 'Wet Waste',
    side: 'right',
    icon: '🌱',
    description: 'Kitchen peels, leftover food and tea powder go only in the wet bin. When kept separate, they become compost instead of smelly landfill.',
    tip: 'Always keep a small covered bin near the sink only for wet waste.',
  },
  {
    id: 2,
    title: 'Dry Waste – Safe on the River Banks',
    short: 'Dry Waste',
    side: 'left',
    icon: '📄',
    description: 'Clean paper, cardboard and cloth stay dry and can be recycled. If they get wet or oily, they usually go to landfill.',
    tip: 'Use a box only for newspapers, books and cardboard – no food stains.',
  },
  {
    id: 3,
    title: 'Plastic – Strong Currents',
    short: 'Plastic',
    side: 'right',
    icon: '♻️',
    description: 'Bottles and wrappers often end up blocking drains and rivers. Rinse them and put into a plastic bin so they go to recycling, not water.',
    tip: 'Carry a cloth bag and bottle so you create less plastic in the first place.',
  },
  {
    id: 4,
    title: 'E-Waste – Toxic Pools',
    short: 'E-Waste',
    side: 'left',
    icon: '🔌',
    description: 'Batteries and gadgets leak chemicals into soil and water if mixed with normal waste. They must go only to authorized collection centers.',
    tip: 'Keep one small “e-waste box” at home and empty it once a month.',
  },
];

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    monthlyTotal: null,
    totalReports: null,
    weeklyTotal: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [monthly, weekly, reports] = await Promise.all([
          wasteService.getMonthlySummary().catch(() => ({ data: { totalWaste: '0.00' } })),
          wasteService.getWeeklySummary().catch(() => ({ data: { totalWaste: '0.00' } })),
          wasteService.getMyReports().catch(() => ({ data: [] })),
        ]);
        setStats({
          monthlyTotal: monthly.data?.totalWaste || '0.00',
          weeklyTotal: weekly.data?.totalWaste || '0.00',
          totalReports: reports.data?.length || 0,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* WELCOME */}
      <div>
        <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-1">
          Welcome
        </p>
        <h1 className="text-3xl font-bold text-gray-900">
          Hello{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your waste management journey and see how segregation protects our rivers, soil and air.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 relative overflow-hidden group" hover>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-green-400" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-600">This Month</p>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
              <span className="text-xl">📊</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '—' : `${stats.monthlyTotal} kg`}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total waste collected</p>
        </Card>

        <Card className="p-6 relative overflow-hidden group" hover>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 to-blue-500" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-600">This Week</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
              <span className="text-xl">📅</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '—' : `${stats.weeklyTotal} kg`}
          </p>
          <p className="text-xs text-gray-500 mt-1">Weekly contribution</p>
        </Card>

        <Card className="p-6 relative overflow-hidden group" hover>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-600">Total Reports</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
              <span className="text-xl">📝</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '—' : stats.totalReports}
          </p>
          <p className="text-xs text-gray-500 mt-1">Reports submitted</p>
        </Card>
      </div>

      {/* DAILY REMINDER */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🌳</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Daily Reminder</h3>
            <p className="text-gray-700 text-sm">
              Segregate before you throw. The way you separate wet, dry, plastic and e-waste decides
              if your city drains stay clean or get choked.
            </p>
          </div>
        </div>
      </Card>

      {/* 🌊 RIVER STORY SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50 via-sky-50 to-emerald-100 px-4 py-8 md:px-8 md:py-10">
        {/* soft background blobs */}
        <div className="pointer-events-none absolute -left-10 top-6 h-20 w-20 rounded-full bg-emerald-200/40 blur-2xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-24 w-24 rounded-full bg-sky-200/40 blur-2xl" />
        <div className="pointer-events-none absolute -right-8 bottom-10 h-16 w-16 rounded-full bg-emerald-300/40 blur-2xl" />

        {/* header */}
        <div className="relative mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              Waste Segregation River Journey
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Story Mode
              </span>
            </h2>
            <p className="mt-1 text-sm text-gray-700 max-w-2xl">
              Think of your waste as travelling along a blue-green river. At every bend, how you
              handle each type of waste decides if the water stays clear or gets polluted.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Scroll down – right, left, right, left – just like a snake-shaped river 🌊</span>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* CENTRAL SNAKE-LIKE RIVER */}
          <svg
            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 h-full w-40 -z-10"
            viewBox="0 0 100 500"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="riverGradientWaste" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="40%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
              <filter id="riverGlowWaste">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.15  0 0 0 0 0.6  0 0 0 0 0.7  0 0 0 0.7 0"
                />
              </filter>
            </defs>

            {/* glow */}
            <path
              d="M50 0 C 15 70 85 140 50 210 S 15 350 50 420 S 85 490 50 520"
              stroke="url(#riverGradientWaste)"
              strokeWidth="20"
              fill="none"
              filter="url(#riverGlowWaste)"
              opacity="0.4"
            />
            {/* main river */}
            <path
              d="M50 0 C 15 70 85 140 50 210 S 15 350 50 420 S 85 490 50 520"
              stroke="url(#riverGradientWaste)"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* floating emojis on river */}
          <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 animate-bounce text-xl">
            🐟
          </div>
          <div className="pointer-events-none absolute left-[52%] top-1/3 -translate-x-1/2 animate-bounce text-xl">
            🌊
          </div>
          <div className="pointer-events-none absolute left-[48%] top-2/3 -translate-x-1/2 animate-bounce text-xl">
            🐢
          </div>

          {/* JOURNEY STEPS */}
          <div className="space-y-12 pt-2">
            {journeySteps.map((step, index) => {
              const isRight = step.side === 'right';

              return (
                <div
                  key={step.id}
                  className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-8"
                >
                  {/* LEFT IMAGE (for left steps) */}
                  <div
                    className={`${
                      isRight ? 'md:order-1' : 'md:order-1'
                    } flex justify-end`}
                  >
                    {!isRight && (
                      <div className="max-w-xs md:max-w-sm">
                        {/* INLINE SVG “IMAGE” – trees, bin, small house */}
                        <Card className="overflow-hidden rounded-2xl bg-white/90 border border-emerald-100 shadow-md" hover>
                          <div className="relative h-40 w-full">
                            <svg
                              viewBox="0 0 200 140"
                              className="w-full h-full"
                              aria-hidden="true"
                            >
                              {/* sky */}
                              <rect x="0" y="0" width="200" height="90" fill="#E0F2FE" />
                              {/* ground */}
                              <rect x="0" y="90" width="200" height="50" fill="#BBF7D0" />
                              {/* trees */}
                              <circle cx="40" cy="60" r="18" fill="#22C55E" />
                              <rect x="36" y="70" width="8" height="20" fill="#166534" />
                              <circle cx="80" cy="55" r="16" fill="#22C55E" />
                              <rect x="76" y="65" width="8" height="20" fill="#166534" />
                              {/* house */}
                              <rect x="120" y="65" width="40" height="32" fill="#F97316" />
                              <polygon
                                points="120,65 140,45 160,65"
                                fill="#EA580C"
                              />
                              <rect x="130" y="78" width="10" height="19" fill="#FDE68A" />
                              {/* bin */}
                              <rect x="20" y="78" width="24" height="26" rx="4" fill="#16A34A" />
                              <rect x="18" y="74" width="28" height="6" rx="3" fill="#15803D" />
                              {/* recycle symbol simple */}
                              <polygon
                                points="27,84 34,84 31,89"
                                fill="#BBF7D0"
                              />
                              <polygon
                                points="32,90 35,96 29,96"
                                fill="#BBF7D0"
                              />
                              <polygon
                                points="26,90 23,96 29,96"
                                fill="#BBF7D0"
                              />
                            </svg>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* CENTER EXPLANATION ON RIVER */}
                  <div className="flex justify-center">
                    <div className="relative">
                      {/* glowing circle on river */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-white/70 shadow-md">
                          <div className="h-full w-full rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 opacity-60 animate-pulse" />
                        </div>
                      </div>
                      {/* step badge on top */}
                      <div className="relative flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                          <span className="text-xl">{step.icon}</span>
                        </div>
                        <Card className="mt-1 px-4 py-3 text-center bg-white/95 border border-emerald-100 shadow-sm max-w-xs">
                          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                            Step {index + 1} · {step.short}
                          </p>
                          <p className="mt-1 text-xs text-gray-700 leading-relaxed">
                            {step.description}
                          </p>
                          <p className="mt-2 text-[10px] italic text-gray-500">
                            💡 {step.tip}
                          </p>
                        </Card>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT IMAGE (for right steps) */}
                  <div className={`${isRight ? 'md:justify-start' : 'md:justify-start'} flex`}>
                    {isRight && (
                      <div className="max-w-xs md:max-w-sm">
                        <Card className="overflow-hidden rounded-2xl bg-white/90 border border-emerald-100 shadow-md" hover>
                          <div className="relative h-40 w-full">
                            <svg
                              viewBox="0 0 200 140"
                              className="w-full h-full"
                              aria-hidden="true"
                            >
                              {/* sky */}
                              <rect x="0" y="0" width="200" height="90" fill="#DBEAFE" />
                              {/* ground */}
                              <rect x="0" y="90" width="200" height="50" fill="#BBF7D0" />
                              {/* distant hills */}
                              <ellipse cx="50" cy="90" rx="40" ry="18" fill="#4ADE80" />
                              <ellipse cx="150" cy="90" rx="40" ry="16" fill="#22C55E" />
                              {/* river small curve */}
                              <path
                                d="M110 140 C 90 120 100 100 80 80 C 70 70 60 60 60 50"
                                stroke="#38BDF8"
                                strokeWidth="10"
                                fill="none"
                                strokeLinecap="round"
                                opacity="0.8"
                              />
                              {/* character + bin */}
                              <circle cx="145" cy="58" r="12" fill="#0EA5E9" />
                              <rect x="138" y="70" width="14" height="18" fill="#0EA5E9" />
                              <rect
                                x="30"
                                y="78"
                                width="26"
                                height="26"
                                rx="4"
                                fill="#15803D"
                              />
                              <rect
                                x="28"
                                y="74"
                                width="30"
                                height="6"
                                rx="3"
                                fill="#166534"
                              />
                              {/* simple recycle arrows */}
                              <polygon
                                points="38,84 45,84 42,89"
                                fill="#BBF7D0"
                              />
                              <polygon
                                points="43,90 46,96 40,96"
                                fill="#BBF7D0"
                              />
                              <polygon
                                points="37,90 34,96 40,96"
                                fill="#BBF7D0"
                              />
                            </svg>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* bottom summary */}
          <div className="mt-10">
            <Card className="border-dashed border-emerald-300 bg-emerald-50/80 p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    End of the River · Clean City
                  </p>
                  <h3 className="mt-1 text-sm md:text-base font-bold text-gray-900">
                    When wet, dry, plastic and e-waste are handled separately at home, the whole
                    river system – from street drains to the sea – stays cleaner.
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white px-3 py-1 font-medium text-emerald-700">
                    🌱 Wet → Compost
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 font-medium text-sky-700">
                    📄 Dry → Recycle
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 font-medium text-amber-700">
                    ♻️ Plastic → Processing
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 font-medium text-purple-700">
                    🔌 E-Waste → Safe centers
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
