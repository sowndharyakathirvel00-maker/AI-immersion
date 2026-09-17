import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  TrendingDown,
  Sparkles,
  PieChart,
  BarChart3,
  LineChart as LineChartIcon,
  Info,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Leaf,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const InsightsView: React.FC = () => {
  const { userProfile, wasteRecords, groceries } = useApp();

  // 1. Food Waste by Month (Bar chart)
  const wasteByMonthData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Projected)'],
    datasets: [
      {
        label: 'Wasted Food (kg)',
        data: [3.2, 2.8, 2.4, 2.1, 1.4, 0.9],
        backgroundColor: '#DE7E36',
        borderRadius: 8,
      },
    ],
  };

  // 2. Money Lost to Food Waste (Line chart)
  const moneyLostData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Est)'],
    datasets: [
      {
        label: `Money Lost (${userProfile.currency})`,
        data: [720, 640, 510, 430, 240, 160],
        borderColor: '#C94A4A',
        backgroundColor: 'rgba(201, 74, 74, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#C94A4A',
        pointRadius: 4,
      },
    ],
  };

  // 3. Waste by Category (Doughnut chart)
  const wasteByCategoryData = {
    labels: ['Vegetables', 'Bakery', 'Dairy', 'Fruits', 'Cooked Meals', 'Other'],
    datasets: [
      {
        data: [38, 24, 18, 11, 6, 3],
        backgroundColor: [
          '#4E7A58',
          '#E8863A',
          '#60A5FA',
          '#FBBF24',
          '#F472B6',
          '#A8A29E',
        ],
        borderWidth: 2,
        borderColor: '#FFFFFF',
      },
    ],
  };

  // 4. Consumed vs Expired (Bar chart)
  const consumedVsExpiredData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Consumed In Time',
        data: [26, 30, 34, 39, 44],
        backgroundColor: '#3F6E4E',
        borderRadius: 6,
      },
      {
        label: 'Expired / Discarded',
        data: [7, 6, 4, 3, 1],
        backgroundColor: '#C94A4A',
        borderRadius: 6,
      },
    ],
  };

  // 5. Grocery Consumption Trend (Line chart)
  const consumptionTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Groceries Consumed (Items)',
        data: [9, 12, 14, 11],
        borderColor: '#3F6E4E',
        backgroundColor: 'rgba(63, 110, 78, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3F6E4E',
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11 },
          color: '#283A2E',
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: '#1A2820',
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#55695E' },
      },
      y: {
        grid: { color: '#EDE8DE' },
        ticks: { font: { size: 10 }, color: '#55695E' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { family: 'Plus Jakarta Sans', size: 11 },
          color: '#283A2E',
          boxWidth: 10,
        },
      },
    },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-[#FAF6ED] rounded-3xl p-6 sm:p-7 border border-[#E8E0D0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#2F543C] text-xs font-bold shadow-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#3F6E4E]" />
            <span>Kitchen Analytics & Carbon Savings</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2820]">
            Food Waste & Consumption Insights
          </h2>
          <p className="text-xs text-[#52685B]">
            Data-driven trends showing how mindful meal planning saves household money and reduces food waste.
          </p>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-[#D5E6DA] text-xs text-[#2F543C] flex items-center gap-2">
          <Leaf className="w-5 h-5 text-[#3F6E4E]" />
          <div>
            <span className="font-bold block">14.8 kg Saved to Date</span>
            <span className="text-[10px] text-[#55695E]">Equivalent to ₹3,120 conserved</span>
          </div>
        </div>
      </div>

      {/* Key Analytical Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center gap-2 text-[#A24D14] mb-2 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-[#DE7E36]" />
            <span>Category Risk</span>
          </div>
          <h3 className="text-sm font-bold text-[#1A2820]">
            “Vegetables are your most frequently wasted category.”
          </h3>
          <p className="text-xs text-[#52685B] mt-1 leading-relaxed">
            Leafy greens spoil fastest. Consider storing spinach in airtight paper towels or buying frozen peas.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center gap-2 text-[#2F543C] mb-2 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#3F6E4E]" />
            <span>Positive Progress</span>
          </div>
          <h3 className="text-sm font-bold text-[#1A2820]">
            “You reduced potential waste by 42% compared with last month.”
          </h3>
          <p className="text-xs text-[#52685B] mt-1 leading-relaxed">
            Cooking recommended recipes before expiry has driven monthly waste losses from ₹720 down to ₹240.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center gap-2 text-[#3F6E4E] mb-2 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-[#3F6E4E]" />
            <span>Data Transparency</span>
          </div>
          <h3 className="text-sm font-bold text-[#1A2820]">
            Demo Sample Model Active
          </h3>
          <p className="text-xs text-[#52685B] mt-1 leading-relaxed">
            Historical graphs combine your live pantry actions with simulated baseline household records.
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Food Waste by Month */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#DE7E36]" />
              <h4 className="text-sm font-bold text-[#1A2820]">
                Food Waste by Month (kg)
              </h4>
            </div>
            <span className="text-[10px] text-[#718779] bg-[#FAF8F3] px-2 py-0.5 rounded border">
              Sample Data
            </span>
          </div>
          <div className="h-64">
            <Bar data={wasteByMonthData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 2: Money Lost to Food Waste */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-[#1A2820]">
                Money Lost to Food Waste ({userProfile.currency})
              </h4>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              ↓ 66% Down Trend
            </span>
          </div>
          <div className="h-64">
            <Line data={moneyLostData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 3: Waste by Category */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#3F6E4E]" />
              <h4 className="text-sm font-bold text-[#1A2820]">
                Waste Breakdown by Category (%)
              </h4>
            </div>
            <span className="text-[10px] text-[#718779]">All Recorded Items</span>
          </div>
          <div className="h-64">
            <Doughnut data={wasteByCategoryData} options={doughnutOptions} />
          </div>
        </div>

        {/* Chart 4: Consumed vs Expired */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#3F6E4E]" />
              <h4 className="text-sm font-bold text-[#1A2820]">
                Consumed In Time vs Expired (Count)
              </h4>
            </div>
            <span className="text-[10px] text-[#3F6E4E] font-semibold">
              Turnover Efficiency
            </span>
          </div>
          <div className="h-64">
            <Bar data={consumedVsExpiredData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 5: Grocery Consumption Trend (Full width on lg) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-[#3F6E4E]" />
              <h4 className="text-sm font-bold text-[#1A2820]">
                Weekly Grocery Consumption Trend (Items Rescued & Cooked)
              </h4>
            </div>
            <span className="text-xs text-[#52685B]">September Cycle</span>
          </div>
          <div className="h-64">
            <Line data={consumptionTrendData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
