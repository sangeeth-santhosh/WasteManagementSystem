import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { wasteService } from '../services/wasteService';
import Card from '../components/ui/Card';

const sections = [
  {
    title: 'Wet Waste',
    color: 'from-green-500 to-emerald-500',
    icon: '🌱',
    points: ['Food scraps and peels', 'Great for composting', 'Keep separate to avoid smell'],
  },
  {
    title: 'Dry Waste',
    color: 'from-blue-500 to-cyan-500',
    icon: '📄',
    points: ['Paper, cardboard, cloth', 'Keep clean and dry', 'Flatten boxes to save space'],
  },
  {
    title: 'Plastic',
    color: 'from-amber-500 to-orange-500',
    icon: '♻️',
    points: ['Bottles, covers, wrappers', 'Rinse before disposal', 'Reduce single-use items'],
  },
  {
    title: 'E-Waste',
    color: 'from-purple-500 to-indigo-500',
    icon: '🔌',
    points: ['Batteries, chargers, gadgets', 'Do not mix with regular waste', 'Recycle through authorized centers'],
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
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-1">Welcome</p>
        <h1 className="text-3xl font-bold text-gray-900">Hello{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h1>
        <p className="text-gray-600 mt-2">Track your waste management journey and make a positive impact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6" hover>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-600">This Month</p>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '—' : `${stats.monthlyTotal} kg`}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total waste collected</p>
        </Card>

        <Card className="p-6" hover>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-600">This Week</p>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📅</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '—' : `${stats.weeklyTotal} kg`}
          </p>
          <p className="text-xs text-gray-500 mt-1">Weekly contribution</p>
        </Card>

        <Card className="p-6" hover>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-600">Total Reports</p>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '—' : stats.totalReports}
          </p>
          <p className="text-xs text-gray-500 mt-1">Reports submitted</p>
        </Card>
      </div>

      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">♻️</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Daily Reminder</h3>
            <p className="text-gray-700">Segregate before you throw. Small habits make a big impact on recycling efficiency and a cleaner neighborhood.</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Waste Segregation Guide</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title} className="overflow-hidden" hover>
              <div className={`h-1.5 bg-gradient-to-r ${section.color}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                  <span className="text-3xl">{section.icon}</span>
                </div>
                <ul className="space-y-2.5">
                  {section.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1.5 text-emerald-500 font-bold">•</span>
                      <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

