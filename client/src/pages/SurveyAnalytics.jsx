import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  ClipboardList, 
  TrendingUp, 
  Users, 
  Target, 
  BookOpen,
  Brain,
  Heart,
  Clock
} from 'lucide-react';
import { surveysApi } from '../api/surveys';
import StatCard from '../components/StatCard';

const SurveyAnalytics = () => {
  // Fetch survey analytics
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['survey-analytics'],
    queryFn: surveysApi.getAnalytics
  });

  const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    totalResponses = 0,
    completionRate = 0,
    examDistribution = [],
    studyHoursDistribution = [],
    weakSubjects = [],
    strongSubjects = [],
    averageStressLevel = 0,
    averageConfidenceLevel = 0,
    resourcesUsed = [],
    recentSubmissions = []
  } = analytics || {};

  // Prepare data for charts
  const stressData = [
    {
      name: 'Stress Level',
      value: averageStressLevel,
      fill: '#ef4444'
    }
  ];

  const confidenceData = [
    {
      name: 'Confidence Level', 
      value: averageConfidenceLevel,
      fill: '#10b981'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-purple-600" />
              Survey Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Insights from student exam preparation surveys
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6 text-blue-600" />}
            title="Total Responses"
            value={totalResponses}
            subtitle="Survey submissions"
            className="bg-blue-50 dark:bg-blue-900/20"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            title="Completion Rate"
            value={`${completionRate}%`}
            subtitle="Students who completed"
            className="bg-green-50 dark:bg-green-900/20"
          />
          <StatCard
            icon={<Heart className="w-6 h-6 text-red-600" />}
            title="Avg Stress Level"
            value={`${averageStressLevel.toFixed(1)}/5`}
            subtitle="Student stress rating"
            className="bg-red-50 dark:bg-red-900/20"
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-purple-600" />}
            title="Avg Confidence"
            value={`${averageConfidenceLevel.toFixed(1)}/5`}
            subtitle="Student confidence rating"
            className="bg-purple-50 dark:bg-purple-900/20"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Exam Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Target Exam Distribution
            </h2>
            {examDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={examDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {examDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No exam data available
              </div>
            )}
          </div>

          {/* Study Hours Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Daily Study Hours Distribution
            </h2>
            {studyHoursDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studyHoursDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hours" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No study hours data available
              </div>
            )}
          </div>

          {/* Weak Subjects */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Most Common Weak Subjects
            </h2>
            {weakSubjects.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weakSubjects} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="subject" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No weak subjects data available
              </div>
            )}
          </div>

          {/* Resources Used */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Popular Learning Resources
            </h2>
            {resourcesUsed.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resourcesUsed}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="resource" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No resources data available
              </div>
            )}
          </div>
        </div>

        {/* Stress and Confidence Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stress Level Gauge */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Average Stress Level
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={stressData}>
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="value"
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-2xl font-bold text-gray-900 dark:text-white">
                  {averageStressLevel.toFixed(1)}/5
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {averageStressLevel >= 4 ? 'High stress levels detected' : 
                 averageStressLevel >= 3 ? 'Moderate stress levels' : 
                 'Low stress levels'}
              </p>
            </div>
          </div>

          {/* Confidence Level Gauge */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Average Confidence Level
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={confidenceData}>
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="value"
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-current text-2xl font-bold text-gray-900 dark:text-white">
                  {averageConfidenceLevel.toFixed(1)}/5
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {averageConfidenceLevel >= 4 ? 'High confidence levels' : 
                 averageConfidenceLevel >= 3 ? 'Moderate confidence levels' : 
                 'Low confidence levels'}
              </p>
            </div>
          </div>
        </div>

        {/* Strong Subjects List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strong Subjects */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Most Common Strong Subjects
            </h2>
            {strongSubjects.length > 0 ? (
              <div className="space-y-3">
                {strongSubjects.map((subject, index) => (
                  <div key={subject.subject} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {subject.subject}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {subject.count}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        students
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-500">
                <BookOpen className="w-12 h-12 mb-4" />
                <p>No strong subjects data available</p>
              </div>
            )}
          </div>

          {/* Recent Submissions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Survey Submissions
            </h2>
            {recentSubmissions.length > 0 ? (
              <div className="space-y-3">
                {recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                        {submission.studentName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {submission.studentName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Target: {submission.targetExam}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.floor((new Date() - new Date(submission.submittedAt)) / (1000 * 60 * 60 * 24))} days ago
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Clock className="w-12 h-12 mb-4" />
                <p>No recent submissions</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-purple-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Insights & Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">📊 Survey Insights</h4>
                  <ul className="space-y-1">
                    <li>• {totalResponses} students have completed the survey</li>
                    <li>• Average study time: {studyHoursDistribution.reduce((sum, item) => sum + (item.hours * item.count), 0) / totalResponses || 0} hours/day</li>
                    <li>• Most targeted exam: {examDistribution[0]?.name || 'N/A'}</li>
                    <li>• Completion rate: {completionRate}%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">💡 Recommendations</h4>
                  <ul className="space-y-1">
                    <li>• Focus on {weakSubjects[0]?.subject} - most common weak subject</li>
                    <li>• {averageStressLevel > 3.5 ? 'Implement stress management resources' : 'Continue current stress management approaches'}</li>
                    <li>• {averageConfidenceLevel < 3 ? 'Boost student confidence with more practice tests' : 'Maintain current confidence-building strategies'}</li>
                    <li>• Promote {resourcesUsed[0]?.resource} - most popular learning resource</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalytics;