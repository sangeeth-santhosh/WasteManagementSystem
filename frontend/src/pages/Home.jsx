const sections = [
  {
    title: 'Wet Waste',
    color: 'from-green-500 to-emerald-500',
    points: ['Food scraps and peels', 'Great for composting', 'Keep separate to avoid smell'],
  },
  {
    title: 'Dry Waste',
    color: 'from-blue-500 to-cyan-500',
    points: ['Paper, cardboard, cloth', 'Keep clean and dry', 'Flatten boxes to save space'],
  },
  {
    title: 'Plastic',
    color: 'from-amber-500 to-orange-500',
    points: ['Bottles, covers, wrappers', 'Rinse before disposal', 'Reduce single-use items'],
  },
  {
    title: 'E-Waste',
    color: 'from-purple-500 to-indigo-500',
    points: ['Batteries, chargers, gadgets', 'Do not mix with regular waste', 'Recycle through authorized centers'],
  },
];

const Home = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-green-600 font-semibold">Welcome</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Segregate smart, keep your city clean</h1>
            <p className="text-gray-600 mt-3 max-w-2xl">
              Separate wet, dry, plastic and e-waste. Small habits make a big impact on recycling efficiency and a cleaner neighborhood.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-md">
            <div className="text-3xl">♻️</div>
            <div>
              <p className="text-sm text-green-100">Daily reminder</p>
              <p className="text-lg font-semibold">Segregate before you throw</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className={`h-2 bg-gradient-to-r ${section.color}`} />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                <span className="text-2xl">🧩</span>
              </div>
              <ul className="space-y-2 text-gray-600">
                {section.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1 text-green-500">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

