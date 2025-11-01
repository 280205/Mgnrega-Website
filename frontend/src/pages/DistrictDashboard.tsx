import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.tsx';
import {
  FaUsers, FaBriefcase, FaIdCard, FaRupeeSign,
  FaChartLine, FaArrowLeft, FaCheckCircle, FaClock
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../utils/api';

interface PerformanceData {
  district_name: string;
  year: number;
  month: number;
  person_days_generated: number;
  employment_provided: number;
  active_job_cards: number;
  average_wage: number;
  total_expenditure: number;
  works_completed: number;
  works_ongoing: number;
}

const DistrictDashboard: React.FC = () => {
  const { districtCode } = useParams<{ districtCode: string }>();
  const { t } = useLanguage();
  const [currentData, setCurrentData] = useState<PerformanceData | null>(null);
  const [historicalData, setHistoricalData] = useState<PerformanceData[]>([]);
  const [compareData, setCompareData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistrictData();
  }, [districtCode]);

  const fetchDistrictData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [currentRes, historyRes, compareRes] = await Promise.all([
        api.get(`/api/performance/current/${districtCode}`),
        api.get(`/api/performance/history/${districtCode}?months=12`),
        api.get(`/api/performance/compare/${districtCode}`)
      ]);

      setCurrentData(currentRes.data.data);
      setHistoricalData(historyRes.data.data);
      setCompareData(compareRes.data.data);
    } catch (error) {
      console.error('Error fetching district data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const getMonthName = (month: number): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (!currentData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md border border-gray-200">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-2xl font-bold text-gray-700 mb-4">{t('noData')}</p>
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = historicalData.map(item => ({
    month: `${getMonthName(item.month)} ${item.year}`,
    personDays: Math.round(item.person_days_generated / 1000),
    employment: item.employment_provided,
    wage: item.average_wage
  })).reverse();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-lg mb-4 hover:scale-105 transition-transform">
            <FaArrowLeft className="mr-2" />
            Back to Districts
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {currentData.district_name}
          </h1>
          <p className="text-gray-600 text-lg font-medium flex items-center">
            <span className="mr-2">📅</span>
            {getMonthName(currentData.month)} {currentData.year} • {t('currentPerformance')}
          </p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={<FaUsers className="text-3xl text-orange-600" />}
            title={t('personDays')}
            value={formatNumber(currentData.person_days_generated)}
            subtitle="in thousands"
            color="from-orange-400 to-orange-600"
            bgColor="bg-orange-50"
          />
          <MetricCard
            icon={<FaBriefcase className="text-3xl text-green-600" />}
            title={t('employment')}
            value={formatNumber(currentData.employment_provided)}
            subtitle="people employed"
            color="from-green-400 to-green-600"
            bgColor="bg-green-50"
          />
          <MetricCard
            icon={<FaIdCard className="text-3xl text-blue-600" />}
            title={t('activeJobCards')}
            value={formatNumber(currentData.active_job_cards)}
            subtitle="active cards"
            color="from-blue-400 to-blue-600"
            bgColor="bg-blue-50"
          />
          <MetricCard
            icon={<FaRupeeSign className="text-3xl text-purple-600" />}
            title={t('averageWage')}
            value={`₹${currentData.average_wage.toFixed(0)}`}
            subtitle="per day"
            color="from-purple-400 to-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Works Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl mr-4">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">{t('worksCompleted')}</h3>
                <p className="text-3xl font-bold text-green-600">{formatNumber(currentData.works_completed)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl mr-4">
                <FaClock className="text-3xl text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">{t('worksOngoing')}</h3>
                <p className="text-3xl font-bold text-blue-600">{formatNumber(currentData.works_ongoing)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <FaChartLine className="mr-3 text-orange-600" />
            {t('historicalTrends')}
          </h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              {t('personDays')} (in thousands)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="personDays" 
                  stroke="#ff6b35" 
                  strokeWidth={3}
                  name="Person Days (000s)"
                  dot={{ fill: '#ff6b35', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              {t('averageWage')} (₹)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="wage" 
                  fill="#ff6b35" 
                  name="Average Wage (₹)" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Comparison */}
        {compareData && compareData.stateAverage && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🏆</span>
              {t('comparison')} - District vs UP State Average
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ComparisonCard
                title={t('personDays')}
                districtValue={currentData.person_days_generated}
                stateValue={parseFloat(compareData.stateAverage.avg_person_days)}
              />
              <ComparisonCard
                title={t('employment')}
                districtValue={currentData.employment_provided}
                stateValue={parseFloat(compareData.stateAverage.avg_employment)}
              />
              <ComparisonCard
                title={t('activeJobCards')}
                districtValue={currentData.active_job_cards}
                stateValue={parseFloat(compareData.stateAverage.avg_job_cards)}
              />
              <ComparisonCard
                title={t('averageWage')}
                districtValue={currentData.average_wage}
                stateValue={parseFloat(compareData.stateAverage.avg_wage)}
                isCurrency
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, subtitle, color, bgColor }) => (
  <div className={`bg-white ${bgColor} border-2 border-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}>
    <div className={`bg-gradient-to-br ${color} p-3 rounded-xl mb-4 inline-block`}>
      {icon}
    </div>
    <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">{title}</h3>
    <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
    <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
  </div>
);

interface ComparisonCardProps {
  title: string;
  districtValue: number;
  stateValue: number;
  isCurrency?: boolean;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  title, 
  districtValue, 
  stateValue, 
  isCurrency = false 
}) => {
  const percentage = ((districtValue - stateValue) / stateValue * 100).toFixed(1);
  const isHigher = districtValue > stateValue;
  
  const formatValue = (val: number) => {
    if (isCurrency) return `₹${val.toFixed(0)}`;
    return new Intl.NumberFormat('en-IN').format(Math.round(val));
  };

  return (
    <div className="bg-white border-2 border-gray-200 p-6 rounded-xl hover:border-orange-400 hover:shadow-lg transition-all">
      <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">{title}</h4>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-3xl font-black text-gray-900">{formatValue(districtValue)}</span>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-bold ${
          isHigher 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          <span className="text-lg mr-1">{isHigher ? '↑' : '↓'}</span>
          {Math.abs(parseFloat(percentage))}%
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">State avg:</span>
        <span className="text-gray-700 font-bold">{formatValue(stateValue)}</span>
      </div>
    </div>
  );
};

export default DistrictDashboard;
